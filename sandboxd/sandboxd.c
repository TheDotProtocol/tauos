#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <string.h>
#include <errno.h>
#include <sched.h>
#include <sys/prctl.h>
#include <linux/seccomp.h>
#include <linux/filter.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <json-c/json.h>
#include <apparmor/apparmor.h>
#include <selinux/selinux.h>
#include <gtk/gtk.h>
#include <pthread.h>

#define MAX_PERMISSIONS 64
#define MAX_PATHS 128
#define MANIFEST_PATH "/usr/share/tau/apps/%s/manifest.tau"

typedef struct {
    char name[256];
    char version[64];
    char description[512];
    char permissions[MAX_PERMISSIONS][64];
    char allowed_paths[MAX_PATHS][256];
    char denied_paths[MAX_PATHS][256];
    int permission_count;
    int allowed_path_count;
    int denied_path_count;
    int network_access;
    int filesystem_access;
    int device_access;
    int system_access;
} app_manifest_t;

typedef struct {
    char app_name[256];
    char permission[64];
    char resource[256];
    int granted;
    time_t timestamp;
} permission_request_t;

// Global permission database
static permission_request_t permission_db[1024];
static int permission_count = 0;

// Parse manifest.tau file
int parse_manifest(const char *app_name, app_manifest_t *manifest) {
    char manifest_path[512];
    snprintf(manifest_path, sizeof(manifest_path), MANIFEST_PATH, app_name);
    
    FILE *f = fopen(manifest_path, "r");
    if (!f) {
        fprintf(stderr, "Cannot open manifest: %s\n", manifest_path);
        return -1;
    }
    
    // Parse TOML-like format
    char line[512];
    while (fgets(line, sizeof(line), f)) {
        line[strcspn(line, "\n")] = 0;
        
        if (strncmp(line, "name = ", 7) == 0) {
            strcpy(manifest->name, line + 7);
        } else if (strncmp(line, "version = ", 10) == 0) {
            strcpy(manifest->version, line + 10);
        } else if (strncmp(line, "description = ", 13) == 0) {
            strcpy(manifest->description, line + 13);
        } else if (strncmp(line, "permissions = [", 15) == 0) {
            // Parse permission list
            char *start = strchr(line, '[');
            char *end = strchr(line, ']');
            if (start && end) {
                start++;
                char *token = strtok(start, ",");
                while (token && manifest->permission_count < MAX_PERMISSIONS) {
                    // Remove quotes and whitespace
                    while (*token == ' ' || *token == '"') token++;
                    char *end_token = token + strlen(token) - 1;
                    while (end_token > token && (*end_token == ' ' || *end_token == '"')) end_token--;
                    *(end_token + 1) = 0;
                    
                    strcpy(manifest->permissions[manifest->permission_count], token);
                    manifest->permission_count++;
                    token = strtok(NULL, ",");
                }
            }
        }
    }
    
    fclose(f);
    return 0;
}

// Check if permission is already granted
int is_permission_granted(const char *app_name, const char *permission) {
    for (int i = 0; i < permission_count; i++) {
        if (strcmp(permission_db[i].app_name, app_name) == 0 &&
            strcmp(permission_db[i].permission, permission) == 0) {
            return permission_db[i].granted;
        }
    }
    return 0;
}

