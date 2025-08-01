import React from 'react';
import Link from 'next/link';
import { Users, Code, Palette, Server, Mail, Github, Twitter, Linkedin, Globe, Award, Heart, Zap } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join the Mission. Build the 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Future of Private Computing.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We're redefining what an operating system can be. TauOS is open-core, privacy-first, 
              and built in public with speed and passion. Join us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Fully Remote</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Open Source</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Openings Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Current Openings</h2>
            <p className="text-xl text-gray-300">
              Help shape the future of privacy-first computing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* UI/UX Designer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">UI/UX Designer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Help shape the look and feel of the TauOS desktop and apps (Mail, Cloud, Store). 
                Must match or exceed Apple-level polish.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Figma, Sketch, or similar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">GTK4/CSS experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Privacy-focused design</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">Full-time</span>
                <span className="text-gray-400 text-sm">Remote</span>
              </div>
            </div>

            {/* Full Stack Developer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Full Stack Developer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Work on TauStore, TauSettings, and app integrations. 
                TypeScript + Node.js + React/Tailwind or GTK4.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">TypeScript/JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">React/Next.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Rust/GTK4 (bonus)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">Full-time</span>
                <span className="text-gray-400 text-sm">Remote</span>
              </div>
            </div>

            {/* DevOps Engineer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">DevOps Engineer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Handle AWS setup, email/cloud infra, security hardening, CI/CD.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">AWS/Docker/Kubernetes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">CI/CD pipelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Security best practices</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold">Full-time</span>
                <span className="text-gray-400 text-sm">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why Join TauOS?</h2>
              <p className="text-xl text-gray-300">
                Work with bleeding-edge privacy tech and contribute to a movement, not just a product
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Bleeding-Edge Tech</h3>
                <p className="text-gray-300 text-sm">
                  Work with the latest privacy technologies, decentralized systems, 
                  and cutting-edge security frameworks.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Fully Remote</h3>
                <p className="text-gray-300 text-sm">
                  Work from anywhere in the world with flexible hours and 
                  a global team of passionate privacy advocates.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Contribute to a Movement</h3>
                <p className="text-gray-300 text-sm">
                  Be part of something bigger - helping millions of people 
                  regain control of their digital lives.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Early Contributor Benefits</h3>
                <p className="text-gray-300 text-sm">
                  Equity, long-term governance roles, and recognition as 
                  a founding member of the TauOS ecosystem.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Github className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Open Source First</h3>
                <p className="text-gray-300 text-sm">
                  All your work is open source, visible to the world, 
                  and contributes to the global privacy movement.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Amazing Team</h3>
                <p className="text-gray-300 text-sm">
                  Work with passionate, talented individuals who care about 
                  privacy, security, and user empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How to Apply</h2>
              <p className="text-xl text-gray-300">
                We value substance over form. Send us your story, not just a resume.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Share Your Story</h3>
                <p className="text-gray-300 text-sm">
                  Tell us about your journey, what drives you, and why privacy matters to you. 
                  Include your GitHub, portfolio, or any relevant work.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Technical Discussion</h3>
                <p className="text-gray-300 text-sm">
                  We'll have an open conversation about your technical background, 
                  problem-solving approach, and how you'd contribute to TauOS.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Join the Team</h3>
                <p className="text-gray-300 text-sm">
                  If we're a good fit, you'll join our distributed team and 
                  start contributing to the future of privacy-first computing.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Ready to Apply?</h3>
              <p className="text-gray-300 mb-6">
                Send us your GitHub, resume, or just your story. We're more interested in 
                your passion and potential than traditional credentials.
              </p>
              <a 
                href="mailto:careers@tauos.org"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                careers@tauos.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Culture</h2>
              <p className="text-xl text-gray-300">
                We're building more than software - we're building a movement
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Values</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Privacy First</h4>
                    <p className="text-gray-300 text-sm">
                      Every decision we make prioritizes user privacy and data sovereignty.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Transparency</h4>
                    <p className="text-gray-300 text-sm">
                      We believe in open processes, honest communication, and public accountability.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Innovation</h4>
                    <p className="text-gray-300 text-sm">
                      We push boundaries and explore new ways to protect user privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Work Style</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">Autonomy</h4>
                    <p className="text-gray-300 text-sm">
                      Take ownership of your work and make decisions that align with our mission.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">Collaboration</h4>
                    <p className="text-gray-300 text-sm">
                      Work with a global team of passionate individuals who share your values.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-pink-400 mb-2">Impact</h4>
                    <p className="text-gray-300 text-sm">
                      Every contribution directly helps millions of people protect their privacy.
                    </p>
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join us in building the future of privacy-first computing. 
              Your work will help millions of people regain control of their digital lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:careers@tauos.org"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                Apply Now
              </a>
              <Link 
                href="/governance"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Learn About Governance
              </Link>
              <Link 
                href="https://github.com/TheDotProtocol/tauos"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 border border-white/20 flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View Our Code
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 