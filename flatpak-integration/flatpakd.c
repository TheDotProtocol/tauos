#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <json-c/json.h>
#include <gtk/gtk.h>
#include <dbus/dbus.h>
#include <flatpak/flatpak.h>

#define FLATPAK_REPO_PATH "/var/lib/flatpak"
#define FLATPAK_APPS_PATH "/var/lib/flatpak/app"
#define FLATPAK_RUNTIME_PATH "/var/lib/flatpak/runtime"
#define FLATPAK_CONFIG_PATH "/etc/tau/flatpak.toml"

typedef struct {
    char app_id[256];
    char name[256];
    char version[64];
    char description[512];
    char permissions[64][64];
    int permission_count;
    int installed;
    int running;
} flatpak_app_t;

typedef struct {
    char app_id[256];
    char permission[64];
    int granted;
    time_t timestamp;
} flatpak_permission_t;

// Global state
static flatpak_app_t installed_apps[1024];
static int app_count = 0;
static flatpak_permission_t permissions[1024];
static int permission_count = 0;

// Parse Flatpak app metadata
int parse_flatpak_metadata(const char *app_id, flatpak_app_t *app) {
    char metadata_path[512];
    snprintf(metadata_path, sizeof(metadata_path), "%s/%s/current/active/metadata", 
             FLATPAK_APPS_PATH, app_id);
    
    FILE *f = fopen(metadata_path, "r");
    if (!f) {
        return -1;
    }
    
    // Parse metadata file (simplified)
    char line[512];
    while (fgets(line, sizeof(line), f)) {
        line[strcspn(line, "\n")] = 0;
        
        if (strncmp(line, "Name=", 5) == 0) {
            strcpy(app->name, line + 5);
        } else if (strncmp(line, "Version=", 8) == 0) {
            strcpy(app->version, line + 8);
        } else if (strncmp(line, "Comment=", 8) == 0) {
            strcpy(app->description, line + 8);
        }
    }
    
    fclose(f);
    return 0;
}

// Discover installed Flatpak apps
int discover_flatpak_apps() {
    DIR *dir = opendir(FLATPAK_APPS_PATH);
    if (!dir) {
        return -1;
    }
    
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_type == DT_DIR && strcmp(entry->d_name, ".") != 0 && strcmp(entry->d_name, "..") != 0) {
            flatpak_app_t app = {0};
            strcpy(app.app_id, entry->d_name);
            
            if (parse_flatpak_metadata(entry->d_name, &app) == 0) {
                app.installed = 1;
                installed_apps[app_count] = app;
                app_count++;
            }
        }
    }
    
    closedir(dir);
    return 0;
}

// Check if permission is granted
int is_permission_granted(const char *app_id, const char *permission) {
    for (int i = 0; i < permission_count; i++) {
        if (strcmp(permissions[i].app_id, app_id) == 0 &&
            strcmp(permissions[i].permission, permission) == 0) {
            return permissions[i].granted;
        }
    }
    return 0;
}

// Show permission prompt for Flatpak app
int show_flatpak_permission_prompt(const char *app_id, const char *permission) {
    gtk_init(NULL, NULL);
    
    GtkWidget *dialog = gtk_dialog_new_with_buttons(
        "Flatpak Permission Request",
        NULL,
        GTK_DIALOG_MODAL,
        "Allow",
        GTK_RESPONSE_ACCEPT,
        "Deny",
        GTK_RESPONSE_REJECT,
        NULL
    );
    
    GtkWidget *content = gtk_dialog_get_content_area(GTK_DIALOG(dialog));
    
    GtkWidget *label = gtk_label_new(NULL);
    char message[1024];
    snprintf(message, sizeof(message),
        "<b>%s</b> (Flatpak) is requesting permission to:\n\n"
        "<b>%s</b>\n\n"
        "Do you want to allow this permission?",
        app_id, permission);
    
    gtk_label_set_markup(GTK_LABEL(label), message);
    gtk_widget_set_margin_start(label, 20);
    gtk_widget_set_margin_end(label, 20);
    gtk_widget_set_margin_top(label, 20);
    gtk_widget_set_margin_bottom(label, 20);
    
    gtk_container_add(GTK_CONTAINER(content), label);
    gtk_widget_show_all(dialog);
    
    gint result = gtk_dialog_run(GTK_DIALOG(dialog));
    gtk_widget_destroy(dialog);
    
    return (result == GTK_RESPONSE_ACCEPT);
}

