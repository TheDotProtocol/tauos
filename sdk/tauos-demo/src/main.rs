use anyhow::Result;
use log::info;

fn main() -> Result<()> {
    env_logger::init();
    
    info!("tauos-demo starting up...");
    
    // Your application logic here
    println!("Hello from tauos-demo!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.tauos-demo");
    println!("Version: 0.1.0");
    println!("");
    println!("Note: GUI support will be added in a future update.");
    println!("For now, this is a console application.");
    
    info!("tauos-demo shutting down...");
    Ok(())
}
