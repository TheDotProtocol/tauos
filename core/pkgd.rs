use std::env;

fn print_usage() {
    println!("TauPkg - Tau OS Package Manager");
    println!("Usage: pkgd <command> [args]");
    println!("Commands:");
    println!("  install <package>   Install a package");
    println!("  remove <package>    Remove a package");
    println!("  list                List installed packages");
    println!("  query <package>     Show package info");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return;
    }
    match args[1].as_str() {
        "install" => {
            println!("[pkgd] Installing package: {}", args.get(2).unwrap_or(&"<none>".to_string()));
            // TODO: Implement install logic
        },
        "remove" => {
            println!("[pkgd] Removing package: {}", args.get(2).unwrap_or(&"<none>".to_string()));
            // TODO: Implement remove logic
        },
        "list" => {
            println!("[pkgd] Listing installed packages");
            // TODO: Implement list logic
        },
        "query" => {
            println!("[pkgd] Querying package: {}", args.get(2).unwrap_or(&"<none>".to_string()));
            // TODO: Implement query logic
        },
        _ => print_usage(),
    }
} 