use gtk4::prelude::*;
use gtk4::{Box as GtkBox, Button, Label, Entry, ProgressBar, Switch, Separator, Frame, ScrolledWindow, Revealer, Stack, Notebook, ListBox, ListBoxRow, ComboBoxText, Scale, Adjustment, Dialog, ApplicationWindow, Orientation, Window, Image};
use crate::icons::{TauIcons, helpers as icon_helpers};

/// Modern UI Widget Library for TauOS
pub struct TauWidgets;

impl TauWidgets {
    /// Create a modern title bar
    pub fn create_titlebar(title: &str, show_controls: bool) -> GtkBox {
        let titlebar = GtkBox::new(Orientation::Horizontal, 0);
        titlebar.add_css_class("titlebar");
        
        let title_label = Label::new(Some(title));
        title_label.add_css_class("titlebar-title");
        titlebar.append(&title_label);
        
        if show_controls {
            let controls_box = GtkBox::new(Orientation::Horizontal, 8);
            controls_box.add_css_class("titlebar-controls");
            
            let minimize_btn = Button::new();
            minimize_btn.add_css_class("control-btn");
            minimize_btn.add_css_class("minimize");
            
            let maximize_btn = Button::new();
            maximize_btn.add_css_class("control-btn");
            maximize_btn.add_css_class("maximize");
            
            let close_btn = Button::new();
            close_btn.add_css_class("control-btn");
            close_btn.add_css_class("close");
            
            controls_box.append(&minimize_btn);
            controls_box.append(&maximize_btn);
            controls_box.append(&close_btn);
            titlebar.append(&controls_box);
        }
        
        titlebar
    }
    
    /// Create a modern sidebar
    pub fn create_sidebar() -> GtkBox {
        let sidebar = GtkBox::new(Orientation::Vertical, 0);
        sidebar.add_css_class("sidebar");
        sidebar.set_size_request(240, -1);
        sidebar
    }
    
    /// Create a sidebar item with icon and label
    pub fn create_sidebar_item(icon_name: &str, label: &str, active: bool) -> GtkBox {
        let item = icon_helpers::sidebar_item(icon_name, label);
        
        if active {
            item.add_css_class("active");
        }
        
        item
    }
    
    /// Create a modern button with icon
    pub fn create_button(label: &str, icon: Option<&str>) -> Button {
        if let Some(icon_name) = icon {
            icon_helpers::icon_button(icon_name, label)
        } else {
            Button::with_label(label)
        }
    }
    
    /// Create a secondary button
    pub fn create_secondary_button(label: &str, icon: Option<&str>) -> Button {
        let button = Self::create_button(label, icon);
        button.add_css_class("secondary");
        button
    }
    
    /// Create a modern entry field
    pub fn create_entry(placeholder: &str) -> Entry {
        let entry = Entry::new();
        entry.set_placeholder_text(Some(placeholder));
        entry.add_css_class("entry");
        entry
    }
    
    /// Create a modern card/panel
    pub fn create_card() -> Frame {
        let card = Frame::new(None);
        card.add_css_class("card");
        card
    }
    
    /// Create a progress bar
    pub fn create_progress_bar() -> ProgressBar {
        let progress = ProgressBar::new();
        progress.set_show_text(true);
        progress
    }
    
    /// Create a toggle switch
    pub fn create_switch() -> Switch {
        Switch::new()
    }
    
    /// Create a modern list box
    pub fn create_list_box() -> ListBox {
        let list_box = ListBox::new();
        list_box.set_selection_mode(gtk4::SelectionMode::Single);
        list_box
    }
    
    /// Create a list box row
    pub fn create_list_row(title: &str, subtitle: Option<&str>) -> ListBoxRow {
        let row = ListBoxRow::new();
        let box_widget = GtkBox::new(Orientation::Vertical, 4);
        
        let title_label = Label::new(Some(title));
        title_label.add_css_class("title");
        box_widget.append(&title_label);
        
        if let Some(sub) = subtitle {
            let subtitle_label = Label::new(Some(sub));
            subtitle_label.add_css_class("subtitle");
            box_widget.append(&subtitle_label);
        }
        
        row.set_child(Some(&box_widget));
        row
    }
    
