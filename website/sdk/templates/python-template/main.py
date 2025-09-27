#!/usr/bin/env python3
"""
Tau OS Python Application Template
A sample application demonstrating Tau OS Python bindings
"""

import gi
gi.require_version('Gtk', '4.0')
gi.require_version('TauOS', '1.0')

from gi.repository import Gtk, Gio, TauOS
import sys

class TauOSApp:
    def __init__(self, app):
        self.app = app
        self.window = None
        self.label = None
        self.button = None
        
        # Initialize Tau OS
        TauOS.init()
        
    def create_window(self):
        """Create the main application window"""
        self.window = Gtk.ApplicationWindow(
            application=self.app,
            title="Tau OS Python App",
            default_width=400,
            default_height=300
        )
        
        # Create main container
        main_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        main_box.set_margin_start(20)
        main_box.set_margin_end(20)
        main_box.set_margin_top(20)
        main_box.set_margin_bottom(20)
        
        # Create label
        self.label = Gtk.Label(label="Welcome to Tau OS!")
        self.label.set_xalign(0.5)
        self.label.set_yalign(0.5)
        main_box.append(self.label)
        
        # Create button
        self.button = Gtk.Button(label="Click Me!")
        self.button.connect("clicked", self.on_button_clicked)
        main_box.append(self.button)
        
        # Set up window
        self.window.set_child(main_box)
        
    def on_button_clicked(self, button):
        """Handle button click event"""
        self.label.set_text("Hello from Tau OS Python App!")
        
        # Example of Tau OS API usage
        TauOS.GUI.show_notification("Button Clicked", "You clicked the button!", "info")
        
    def on_activate(self, app):
        """Application activation handler"""
        self.create_window()
        self.window.present()
        
    def cleanup(self):
        """Cleanup Tau OS resources"""
        TauOS.cleanup()

def main():
    """Main application entry point"""
    app = Gtk.Application(
        application_id="org.tauos.python-app",
        flags=Gio.ApplicationFlags.HANDLES_OPEN
    )
    
    tau_app = TauOSApp(app)
    app.connect("activate", tau_app.on_activate)
    
    # Run the application
    status = app.run(sys.argv)
    
    # Cleanup
    tau_app.cleanup()
    
    return status

if __name__ == "__main__":
    sys.exit(main()) 