// Install Flatpak app
int install_flatpak_app(const char *app_id, const char *remote) {
    char cmd[1024];
    snprintf(cmd, sizeof(cmd), "flatpak install --user %s %s", remote, app_id);
    
    printf("[flatpakd] Installing %s from %s...\n", app_id, remote);
    int result = system(cmd);
    
    if (result == 0) {
        printf("[flatpakd] Successfully installed %s\n", app_id);
        // Refresh app list
        discover_flatpak_apps();
    } else {
        printf("[flatpakd] Failed to install %s\n", app_id);
    }
    
    return result;
}

// Uninstall Flatpak app
int uninstall_flatpak_app(const char *app_id) {
    char cmd[512];
    snprintf(cmd, sizeof(cmd), "flatpak uninstall --user %s", app_id);
    
    printf("[flatpakd] Uninstalling %s...\n", app_id);
    int result = system(cmd);
    
    if (result == 0) {
        printf("[flatpakd] Successfully uninstalled %s\n", app_id);
        // Refresh app list
        discover_flatpak_apps();
    } else {
        printf("[flatpakd] Failed to uninstall %s\n", app_id);
    }
    
    return result;
}

// Launch Flatpak app with sandboxing
int launch_flatpak_app(const char *app_id, char **args) {
    // Check permissions first
    flatpak_app_t *app = NULL;
    for (int i = 0; i < app_count; i++) {
        if (strcmp(installed_apps[i].app_id, app_id) == 0) {
            app = &installed_apps[i];
            break;
        }
    }
    
    if (!app) {
        fprintf(stderr, "App %s not found\n", app_id);
        return -1;
    }
    
    // Check and request permissions
    for (int i = 0; i < app->permission_count; i++) {
        if (!is_permission_granted(app_id, app->permissions[i])) {
            int granted = show_flatpak_permission_prompt(app_id, app->permissions[i]);
            if (granted) {
                // Add to permission database
                if (permission_count < 1024) {
                    strcpy(permissions[permission_count].app_id, app_id);
                    strcpy(permissions[permission_count].permission, app->permissions[i]);
                    permissions[permission_count].granted = 1;
                    permissions[permission_count].timestamp = time(NULL);
                    permission_count++;
                }
            } else {
                fprintf(stderr, "Permission denied: %s\n", app->permissions[i]);
                return 1;
            }
        }
    }
    
    // Launch the app
    char cmd[1024];
    snprintf(cmd, sizeof(cmd), "flatpak run %s", app_id);
    
    // Add additional arguments
    if (args && args[0]) {
        strcat(cmd, " ");
        for (int i = 0; args[i]; i++) {
            strcat(cmd, args[i]);
            if (args[i + 1]) strcat(cmd, " ");
        }
    }
    
    printf("[flatpakd] Launching %s: %s\n", app_id, cmd);
    
    pid_t pid = fork();
    if (pid == 0) {
        // Child process
        execl("/bin/sh", "sh", "-c", cmd, NULL);
        perror("execl");
        exit(1);
    } else if (pid > 0) {
        // Parent process
        int status;
        waitpid(pid, &status, 0);
        printf("[flatpakd] App %s exited with status %d\n", app_id, status);
        return status;
    } else {
        perror("fork");
        return -1;
    }
}

// D-Bus interface for system integration
DBusHandlerResult handle_dbus_message(DBusConnection *conn, DBusMessage *msg, void *user_data) {
    const char *interface = dbus_message_get_interface(msg);
    const char *method = dbus_message_get_member(msg);
    
    if (strcmp(interface, "org.tau.FlatpakManager") == 0) {
        if (strcmp(method, "InstallApp") == 0) {
            // Handle install request
            DBusMessageIter iter;
            dbus_message_iter_init(msg, &iter);
            
            char *app_id, *remote;
            dbus_message_iter_get_arg(&iter, DBUS_TYPE_STRING, &app_id);
            dbus_message_iter_next(&iter);
            dbus_message_iter_get_arg(&iter, DBUS_TYPE_STRING, &remote);
            
            int result = install_flatpak_app(app_id, remote);
            
            // Send response
            DBusMessage *reply = dbus_message_new_method_return(msg);
            DBusMessageIter reply_iter;
            dbus_message_iter_init_append(reply, &reply_iter);
            dbus_message_iter_append_basic(&reply_iter, DBUS_TYPE_INT32, &result);
            dbus_connection_send(conn, reply, NULL);
            dbus_message_unref(reply);
            
            return DBUS_HANDLER_RESULT_HANDLED;
        } else if (strcmp(method, "UninstallApp") == 0) {
            // Handle uninstall request
            DBusMessageIter iter;
            dbus_message_iter_init(msg, &iter);
            
            char *app_id;
            dbus_message_iter_get_arg(&iter, DBUS_TYPE_STRING, &app_id);
            
            int result = uninstall_flatpak_app(app_id);
            
            // Send response
            DBusMessage *reply = dbus_message_new_method_return(msg);
            DBusMessageIter reply_iter;
            dbus_message_iter_init_append(reply, &reply_iter);
            dbus_message_iter_append_basic(&reply_iter, DBUS_TYPE_INT32, &result);
            dbus_connection_send(conn, reply, NULL);
            dbus_message_unref(reply);
            
            return DBUS_HANDLER_RESULT_HANDLED;
        } else if (strcmp(method, "LaunchApp") == 0) {
            // Handle launch request
            DBusMessageIter iter;
            dbus_message_iter_init(msg, &iter);
            
            char *app_id;
            dbus_message_iter_get_arg(&iter, DBUS_TYPE_STRING, &app_id);
            
            int result = launch_flatpak_app(app_id, NULL);
            
            // Send response
            DBusMessage *reply = dbus_message_new_method_return(msg);
            DBusMessageIter reply_iter;
            dbus_message_iter_init_append(reply, &reply_iter);
            dbus_message_iter_append_basic(&reply_iter, DBUS_TYPE_INT32, &result);
            dbus_connection_send(conn, reply, NULL);
            dbus_message_unref(reply);
            
            return DBUS_HANDLER_RESULT_HANDLED;
        }
    }
    
    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}

