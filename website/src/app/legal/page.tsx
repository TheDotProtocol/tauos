import React from 'react';
import Link from 'next/link';
import { Shield, Building, FileText, Mail, Globe, Users, Award } from 'lucide-react';

export default function LegalPage() {
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
              Legal & 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Compliance</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transparency and legal clarity are core to our mission. 
              Here you'll find all legal information about TauOS and AR Holdings Group.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Open Source</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Privacy First</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Building className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Company Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">AR Holdings Group</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Registration</h4>
                    <p className="text-gray-300 text-sm">
                      AR Holdings Group is registered in the United States in the state of California. 
                      Tau Foundation and Tau OS Labs LLC are part of AR Holdings Group.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Mission</h4>
                    <p className="text-gray-300 text-sm">
                      To develop and maintain privacy-first, open-source computing solutions 
                      that put users back in control of their digital lives.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Structure</h4>
                    <p className="text-gray-300 text-sm">
                      Open-core business model with community-driven development 
                      and transparent governance.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">TauOS Product</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Product Type</h4>
                    <p className="text-gray-300 text-sm">
                      TauOS is a privacy-first, AI-native operating system with 
                      integrated services and applications.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Development Model</h4>
                    <p className="text-gray-300 text-sm">
                      Open-core development with community contributions and 
                      transparent development processes.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Distribution</h4>
                    <p className="text-gray-300 text-sm">
                      Free download and use for personal and commercial purposes 
                      under open-source licensing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Licensing & Intellectual Property</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Open Source Licensing</h3>
                <p className="text-gray-300 mb-4">
                  All TauOS software is released under an open-core license that ensures:
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Freedom to Use:</strong> Free download and use for any purpose</li>
                  <li>• <strong>Freedom to Study:</strong> Access to source code for learning and modification</li>
                  <li>• <strong>Freedom to Share:</strong> Ability to distribute modified versions</li>
                  <li>• <strong>Freedom to Contribute:</strong> Community contributions welcome and encouraged</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Core Components</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Operating System Kernel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Desktop Environment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Core Applications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Security Framework</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Enterprise Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Advanced Security</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Enterprise Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Custom Deployment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Priority Updates</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">License Details</h3>
                <p className="text-gray-300 text-sm">
                  <strong>Note:</strong> The complete license text will be published soon. 
                  For licensing questions, contact <a href="mailto:legal@tauos.org" className="text-purple-400 hover:underline">legal@tauos.org</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hosting & Infrastructure Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-green-400" />
              <h2 className="text-3xl font-bold text-white">Hosting & Infrastructure</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Current Infrastructure</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">AWS Cloud Services</h4>
                    <p className="text-gray-300 text-sm">
                      Initial hosting provided by Amazon Web Services for reliability 
                      and global performance during launch phase.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Global CDN</h4>
                    <p className="text-gray-300 text-sm">
                      Content delivery network ensures fast downloads and updates 
                      worldwide with edge locations.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Security Measures</h4>
                    <p className="text-gray-300 text-sm">
                      SSL encryption, DDoS protection, and regular security audits 
                      to protect user data and downloads.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Future Infrastructure</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">TauCloud Migration</h4>
                    <p className="text-gray-300 text-sm">
                      Transitioning to TauCloud infrastructure for complete 
                      privacy and control over hosting services.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Decentralized Hosting</h4>
                    <p className="text-gray-300 text-sm">
                      Community-operated nodes and peer-to-peer distribution 
                      for maximum resilience and privacy.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Self-Hosted Options</h4>
                    <p className="text-gray-300 text-sm">
                      Complete self-hosting solutions for organizations requiring 
                      full control over their infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Compliance Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Privacy & Compliance</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Protection</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">GDPR Compliance</h4>
                    <p className="text-gray-300 text-sm">
                      Full compliance with European data protection regulations 
                      including right to access, rectification, and erasure.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">Zero Telemetry</h4>
                    <p className="text-gray-300 text-sm">
                      No user data collection, tracking, or analytics. 
                      Privacy by design in all TauOS components.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">Local Processing</h4>
                    <p className="text-gray-300 text-sm">
                      All data processing happens locally on user devices 
                      with optional cloud services only when explicitly enabled.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Security Standards</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Encryption</h4>
                    <p className="text-gray-300 text-sm">
                      End-to-end encryption for all communications and 
                      client-side encryption for stored data.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Audit Trail</h4>
                    <p className="text-gray-300 text-sm">
                      Transparent security practices with regular 
                      third-party audits and public security reports.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Vulnerability Disclosure</h4>
                    <p className="text-gray-300 text-sm">
                      Responsible disclosure program with bug bounty 
                      and coordinated vulnerability reporting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Contact & Support</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Legal Inquiries</h3>
                <p className="text-gray-300 text-sm mb-4">
                  For legal, compliance, or governance-related matters.
                </p>
                <a 
                  href="mailto:legal@tauos.org"
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  legal@tauos.org
                </a>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                <div className="bg-blue-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">General Support</h3>
                <p className="text-gray-300 text-sm mb-4">
                  For technical support and general questions.
                </p>
                <a 
                  href="mailto:support@tauos.org"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  support@tauos.org
                </a>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                <div className="bg-green-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <p className="text-gray-300 text-sm mb-4">
                  For business partnerships and enterprise inquiries.
                </p>
                <a 
                  href="mailto:partnerships@tauos.org"
                  className="text-green-400 hover:text-green-300 font-semibold"
                >
                  partnerships@tauos.org
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Response Times</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">Legal Inquiries</h4>
                  <p className="text-gray-300 text-sm">
                    We aim to respond to legal inquiries within 48 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">General Support</h4>
                  <p className="text-gray-300 text-sm">
                    Technical support responses typically within 24 hours, 
                    with community support available 24/7.
                  </p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              For the latest legal updates, governance changes, and compliance information, 
              subscribe to our legal newsletter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/governance"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Shield className="h-5 w-5" />
                View Governance
              </Link>
              <Link 
                href="/about"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Building className="h-5 w-5" />
                About TauOS
              </Link>
              <a 
                href="mailto:legal@tauos.org"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 border border-white/20 flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                Contact Legal
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 