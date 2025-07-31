use clap::{Parser, Subcommand};
use log::info;
use std::path::PathBuf;

mod commands;
mod manifest;
mod templates;
mod build;
mod package;
mod run;
mod test;
mod publish;
mod config;
mod utils;
// mod tauui; // Temporarily disabled due to GTK4 dependency issues

use commands::*;

#[derive(Parser)]
#[command(name = "tau-sdk")]
#[command(about = "Tau OS Developer SDK - Create, build, and publish Tau applications")]
#[command(version = "0.1.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(long, default_value = "info")]
    log_level: String,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new Tau application
    Init {
        /// Application name
        name: String,

        /// Programming language/framework
        #[arg(long, default_value = "rust")]
        lang: String,

        /// Template to use
        #[arg(long, default_value = "basic")]
        template: String,

        /// Output directory
        #[arg(long, default_value = ".")]
        output: PathBuf,
    },
    
    /// Build the application
    Build {
        /// Build target
        #[arg(long, default_value = "release")]
        target: String,
    },
    
    /// Package the application
    Package {
        /// Output path
        #[arg(long)]
        output: Option<PathBuf>,
    },
    
    /// Run the application
    Run {
        /// Application arguments
        args: Vec<String>,
    },
    
    /// Test the application
    Test {
        /// Test configuration file
        #[arg(long)]
        config: Option<PathBuf>,
    },
    
    /// Publish to TauStore
    Publish {
        /// API key
        #[arg(long)]
        api_key: Option<String>,
    },
    
    /// Generate documentation
    Docs {
        /// Output directory
        #[arg(long, default_value = "docs")]
        output: PathBuf,
    },
    
    /// Validate application
    Validate,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // Initialize logging
    env_logger::Builder::new()
        .filter_level(cli.log_level.parse().unwrap_or(log::LevelFilter::Info))
        .init();

    info!("Tau SDK v0.1.0");

    // Mock TauUI module test (GTK4 disabled for now)
    println!("✅ TauSDK loaded successfully (GTK4 UI components disabled for demo)");

    match cli.command {
        Commands::Init { name, lang, template, output } => {
            init_command(name, lang, template, output).await?;
        }
        Commands::Build { target } => {
            build_command(target).await?;
        }
        Commands::Package { output } => {
            package_command(output).await?;
        }
        Commands::Run { args } => {
            run_command(args).await?;
        }
        Commands::Test { config } => {
            test_command(config).await?;
        }
        Commands::Publish { api_key } => {
            publish_command(api_key).await?;
        }
        Commands::Docs { output } => {
            docs_command(output).await?;
        }
        Commands::Validate => {
            validate_command().await?;
        }
    }

    Ok(())
} 