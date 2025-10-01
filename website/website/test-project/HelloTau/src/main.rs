use anyhow::Result;
use log::info;

fn main() -> Result<()> {
    env_logger::init();
    
    info!("HelloTau starting up...");
    
    // Your application logic here
    println!("Hello from HelloTau!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.HelloTau");
    println!("Version: 0.1.0");
    println!("");
    println!("Note: GUI support will be added in a future update.");
    println!("For now, this is a console application.");
    
    info!("HelloTau shutting down...");
    Ok(())
}
