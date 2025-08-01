import React from 'react';
import Link from 'next/link';
import { Shield, Users, FileText, Calendar, Vote, Github, Twitter, Discord } from 'lucide-react';

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to the
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> TauOS Collective</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A decentralized community building the future of privacy-first computing. 
              Join us in creating an open, transparent, and user-controlled digital ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">1,247 Contributors</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">89 Countries</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Open Governance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { name: 'Constitution', icon: FileText, href: '#constitution' },
              { name: 'Contributor Guidelines', icon: Users, href: '#guidelines' },
              { name: 'Community Roadmap', icon: Calendar, href: '#roadmap' },
              { name: 'Voting System', icon: Vote, href: '#voting' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="border-transparent text-gray-400 hover:text-white hover:border-purple-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Constitution Section */}
      <section id="constitution" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">TauOS Constitution</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Preamble</h3>
                <p className="text-gray-300 mb-4">
                  We, the contributors of TauOS, establish this constitution to ensure transparency, 
                  fairness, and collective ownership in the development of privacy-first computing.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4 mt-6">Article I: Core Principles</h3>
                <ul className="text-gray-300 space-y-2">
                  <li><strong>Privacy First:</strong> User privacy and data sovereignty are non-negotiable</li>
                  <li><strong>Open Source:</strong> All core components remain open and auditable</li>
                  <li><strong>Decentralized Governance:</strong> Community-driven decision making</li>
                  <li><strong>Transparency:</strong> All processes and decisions are public</li>
                  <li><strong>Inclusivity:</strong> Welcome contributors from all backgrounds</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-4 mt-6">Article II: Governance Structure</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Contributor Council</h4>
                    <p className="text-gray-300 text-sm">
                      Elected representatives from active contributors who guide strategic decisions.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Technical Committee</h4>
                    <p className="text-gray-300 text-sm">
                      Core developers and architects who ensure technical excellence.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    <strong>Note:</strong> This is a living document. The constitution will be updated 
                    through community voting as TauOS evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributor Guidelines Section */}
      <section id="guidelines" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Contributor Guidelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">1. Join the Community</h4>
                    <p className="text-gray-300 text-sm">
                      Start by joining our Discord, GitHub, or Reddit communities to introduce yourself.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">2. Choose Your Area</h4>
                    <p className="text-gray-300 text-sm">
                      Pick an area that interests you: development, design, documentation, testing, or community.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">3. Start Contributing</h4>
                    <p className="text-gray-300 text-sm">
                      Begin with small contributions and gradually take on larger projects.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Code of Conduct</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Be Respectful</h4>
                    <p className="text-gray-300 text-sm">
                      Treat all contributors with respect and kindness, regardless of experience level.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Be Inclusive</h4>
                    <p className="text-gray-300 text-sm">
                      Welcome contributors from all backgrounds and experience levels.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Be Transparent</h4>
                    <p className="text-gray-300 text-sm">
                      Communicate openly about your work and decision-making process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Recognition & Rewards</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Github className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold">GitHub Recognition</h4>
                  <p className="text-gray-300 text-sm">Contributions tracked and celebrated</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold">Governance Rights</h4>
                  <p className="text-gray-300 text-sm">Voting power in community decisions</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold">Community Status</h4>
                  <p className="text-gray-300 text-sm">Recognition as core contributor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Roadmap Section */}
      <section id="roadmap" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-green-400" />
              <h2 className="text-3xl font-bold text-white">Community Roadmap</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                  <div className="text-purple-400 text-sm font-semibold mb-2">Q1 2024</div>
                  <h3 className="text-lg font-semibold text-white mb-3">Foundation Phase</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Core OS development</li>
                    <li>• Basic GUI applications</li>
                    <li>• Community building</li>
                    <li>• Documentation setup</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                  <div className="text-blue-400 text-sm font-semibold mb-2">Q2 2024</div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ecosystem Growth</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• TauMail & TauCloud launch</li>
                    <li>• App Store development</li>
                    <li>• Governance system</li>
                    <li>• Beta testing program</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
                  <div className="text-green-400 text-sm font-semibold mb-2">Q3 2024</div>
                  <h3 className="text-lg font-semibold text-white mb-3">Public Launch</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Public beta release</li>
                    <li>• Community governance</li>
                    <li>• Third-party apps</li>
                    <li>• Educational content</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Current Focus Areas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Technical Priorities</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• TauID integration</li>
                      <li>• Voice assistant development</li>
                      <li>• Security hardening</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Community Priorities</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Governance framework</li>
                      <li>• Contributor onboarding</li>
                      <li>• Documentation improvement</li>
                      <li>• Educational resources</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voting System Section */}
      <section id="voting" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Vote className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Voting System</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">How Voting Works</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">1. Proposal Submission</h4>
                    <p className="text-gray-300 text-sm">
                      Any contributor can submit proposals for community review and discussion.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">2. Discussion Period</h4>
                    <p className="text-gray-300 text-sm">
                      Proposals are discussed for at least 7 days before voting begins.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">3. Community Vote</h4>
                    <p className="text-gray-300 text-sm">
                      Active contributors vote using their TauID for secure, verifiable voting.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Voting Power</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-900/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Core Contributors</h4>
                    <p className="text-gray-300 text-sm">
                      3x voting power for consistent, high-quality contributions over 6+ months.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-900/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Active Contributors</h4>
                    <p className="text-gray-300 text-sm">
                      2x voting power for regular contributions over 3+ months.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">New Contributors</h4>
                    <p className="text-gray-300 text-sm">
                      1x voting power for all verified contributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Current Proposals</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold">Enhanced Privacy Controls</h4>
                    <span className="text-green-400 text-sm font-semibold">Active</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Proposal to add granular privacy controls to TauOS settings panel.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Votes: 127</span>
                    <span className="text-green-400">87% Support</span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold">Mobile App Development</h4>
                    <span className="text-blue-400 text-sm font-semibold">Discussion</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Proposal to begin development of TauOS mobile companion apps.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Comments: 23</span>
                    <span className="text-blue-400">In Discussion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the TauOS Collective</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of building the future of privacy-first computing. 
              Your contributions shape the direction of TauOS.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="https://github.com/TheDotProtocol/tauos"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                Contribute on GitHub
              </Link>
              <Link 
                href="https://discord.gg/tauos"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Discord className="h-5 w-5" />
                Join Discord
              </Link>
              <Link 
                href="/careers"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 border border-white/20 flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                View Careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 