    /// Create a modern dialog
    pub fn create_dialog(title: &str, parent: Option<&Window>) -> Dialog {
        let dialog = Dialog::new();
        dialog.set_title(Some(title));
        dialog.add_css_class("dialog");
        
        if let Some(parent_window) = parent {
            dialog.set_transient_for(Some(parent_window));
        }
        
        dialog
    }
    
    /// Create a notification widget
    pub fn create_notification(title: &str, message: &str, notification_type: &str) -> Frame {
        let notification = Frame::new(None);
        notification.add_css_class("notification");
        notification.add_css_class(notification_type);
        
        let box_widget = GtkBox::new(Orientation::Vertical, 8);
        
        let title_label = Label::new(Some(title));
        title_label.add_css_class("title");
        box_widget.append(&title_label);
        
        let message_label = Label::new(Some(message));
        message_label.set_wrap(true);
        box_widget.append(&message_label);
        
        notification.set_child(Some(&box_widget));
        notification
    }
    
    /// Create a status indicator
    pub fn create_status_indicator(status: &str) -> GtkBox {
        icon_helpers::status_indicator(status)
    }
    
    /// Create a modern toolbar
    pub fn create_toolbar() -> GtkBox {
        let toolbar = GtkBox::new(Orientation::Horizontal, 8);
        toolbar.add_css_class("toolbar");
        toolbar.set_margin_start(16);
        toolbar.set_margin_end(16);
        toolbar.set_margin_top(8);
        toolbar.set_margin_bottom(8);
        toolbar
    }
    
    /// Create a modern search bar
    pub fn create_search_bar() -> GtkBox {
        let search_box = GtkBox::new(Orientation::Horizontal, 8);
        search_box.add_css_class("search-bar");
        
        let search_icon = icon_helpers::icon("system-search-symbolic", 16);
        search_box.append(&search_icon);
        
        let search_entry = Self::create_entry("Search...");
        search_box.append(&search_entry);
        
        search_box
    }
    
    /// Create a modern tab view
    pub fn create_tab_view() -> Notebook {
        let notebook = Notebook::new();
        notebook.add_css_class("tab-view");
        notebook
    }
    
    /// Create a modern stack (for page switching)
    pub fn create_stack() -> Stack {
        let stack = Stack::new();
        stack.add_css_class("stack");
        stack
    }
    
    /// Create a modern revealer (for animations)
    pub fn create_revealer() -> Revealer {
        let revealer = Revealer::new();
        revealer.add_css_class("revealer");
        revealer
    }
    
    /// Create a modern scrolled window
    pub fn create_scrolled_window() -> ScrolledWindow {
        let scrolled = ScrolledWindow::new();
        scrolled.add_css_class("scrolled-window");
        scrolled
    }
    
    /// Create a modern scale/slider
    pub fn create_scale(min: f64, max: f64, value: f64) -> Scale {
        let adjustment = Adjustment::new(value, min, max, 1.0, 10.0, 0.0);
        let scale = Scale::new(Orientation::Horizontal, Some(&adjustment));
        scale.add_css_class("scale");
        scale
    }
    
    /// Create a modern combo box
    pub fn create_combo_box() -> ComboBoxText {
        let combo = ComboBoxText::new();
        combo.add_css_class("combo-box");
        combo
    }
    
    /// Create a modern separator
    pub fn create_separator(orientation: Orientation) -> Separator {
        let separator = Separator::new(orientation);
        separator.add_css_class("separator");
        separator
    }
    
    /// Create a modern action bar (bottom toolbar)
    pub fn create_action_bar() -> GtkBox {
        let action_bar = GtkBox::new(Orientation::Horizontal, 8);
        action_bar.add_css_class("action-bar");
        action_bar.set_margin_start(16);
        action_bar.set_margin_end(16);
        action_bar.set_margin_top(8);
        action_bar.set_margin_bottom(8);
        action_bar
    }
    
