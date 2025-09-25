use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "tau")]
#[command(about = "Tau OS Developer SDK CLI", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    New { app_name: String },
    Build,
    Run,
    Package,
    Publish,
    Login,
}

fn main() {
    let cli = Cli::parse();
    match &cli.command {
        Commands::New { app_name } => {
            println!("[tau] Scaffolding new Tau App: {}", app_name);
            // TODO: Create folder, tau.toml, template
        },
        Commands::Build => {
            println!("[tau] Building app...");
            // TODO: Build logic
        },
        Commands::Run => {
            println!("[tau] Running app in dev sandbox...");
            // TODO: Run logic
        },
        Commands::Package => {
            println!("[tau] Packaging app as .taupkg...");
            // TODO: Package logic
        },
        Commands::Publish => {
            println!("[tau] Publishing app to TauStore...");
            // TODO: Publish logic
        },
        Commands::Login => {
            println!("[tau] Logging in to TauStore...");
            // TODO: Auth logic
        },
    }
} 