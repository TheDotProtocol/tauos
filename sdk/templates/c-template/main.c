#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <gtk/gtk.h>
#include <tauos/tauos.h>

// Tau OS C API includes
#include <tauos/gui.h>
#include <tauos/network.h>
#include <tauos/storage.h>
#include <tauos/security.h>

typedef struct {
    GtkWidget *window;
    GtkWidget *main_box;
    GtkWidget *label;
    GtkWidget *button;
} AppData;

static void button_clicked(GtkWidget *widget, gpointer data) {
    AppData *app_data = (AppData *)data;
    gtk_label_set_text(GTK_LABEL(app_data->label), "Hello from Tau OS C App!");
    
    // Example of Tau OS API usage
    tau_notification_show("Button Clicked", "You clicked the button!", "info");
}

static void app_activate(GtkApplication *app, gpointer user_data) {
    AppData *app_data = malloc(sizeof(AppData));
    
    // Create main window
    app_data->window = gtk_application_window_new(app);
    gtk_window_set_title(GTK_WINDOW(app_data->window), "Tau OS C App");
    gtk_window_set_default_size(GTK_WINDOW(app_data->window), 400, 300);
    
    // Create main container
    app_data->main_box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 20);
    gtk_widget_set_margin_start(app_data->main_box, 20);
    gtk_widget_set_margin_end(app_data->main_box, 20);
    gtk_widget_set_margin_top(app_data->main_box, 20);
    gtk_widget_set_margin_bottom(app_data->main_box, 20);
    
    // Create label
    app_data->label = gtk_label_new("Welcome to Tau OS!");
    gtk_label_set_xalign(GTK_LABEL(app_data->label), 0.5);
    gtk_label_set_yalign(GTK_LABEL(app_data->label), 0.5);
    gtk_box_append(GTK_BOX(app_data->main_box), app_data->label);
    
    // Create button
    app_data->button = gtk_button_new_with_label("Click Me!");
    g_signal_connect(app_data->button, "clicked", G_CALLBACK(button_clicked), app_data);
    gtk_box_append(GTK_BOX(app_data->main_box), app_data->button);
    
    // Set up window
    gtk_window_set_child(GTK_WINDOW(app_data->window), app_data->main_box);
    gtk_widget_show(app_data->window);
}

int main(int argc, char *argv[]) {
    // Initialize Tau OS
    tau_init();
    
    // Create GTK application
    GtkApplication *app = gtk_application_new("org.tauos.c-app", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(app_activate), NULL);
    
    // Run the application
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    
    // Cleanup
    g_object_unref(app);
    tau_cleanup();
    
    return status;
} 