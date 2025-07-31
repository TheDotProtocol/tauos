use anyhow::Result;
use log::info;

fn main() -> Result<()> {
    env_logger::init();
    
    info!("Hello World application starting up...");
    
    // Your application logic here
    println!("Hello from Hello World!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.hello-world");
    println!("Version: 0.1.0");
    
    info!("Hello World application shutting down...");
    Ok(())
} 