    /// Create a modern header bar
    pub fn create_header_bar(title: &str) -> GtkBox {
        let header = GtkBox::new(Orientation::Horizontal, 0);
        header.add_css_class("header-bar");
        
        let title_label = Label::new(Some(title));
        title_label.add_css_class("header-title");
        header.append(&title_label);
        
        header
    }
    
    /// Create a modern status bar
    pub fn create_status_bar() -> GtkBox {
        let status_bar = GtkBox::new(Orientation::Horizontal, 8);
        status_bar.add_css_class("status-bar");
        status_bar.set_margin_start(16);
        status_bar.set_margin_end(16);
        status_bar.set_margin_top(4);
        status_bar.set_margin_bottom(4);
        status_bar
    }
    
    /// Create a modern breadcrumb navigation
    pub fn create_breadcrumb() -> GtkBox {
        let breadcrumb = GtkBox::new(Orientation::Horizontal, 4);
        breadcrumb.add_css_class("breadcrumb");
        breadcrumb
    }
    
    /// Create a modern breadcrumb item
    pub fn create_breadcrumb_item(label: &str, is_last: bool) -> GtkBox {
        let item = GtkBox::new(Orientation::Horizontal, 4);
        
        let label_widget = Label::new(Some(label));
        if is_last {
            label_widget.add_css_class("breadcrumb-current");
        } else {
            label_widget.add_css_class("breadcrumb-item");
        }
        
        item.append(&label_widget);
        
        if !is_last {
            let separator = Label::new(Some(">"));
            separator.add_css_class("breadcrumb-separator");
            item.append(&separator);
        }
        
        item
    }
    
    /// Create a modern tooltip
    pub fn create_tooltip(text: &str) -> Label {
        let tooltip = Label::new(Some(text));
        tooltip.add_css_class("tooltip");
        tooltip
    }
    
    /// Create a modern menu
    pub fn create_menu() -> gtk4::MenuButton {
        let menu_button = gtk4::MenuButton::new();
        menu_button.add_css_class("menu-button");
        menu_button
    }
    
    /// Create a modern popover
    pub fn create_popover() -> gtk4::Popover {
        let popover = gtk4::Popover::new();
        popover.add_css_class("popover");
        popover
    }
    
    /// Create a modern overlay
    pub fn create_overlay() -> gtk4::Overlay {
        let overlay = gtk4::Overlay::new();
        overlay.add_css_class("overlay");
        overlay
    }
    
    /// Create a modern grid layout
    pub fn create_grid() -> gtk4::Grid {
        let grid = gtk4::Grid::new();
        grid.add_css_class("grid");
        grid
    }
    
    /// Create a modern flow box
    pub fn create_flow_box() -> gtk4::FlowBox {
        let flow_box = gtk4::FlowBox::new();
        flow_box.add_css_class("flow-box");
        flow_box
    }
    
    /// Create a modern tree view
    pub fn create_tree_view() -> gtk4::TreeView {
        let tree_view = gtk4::TreeView::new();
        tree_view.add_css_class("tree-view");
        tree_view
    }
    
    /// Create a modern icon view
    pub fn create_icon_view() -> gtk4::IconView {
        let icon_view = gtk4::IconView::new();
        icon_view.add_css_class("icon-view");
        icon_view
    }
    
    /// Create a modern calendar
    pub fn create_calendar() -> gtk4::Calendar {
        let calendar = gtk4::Calendar::new();
        calendar.add_css_class("calendar");
        calendar
    }
    
    /// Create a modern color chooser
    pub fn create_color_chooser() -> gtk4::ColorChooserWidget {
        let color_chooser = gtk4::ColorChooserWidget::new();
        color_chooser.add_css_class("color-chooser");
        color_chooser
    }
    
