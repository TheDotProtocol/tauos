use gtk4::prelude::*;
use gtk4::{Grid, Widget, AnimationMode};

pub struct AnimatedGrid {
    pub grid: Grid,
}

impl AnimatedGrid {
    pub fn new() -> Self {
        let grid = Grid::builder()
            .row_spacing(24)
            .column_spacing(24)
            .margin_start(24)
            .margin_end(24)
            .build();
        Self { grid }
    }

    pub fn add_with_animation(&self, widget: &Widget) {
        // TODO: Add fade/scale animation when adding widget
        widget.set_opacity(0.0);
        self.grid.attach(widget, 0, 0, 1, 1);
        widget.add_tick_callback(|w, _| {
            let mut opacity = w.opacity();
            if opacity < 1.0 {
                opacity += 0.1;
                w.set_opacity(opacity.min(1.0));
                gtk4::Inhibit(false)
            } else {
                gtk4::Inhibit(true)
            }
        });
    }
} 