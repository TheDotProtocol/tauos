use clap::{Parser, Subcommand};
use std::path::PathBuf;
use tau_pkg::PackageManager;

#[derive(Parser)]
#[command(name = "tau-pkg", about = "TauOS Package Manager", version)]
struct Cli {
    #[arg(long, default_value = "/")]
    root: PathBuf,
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Install { package: String },
    Remove { package: String },
}

fn main() -> anyhow::Result<()> {
    env_logger::init();
    let cli = Cli::parse();
    let mut pm = PackageManager::new(cli.root)?;

    match cli.command {
        Commands::Install { package } => {
            pm.install_package(&package)?;
            println!("Installed {package}");
        }
        Commands::Remove { package } => {
            pm.remove_package(&package)?;
            println!("Removed {package}");
        }
    }

    Ok(())
}