    /// Create a modern file chooser
    pub fn create_file_chooser() -> gtk4::FileChooserWidget {
        let file_chooser = gtk4::FileChooserWidget::new(gtk4::FileChooserAction::Open);
        file_chooser.add_css_class("file-chooser");
        file_chooser
    }
    
    /// Create a modern font chooser
    pub fn create_font_chooser() -> gtk4::FontChooserWidget {
        let font_chooser = gtk4::FontChooserWidget::new();
        font_chooser.add_css_class("font-chooser");
        font_chooser
    }
    
    /// Create a modern print dialog
    pub fn create_print_dialog() -> gtk4::PrintUnixDialog {
        let print_dialog = gtk4::PrintUnixDialog::new(None::<&Window>, None);
        print_dialog.add_css_class("print-dialog");
        print_dialog
    }
    
    /// Create a modern about dialog
    pub fn create_about_dialog() -> gtk4::AboutDialog {
        let about_dialog = gtk4::AboutDialog::new();
        about_dialog.add_css_class("about-dialog");
        about_dialog
    }
    
    /// Create a modern message dialog
    pub fn create_message_dialog(message_type: gtk4::MessageType, title: &str, message: &str) -> gtk4::MessageDialog {
        let message_dialog = gtk4::MessageDialog::new(
            None::<&Window>,
            gtk4::DialogFlags::MODAL,
            message_type,
            gtk4::ButtonsType::Ok,
            message,
        );
        message_dialog.set_title(Some(title));
        message_dialog.add_css_class("message-dialog");
        message_dialog
    }
    
    /// Create a modern file dialog
    pub fn create_file_dialog(action: gtk4::FileChooserAction, title: &str) -> gtk4::FileChooserDialog {
        let file_dialog = gtk4::FileChooserDialog::new(
            Some(title),
            None::<&Window>,
            action,
            &[
                ("Cancel", gtk4::ResponseType::Cancel),
                ("Open", gtk4::ResponseType::Accept),
            ],
        );
        file_dialog.add_css_class("file-dialog");
        file_dialog
    }
}

/// Helper functions for common widget patterns
pub mod helpers {
    use super::*;
    
    /// Create a simple button
    pub fn button(label: &str) -> Button {
        TauWidgets::create_button(label, None)
    }
    
    /// Create a button with icon
    pub fn icon_button(label: &str, icon: &str) -> Button {
        TauWidgets::create_button(label, Some(icon))
    }
    
    /// Create a secondary button
    pub fn secondary_button(label: &str) -> Button {
        TauWidgets::create_secondary_button(label, None)
    }
    
    /// Create a simple entry
    pub fn entry(placeholder: &str) -> Entry {
        TauWidgets::create_entry(placeholder)
    }
    
    /// Create a simple card
    pub fn card() -> Frame {
        TauWidgets::create_card()
    }
    
    /// Create a simple progress bar
    pub fn progress_bar() -> ProgressBar {
        TauWidgets::create_progress_bar()
    }
    
    /// Create a simple switch
    pub fn switch() -> Switch {
        TauWidgets::create_switch()
    }
    
    /// Create a simple list box
    pub fn list_box() -> ListBox {
        TauWidgets::create_list_box()
    }
    
    /// Create a simple dialog
    pub fn dialog(title: &str) -> Dialog {
        TauWidgets::create_dialog(title, None)
    }
    
    /// Create a simple notification
    pub fn notification(title: &str, message: &str, notification_type: &str) -> Frame {
        TauWidgets::create_notification(title, message, notification_type)
    }
    
    /// Create a simple status indicator
    pub fn status_indicator(status: &str) -> GtkBox {
        TauWidgets::create_status_indicator(status)
    }
    
    /// Create a simple toolbar
    pub fn toolbar() -> GtkBox {
        TauWidgets::create_toolbar()
    }
    
    /// Create a simple search bar
    pub fn search_bar() -> GtkBox {
        TauWidgets::create_search_bar()
    }
    
