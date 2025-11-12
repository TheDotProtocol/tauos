import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Code, Play, Download, Book, Zap, Shield, Globe, Terminal, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TauScript = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Globe,
      title: 'Write Once, Run Everywhere',
      description: 'Build apps that work seamlessly on desktop, mobile, web, and servers - all from a single codebase.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Compiled to native code for maximum performance. Faster than interpreted languages, safer than C++.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Zero telemetry, local execution by default. Your code runs on your terms, with complete privacy.'
    },
    {
      icon: Code,
      title: 'AI Native',
      description: 'Built-in machine learning capabilities and AI libraries. Build intelligent applications effortlessly.'
    }
  ];

  const codeExamples = [
    {
      title: 'Simple & Readable',
      code: `// Hello World in TauScript
fn main() {
    print("Hello, TauScript!");
    
    let name = "Developer";
    let version = 1.0;
    
    print(\`Welcome, \${name}! 
         Running TauScript \${version}\`);
}`
    },
    {
      title: 'Type Safe',
      code: `// Strong typing with inference
let count: int = 42;
let message = "Hello";  // Inferred as string
let isActive = true;    // Inferred as bool

// Optional types
let user: ?string = null;
let name = user ?? "Guest";`
    },
    {
      title: 'Async Built-in',
      code: `// Native async/await support
async fn fetchData(url: string) -> result<string> {
    let response = await http.get(url);
    return Ok(response.body);
}

// Concurrent execution
let data1 = fetchData("api.example.com/data1");
let data2 = fetchData("api.example.com/data2");
let results = await Promise.all([data1, data2]);`
    }
  ];

  return (
    <div className="App">
      <Header />
      <main style={{ background: 'var(--bg-primary)' }}>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center" style={{ 
          paddingTop: '80px',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
        }}>
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                    <span className="body-small">Privacy-First Programming Language</span>
                  </div>
                  
                  <h1 className="display-huge leading-tight">
                    The <span style={{ color: 'var(--brand-primary)' }}>Universal</span><br />
                    Programming Language
                  </h1>
                  
                  <p className="body-large max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                    TauScript combines Python's simplicity with Rust's performance. Write once, run everywhere—desktop, mobile, web, and servers. Built for privacy, powered by AI.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    className="btn-primary dark-button-animate" 
                    onClick={() => window.open('http://localhost:3000/ide', '_blank')}
                  >
                    <Play className="w-4 h-4" />
                    Open TauStudio IDE
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    className="btn-secondary dark-button-animate" 
                    onClick={() => navigate('/docs/tauscript')}
                  >
                    <Book className="w-4 h-4" />
                    Read the Docs
                  </Button>
                </div>

                <div className="flex items-center space-x-8 pt-8">
                  <div className="text-center">
                    <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>1</div>
                    <div className="body-small" style={{ color: 'var(--text-muted)' }}>Language</div>
                  </div>
                  <div className="text-center">
                    <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>∞</div>
                    <div className="body-small" style={{ color: 'var(--text-muted)' }}>Platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="heading-2" style={{ color: 'var(--brand-primary)' }}>0</div>
                    <div className="body-small" style={{ color: 'var(--text-muted)' }}>Telemetry</div>
                  </div>
                </div>
              </div>

              {/* Right - Code Preview */}
              <div className="glass p-8 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }}></div>
                  </div>
                  <span className="body-small" style={{ color: 'var(--text-muted)' }}>example.tau</span>
                </div>
                <pre className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
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

        {/* Features Section */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2 className="display-medium mb-6">
                Why <span style={{ color: 'var(--brand-primary)' }}>TauScript</span>?
              </h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A modern programming language designed for the privacy-first era. Powerful, safe, and simple.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="glass p-8 rounded-xl dark-hover dark-transition">
                    <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <h3 className="heading-3 mb-4">{feature.title}</h3>
                    <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2 className="display-medium mb-6">
                Code <span style={{ color: 'var(--brand-primary)' }}>Examples</span>
              </h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                See how simple and powerful TauScript is. From hello world to complex applications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {codeExamples.map((example, index) => (
                <div key={index} className="glass p-6 rounded-xl">
                  <h3 className="heading-4 mb-4">{example.title}</h3>
                  <pre className="text-xs overflow-x-auto" style={{ 
                    color: 'var(--text-primary)', 
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-32" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <h2 className="display-medium mb-6">
                TauScript vs <span style={{ color: 'var(--brand-primary)' }}>Other Languages</span>
              </h2>
              <p className="body-large max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                See how TauScript compares to popular programming languages in features, performance, and capabilities.
              </p>
            </div>

            <div className="glass p-8 rounded-xl overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--text-primary)' }}>Feature / Trait</th>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--brand-primary)' }}>TauScript</th>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--text-primary)' }}>Python</th>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--text-primary)' }}>JavaScript / TypeScript</th>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--text-primary)' }}>Rust</th>
                    <th className="text-left p-4 body-medium" style={{ color: 'var(--text-primary)' }}>Go</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Primary Design Philosophy</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>AI-native, privacy-first, cross-platform scripting for TauCore ecosystem</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>General-purpose, high-level scripting</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Web-centric, dynamically typed (JS) / static with tooling (TS)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Systems programming with safety guarantees</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Simple, fast, concurrent systems programming</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Typing System</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Strong static typing with smart inference</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Dynamic</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>JS: Dynamic / TS: Static</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Strong static</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Static</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Performance</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Near-native execution via TauVM and JIT optimization</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Slower (interpreted)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Moderate (depends on engine)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Very high (compiled)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>High (compiled)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>AI & ML Integration</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Built-in AI primitives (`tau/ai`, `LocalAI`, federated models)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>External libs (TensorFlow, PyTorch)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Third-party APIs</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Requires bindings</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Requires bindings</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Privacy & Security</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Federated learning, local inference, encrypted compute</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Minimal, dependent on libraries</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Weak (browser + Node vulnerabilities)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Strong (memory-safe)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Moderate</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Cross-Platform Capability</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Universal — desktop, web, cloud, TauCore OS</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Yes, via interpreter</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Yes, via browsers & Node.js</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Yes, compiled per target</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Yes, compiled per target</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Concurrency Model</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Async / await + message-based concurrency</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Threads, async frameworks</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Event loop / promises</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>async / await with `Future`</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Goroutines (simple, efficient)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Ease of Learning</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Moderate (Python-like syntax + strong typing)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Very easy</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Easy</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Harder (systems focus)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Moderate</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Toolchain & Packaging</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Integrated toolchain (`tau build`, `tau run`, `tau publish`)</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Pip / virtualenv</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>npm / yarn</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Cargo</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>go build / mod</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>AI Privacy Advantage</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Local inference, no external API calls</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Depends on external infra</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Relies on cloud APIs</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>External</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>External</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Error Handling</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Rust-style `result&lt;T, E&gt;` + pattern matching</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Exceptions</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Try/catch</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Result enum</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Error return values</td>
                  </tr>
                  <tr>
                    <td className="p-4 body-medium font-semibold" style={{ color: 'var(--text-primary)' }}>Ideal Use Case</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Building AI-enhanced, privacy-first, decentralized apps on TauCore</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Data science, quick automation</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Web / frontend apps</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>High-performance tools</td>
                    <td className="p-4 body-small" style={{ color: 'var(--text-secondary)' }}>Cloud services</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="display-medium mb-8">
                  One Language, <span style={{ color: 'var(--brand-primary)' }}>Every Platform</span>
                </h2>
                <div className="space-y-6">
                  {[
                    'Cross-platform by default - no special configurations',
                    'Native performance with memory safety',
                    'AI and ML libraries built-in',
                    'Zero telemetry, complete privacy',
                    'Type-safe with inference',
                    'Modern async/await support'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} />
                      <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-8 rounded-xl">
                <Terminal className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="heading-3 mb-4 text-center">Ready to Code?</h3>
                <p className="body-medium text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Start building with TauScript today. No setup required, runs in your browser.
                </p>
                <div className="flex flex-col space-y-4">
                  <Button 
                    className="btn-primary dark-button-animate w-full" 
                    onClick={() => window.open('http://localhost:3000/ide', '_blank')}
                  >
                    <Terminal className="w-4 h-4" />
                    Open TauStudio IDE
                  </Button>
                  <Button 
                    className="btn-secondary dark-button-animate w-full" 
                    onClick={() => navigate('/docs/tauscript')}
                  >
                    <Book className="w-4 h-4" />
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="display-medium mb-8">Start Building with TauScript</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Join developers building the future of privacy-first applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-primary dark-button-animate"
                onClick={() => window.open('http://localhost:3000/ide', '_blank')}
              >
                <Code className="w-5 h-5" />
                Open TauStudio IDE
              </Button>
              <Button 
                className="btn-secondary dark-button-animate"
                onClick={() => navigate('/download')}
              >
                <Download className="w-5 h-5" />
                Download TauOS
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