// Show permission prompt dialog
int show_permission_prompt(const char *app_name, const char *permission, const char *resource) {
    gtk_init(NULL, NULL);
    
    GtkWidget *dialog = gtk_dialog_new_with_buttons(
        "Permission Request",
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
        "<b>%s</b> is requesting permission to:\n\n"
        "<b>%s</b>\n\n"
        "Resource: %s\n\n"
        "Do you want to allow this permission?",
        app_name, permission, resource);
    
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

// Apply AppArmor profile
int apply_apparmor_profile(const char *app_name) {
    char profile_path[256];
    snprintf(profile_path, sizeof(profile_path), "/etc/apparmor.d/tau.%s", app_name);
    
    // Check if profile exists
    if (access(profile_path, F_OK) == -1) {
        // Create basic profile
        FILE *f = fopen(profile_path, "w");
        if (f) {
            fprintf(f, "#include <tunables/global>\n");
            fprintf(f, "profile tau.%s {\n", app_name);
            fprintf(f, "  #include <abstractions/base>\n");
            fprintf(f, "  /usr/bin/%s mr,\n", app_name);
            fprintf(f, "  /tmp/** rw,\n");
            fprintf(f, "  /home/*/.tau/apps/%s/** rw,\n", app_name);
            fprintf(f, "}\n");
            fclose(f);
        }
    }
    
    // Load profile
    char cmd[512];
    snprintf(cmd, sizeof(cmd), "apparmor_parser -r %s", profile_path);
    return system(cmd);
}

// Apply SELinux context
int apply_selinux_context(const char *app_name) {
    char context[256];
    snprintf(context, sizeof(context), "tau_%s_exec_t", app_name);
    
    // Set process context
    if (setexeccon(context) == -1) {
        // Fallback to unconfined if context doesn't exist
        setexeccon("unconfined_t");
    }
    
    return 0;
}

// Set up seccomp filter
int setup_seccomp_filter(const app_manifest_t *manifest) {
    struct sock_filter filter[] = {
        // Allow basic syscalls
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_read, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_write, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_exit, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_exit_group, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_brk, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_mmap, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_munmap, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_rt_sigreturn, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
        
        // Check for network access permission
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_socket, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->network_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_connect, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->network_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_bind, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->network_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        
        // Check for filesystem access permission
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_open, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->filesystem_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_openat, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->filesystem_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        
        // Check for device access permission
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_ioctl, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, manifest->device_access ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL),
        
        // Deny everything else
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL),
    };
    
    struct sock_fprog prog = {
        .len = sizeof(filter) / sizeof(filter[0]),
        .filter = filter,
    };
    
    return prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog);
}

// Create namespaces and apply sandboxing
int setup_sandbox(const app_manifest_t *manifest) {
    // Create user namespace
    if (unshare(CLONE_NEWUSER) == -1) {
        perror("unshare user namespace");
        return -1;
    }
    
    // Create PID namespace
    if (unshare(CLONE_NEWPID) == -1) {
        perror("unshare PID namespace");
        return -1;
    }
    
    // Create network namespace if no network access
    if (!manifest->network_access) {
        if (unshare(CLONE_NEWNET) == -1) {
            perror("unshare network namespace");
            return -1;
        }
    }
    
    // Create mount namespace
    if (unshare(CLONE_NEWNS) == -1) {
        perror("unshare mount namespace");
        return -1;
    }
    
    // Apply AppArmor profile
    apply_apparmor_profile(manifest->name);
    
    // Apply SELinux context
    apply_selinux_context(manifest->name);
    
    // Set up seccomp filter
    if (setup_seccomp_filter(manifest) == -1) {
        perror("seccomp filter");
        return -1;
    }
    
    return 0;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: sandboxd <app-name> [args...]\n");
        return 1;
    }
    
    const char *app_name = argv[1];
    printf("[sandboxd] Launching %s in sandbox...\n", app_name);
    
    // Parse app manifest
    app_manifest_t manifest = {0};
    if (parse_manifest(app_name, &manifest) == -1) {
        fprintf(stderr, "Failed to parse manifest for %s\n", app_name);
        return 1;
    }
    
    // Check and request permissions
    for (int i = 0; i < manifest.permission_count; i++) {
        if (!is_permission_granted(app_name, manifest.permissions[i])) {
            int granted = show_permission_prompt(app_name, manifest.permissions[i], "system resource");
            if (granted) {
                // Add to permission database
                if (permission_count < 1024) {
                    strcpy(permission_db[permission_count].app_name, app_name);
                    strcpy(permission_db[permission_count].permission, manifest.permissions[i]);
                    permission_db[permission_count].granted = 1;
                    permission_db[permission_count].timestamp = time(NULL);
                    permission_count++;
                }
            } else {
                fprintf(stderr, "Permission denied: %s\n", manifest.permissions[i]);
                return 1;
            }
        }
    }
    
    // Set up sandbox
    if (setup_sandbox(&manifest) == -1) {
        fprintf(stderr, "Failed to set up sandbox\n");
        return 1;
    }
    
    // Launch the app
    pid_t pid = fork();
    if (pid == 0) {
        // Child process - execute the app
        char app_path[512];
        snprintf(app_path, sizeof(app_path), "/usr/bin/%s", app_name);
        
        execvp(app_path, &argv[1]);
        perror("execvp");
        exit(1);
    } else if (pid > 0) {
        // Parent process - monitor the app
        int status;
        waitpid(pid, &status, 0);
        printf("[sandboxd] App %s exited with status %d\n", app_name, status);
    } else {
        perror("fork");
        return 1;
    }
    
    return 0;
} 