    /// Create a simple tab view
    pub fn tab_view() -> Notebook {
        TauWidgets::create_tab_view()
    }
    
    /// Create a simple stack
    pub fn stack() -> Stack {
        TauWidgets::create_stack()
    }
    
    /// Create a simple revealer
    pub fn revealer() -> Revealer {
        TauWidgets::create_revealer()
    }
    
    /// Create a simple scrolled window
    pub fn scrolled_window() -> ScrolledWindow {
        TauWidgets::create_scrolled_window()
    }
    
    /// Create a simple scale
    pub fn scale(min: f64, max: f64, value: f64) -> Scale {
        TauWidgets::create_scale(min, max, value)
    }
    
    /// Create a simple combo box
    pub fn combo_box() -> ComboBoxText {
        TauWidgets::create_combo_box()
    }
    
    /// Create a simple separator
    pub fn separator(orientation: Orientation) -> Separator {
        TauWidgets::create_separator(orientation)
    }
    
    /// Create a simple action bar
    pub fn action_bar() -> GtkBox {
        TauWidgets::create_action_bar()
    }
    
    /// Create a simple header bar
    pub fn header_bar(title: &str) -> GtkBox {
        TauWidgets::create_header_bar(title)
    }
    
    /// Create a simple status bar
    pub fn status_bar() -> GtkBox {
        TauWidgets::create_status_bar()
    }
    
    /// Create a simple breadcrumb
    pub fn breadcrumb() -> GtkBox {
        TauWidgets::create_breadcrumb()
    }
    
    /// Create a simple tooltip
    pub fn tooltip(text: &str) -> Label {
        TauWidgets::create_tooltip(text)
    }
    
    /// Create a simple menu
    pub fn menu() -> gtk4::MenuButton {
        TauWidgets::create_menu()
    }
    
    /// Create a simple popover
    pub fn popover() -> gtk4::Popover {
        TauWidgets::create_popover()
    }
    
    /// Create a simple overlay
    pub fn overlay() -> gtk4::Overlay {
        TauWidgets::create_overlay()
    }
    
    /// Create a simple grid
    pub fn grid() -> gtk4::Grid {
        TauWidgets::create_grid()
    }
    
    /// Create a simple flow box
    pub fn flow_box() -> gtk4::FlowBox {
        TauWidgets::create_flow_box()
    }
    
    /// Create a simple tree view
    pub fn tree_view() -> gtk4::TreeView {
        TauWidgets::create_tree_view()
    }
    
    /// Create a simple icon view
    pub fn icon_view() -> gtk4::IconView {
        TauWidgets::create_icon_view()
    }
    
    /// Create a simple calendar
    pub fn calendar() -> gtk4::Calendar {
        TauWidgets::create_calendar()
    }
    
    /// Create a simple color chooser
    pub fn color_chooser() -> gtk4::ColorChooserWidget {
        TauWidgets::create_color_chooser()
    }
    
    /// Create a simple file chooser
    pub fn file_chooser() -> gtk4::FileChooserWidget {
        TauWidgets::create_file_chooser()
    }
    
    /// Create a simple font chooser
    pub fn font_chooser() -> gtk4::FontChooserWidget {
        TauWidgets::create_font_chooser()
    }
    
    /// Create a simple print dialog
    pub fn print_dialog() -> gtk4::PrintUnixDialog {
        TauWidgets::create_print_dialog()
    }
    
    /// Create a simple about dialog
    pub fn about_dialog() -> gtk4::AboutDialog {
        TauWidgets::create_about_dialog()
    }
    
    /// Create a simple message dialog
    pub fn message_dialog(message_type: gtk4::MessageType, title: &str, message: &str) -> gtk4::MessageDialog {
        TauWidgets::create_message_dialog(message_type, title, message)
    }
    
    /// Create a simple file dialog
    pub fn file_dialog(action: gtk4::FileChooserAction, title: &str) -> gtk4::FileChooserDialog {
        TauWidgets::create_file_dialog(action, title)
    }
} 