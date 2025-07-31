use anyhow::Result;
use log::info;

fn main() -> Result<()> {
    env_logger::init();
    
    info!("gui-test starting up...");
    
    // Your application logic here
    println!("Hello from gui-test!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.gui-test");
    println!("Version: 0.1.0");
    println!("");
    println!("Note: GUI support will be added in a future update.");
    println!("For now, this is a console application.");
    
    info!("gui-test shutting down...");
    Ok(())
}
