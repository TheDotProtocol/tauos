use anyhow::Result;
use log::info;

fn main() -> Result<()> {
    env_logger::init();
    
    info!("hello-tau starting up...");
    
    // Your application logic here
    println!("Hello from hello-tau!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.hello-tau");
    println!("Version: 0.1.0");
    
    info!("hello-tau shutting down...");
    Ok(())
}