// Initialize D-Bus connection
DBusConnection* init_dbus() {
    DBusError error;
    dbus_error_init(&error);
    
    DBusConnection *conn = dbus_bus_get(DBUS_BUS_SYSTEM, &error);
    if (!conn) {
        fprintf(stderr, "Failed to connect to D-Bus: %s\n", error.message);
        dbus_error_free(&error);
        return NULL;
    }
    
    // Request name
    int result = dbus_bus_request_name(conn, "org.tau.FlatpakManager", 
                                     DBUS_NAME_FLAG_REPLACE_EXISTING, &error);
    if (result != DBUS_REQUEST_NAME_REPLY_PRIMARY_OWNER) {
        fprintf(stderr, "Failed to request D-Bus name: %s\n", error.message);
        dbus_error_free(&error);
        dbus_connection_unref(conn);
        return NULL;
    }
    
    // Add message filter
    dbus_connection_add_filter(conn, handle_dbus_message, NULL, NULL);
    
    return conn;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: flatpakd <command> [args...]\n");
        fprintf(stderr, "Commands:\n");
        fprintf(stderr, "  install <app-id> <remote>  Install Flatpak app\n");
        fprintf(stderr, "  uninstall <app-id>         Uninstall Flatpak app\n");
        fprintf(stderr, "  launch <app-id> [args...]  Launch Flatpak app\n");
        fprintf(stderr, "  daemon                     Run as daemon\n");
        return 1;
    }
    
    const char *command = argv[1];
    
    if (strcmp(command, "daemon") == 0) {
        printf("[flatpakd] Starting Flatpak integration daemon...\n");
        
        // Discover installed apps
        discover_flatpak_apps();
        printf("[flatpakd] Found %d installed Flatpak apps\n", app_count);
        
        // Initialize D-Bus
        DBusConnection *conn = init_dbus();
        if (!conn) {
            fprintf(stderr, "Failed to initialize D-Bus\n");
            return 1;
        }
        
        printf("[flatpakd] D-Bus interface ready at org.tau.FlatpakManager\n");
        
        // Main loop
        while (1) {
            dbus_connection_read_write_dispatch(conn, 100);
            usleep(100000); // 100ms
        }
        
        dbus_connection_unref(conn);
        
    } else if (strcmp(command, "install") == 0) {
        if (argc < 4) {
            fprintf(stderr, "Usage: flatpakd install <app-id> <remote>\n");
            return 1;
        }
        return install_flatpak_app(argv[2], argv[3]);
        
    } else if (strcmp(command, "uninstall") == 0) {
        if (argc < 3) {
            fprintf(stderr, "Usage: flatpakd uninstall <app-id>\n");
            return 1;
        }
        return uninstall_flatpak_app(argv[2]);
        
    } else if (strcmp(command, "launch") == 0) {
        if (argc < 3) {
            fprintf(stderr, "Usage: flatpakd launch <app-id> [args...]\n");
            return 1;
        }
        return launch_flatpak_app(argv[2], &argv[3]);
        
    } else {
        fprintf(stderr, "Unknown command: %s\n", command);
        return 1;
    }
    
    return 0;
} 