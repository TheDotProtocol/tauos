/* Ported from newebsite/frontend/src/pages/TauScript.jsx — content preserved from legacy site */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Code,
  Play,
  Download,
  Book,
  Zap,
  Shield,
  Globe,
  Terminal,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Write Once, Run Everywhere",
    description:
      "Build apps that work seamlessly on desktop, mobile, web, and servers - all from a single codebase.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Compiled to native code for maximum performance. Faster than interpreted languages, safer than C++.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Zero telemetry, local execution by default. Your code runs on your terms, with complete privacy.",
  },
  {
    icon: Code,
    title: "AI Native",
    description:
      "Built-in machine learning capabilities and AI libraries. Build intelligent applications effortlessly.",
  },
];

const codeExamples = [
  {
    title: "Simple & Readable",
    code: `// Hello World in TauScript
fn main() {
    print("Hello, TauScript!");
    
    let name = "Developer";
    let version = 1.0;
    
    print(\`Welcome, \${name}! 
         Running TauScript \${version}\`);
}`,
  },
  {
    title: "Type Safe",
    code: `// Strong typing with inference
let count: int = 42;
let message = "Hello";  // Inferred as string
let isActive = true;    // Inferred as bool

// Optional types
let user: ?string = null;
let name = user ?? "Guest";`,
  },
  {
    title: "Async Built-in",
    code: `// Native async/await support
async fn fetchData(url: string) -> result<string> {
    let response = await http.get(url);
    return Ok(response.body);
}

// Concurrent execution
let data1 = fetchData("api.example.com/data1");
let data2 = fetchData("api.example.com/data2");
let results = await Promise.all([data1, data2]);`,
  },
];

export function TauScriptContent() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="min-h-screen flex items-center pt-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-300">Privacy-First Programming Language</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  The <span className="text-primary">Universal</span>
                  <br />
                  Programming Language
                </h1>

                <p className="text-xl text-gray-300 max-w-xl">
                  TauScript combines Python&apos;s simplicity with Rust&apos;s performance. Write once, run
                  everywhere—desktop, mobile, web, and servers. Built for privacy, powered by AI.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="gap-2">
                  <a href="https://developer.tauos.org/ide" target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4" />
                    Open TauStudio IDE
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/docs/tauscript">
                    <Book className="w-4 h-4" />
                    Read the Docs
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1</div>
                  <div className="text-sm text-gray-500">Language</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-gray-500">Platforms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Telemetry</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-sm text-gray-500">example.tau</span>
              </div>
              <pre className="text-sm text-gray-200 font-mono overflow-x-auto">
                <code>{`fn main() {
    print("Hello, TauScript!");
    
    // Type-safe, privacy-first
    let apps = ["Desktop", "Mobile", "Web"];
    
    for app in apps {
        print(\`TauScript runs on \${app}\`);
    }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why <span className="text-primary">TauScript</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A modern programming language designed for the privacy-first era. Powerful, safe, and simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-8 hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Code <span className="text-primary">Examples</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how simple and powerful TauScript is. From hello world to complex applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {codeExamples.map((example, index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold mb-4">{example.title}</h3>
                <pre className="text-xs overflow-x-auto text-gray-300 font-mono bg-black/50 p-4 rounded-lg border border-white/5">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              TauScript vs <span className="text-primary">Other Languages</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how TauScript compares to popular programming languages in features, performance, and
              capabilities.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-semibold">Feature / Trait</th>
                  <th className="text-left p-4 font-semibold text-primary">TauScript</th>
                  <th className="text-left p-4 font-semibold">Python</th>
                  <th className="text-left p-4 font-semibold">JavaScript / TypeScript</th>
                  <th className="text-left p-4 font-semibold">Rust</th>
                  <th className="text-left p-4 font-semibold">Go</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  [
                    "Primary Design Philosophy",
                    "AI-native, privacy-first, cross-platform scripting for TauCore ecosystem",
                    "General-purpose, high-level scripting",
                    "Web-centric, dynamically typed (JS) / static with tooling (TS)",
                    "Systems programming with safety guarantees",
                    "Simple, fast, concurrent systems programming",
                  ],
                  [
                    "Typing System",
                    "Strong static typing with smart inference",
                    "Dynamic",
                    "JS: Dynamic / TS: Static",
                    "Strong static",
                    "Static",
                  ],
                  [
                    "Performance",
                    "Near-native execution via TauVM and JIT optimization",
                    "Slower (interpreted)",
                    "Moderate (depends on engine)",
                    "Very high (compiled)",
                    "High (compiled)",
                  ],
                  [
                    "AI & ML Integration",
                    "Built-in AI primitives (tau/ai, LocalAI, federated models)",
                    "External libs (TensorFlow, PyTorch)",
                    "Third-party APIs",
                    "Requires bindings",
                    "Requires bindings",
                  ],
                  [
                    "Privacy & Security",
                    "Federated learning, local inference, encrypted compute",
                    "Minimal, dependent on libraries",
                    "Weak (browser + Node vulnerabilities)",
                    "Strong (memory-safe)",
                    "Moderate",
                  ],
                  [
                    "Cross-Platform Capability",
                    "Universal — desktop, web, cloud, TauCore OS",
                    "Yes, via interpreter",
                    "Yes, via browsers & Node.js",
                    "Yes, compiled per target",
                    "Yes, compiled per target",
                  ],
                  [
                    "Ideal Use Case",
                    "Building AI-enhanced, privacy-first, decentralized apps on TauCore",
                    "Data science, quick automation",
                    "Web / frontend apps",
                    "High-performance tools",
                    "Cloud services",
                  ],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-4 ${j === 0 ? "font-semibold text-white" : ""} ${j === 1 ? "text-gray-300" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">
                One Language, <span className="text-primary">Every Platform</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Cross-platform by default - no special configurations",
                  "Native performance with memory safety",
                  "AI and ML libraries built-in",
                  "Zero telemetry, complete privacy",
                  "Type-safe with inference",
                  "Modern async/await support",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-primary" />
                    <p className="text-gray-400">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <Terminal className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-bold mb-4">Ready to Code?</h3>
              <p className="text-gray-400 mb-8">
                Start building with TauScript today. No setup required, runs in your browser.
              </p>
              <div className="flex flex-col gap-4">
                <Button asChild className="w-full gap-2">
                  <a href="https://developer.tauos.org/ide" target="_blank" rel="noopener noreferrer">
                    <Terminal className="w-4 h-4" />
                    Open TauStudio IDE
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full gap-2">
                  <Link to="/docs/tauscript">
                    <Book className="w-4 h-4" />
                    View Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Building with TauScript</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join developers building the future of privacy-first applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gap-2">
              <a href="https://developer.tauos.org/ide" target="_blank" rel="noopener noreferrer">
                <Code className="w-5 h-5" />
                Open TauStudio IDE
              </a>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/download">
                <Download className="w-5 h-5" />
                Download TauOS
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
