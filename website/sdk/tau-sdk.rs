use std::env;

fn print_usage() {
    println!("tau-sdk - Tau OS Developer CLI");
    println!("Usage: tau-sdk <command> [args]");
    println!("Commands:");
    println!("  new <app-name> [--lang <c|rust|python|web>]   Scaffold a new app");
    println!("  build                                        Build the app");
    println!("  package                                      Create a .tau-pkg");
    println!("  run                                          Run app in local sandbox");
    println!("  test                                         Run tests in emulator");
    println!("  publish                                      Submit to TauStore");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return;
    }
    match args[1].as_str() {
        "new" => {
            println!("[tau-sdk] Scaffolding new app: {}", args.get(2).unwrap_or(&"<none>".to_string()));
            // TODO: Implement scaffolding logic
        },
        "build" => {
            println!("[tau-sdk] Building app");
            // TODO: Implement build logic
        },
        "package" => {
            println!("[tau-sdk] Packaging app");
            // TODO: Implement packaging logic
        },
        "run" => {
            println!("[tau-sdk] Running app in sandbox");
            // TODO: Implement sandboxed run logic
        },
        "test" => {
            println!("[tau-sdk] Running tests in emulator");
            // TODO: Implement emulator test logic
        },
        "publish" => {
            println!("[tau-sdk] Publishing app to TauStore");
            // TODO: Implement publish logic
        },
        _ => print_usage(),
    }
} 