"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Star, 
  Shield, 
  Lock, 
  User, 
  Settings,
  Plus,
  Search,
  Bell,
  ArrowRight,
  Download,
  Upload,
  Trash2,
  Archive
} from "lucide-react";

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-tau-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-tau-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-tau-dark-900 font-bold text-3xl">τ</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">TauOS UI Components</h1>
          <p className="text-gray-400 text-lg">World-class design system for privacy-first applications</p>
        </motion.div>

        {/* Buttons Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Buttons</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Variants</h3>
                <div className="space-y-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="glass">Glass Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Sizes</h3>
                <div className="space-y-3">
                  <Button size="sm">Small Button</Button>
                  <Button size="md">Medium Button</Button>
                  <Button size="lg">Large Button</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">States</h3>
                <div className="space-y-3">
                  <Button loading={loading} onClick={handleLoadingClick}>
                    Loading Button
                  </Button>
                  <Button disabled>Disabled Button</Button>
                  <Button icon={<Plus className="w-4 h-4" />}>
                    With Icon
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Inputs Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Inputs</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Basic Inputs</h3>
                <Input
                  placeholder="Enter your email"
                  icon={<Mail className="w-4 h-4" />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  placeholder="Enter your password"
                  type="password"
                  icon={<Lock className="w-4 h-4" />}
                />
                <Input
                  placeholder="Search emails..."
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Glass Inputs</h3>
                <Input
                  placeholder="Glass input with icon"
                  variant="glass"
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  placeholder="With error state"
                  error="This field is required"
                  icon={<Bell className="w-4 h-4" />}
                />
                <Input
                  placeholder="With label"
                  label="Email Address"
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Cards Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-2">Default Card</h3>
              <p className="text-gray-400">This is a default card with standard styling.</p>
            </Card>
            
            <Card variant="glass">
              <h3 className="text-lg font-semibold text-white mb-2">Glass Card</h3>
              <p className="text-gray-400">This card uses glassmorphism effects.</p>
            </Card>
            
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-white mb-2">Elevated Card</h3>
              <p className="text-gray-400">This card has elevation and hover effects.</p>
            </Card>
          </div>
        </motion.section>

        {/* Email Interface Preview */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Email Interface Preview</h2>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-tau-gradient rounded-lg flex items-center justify-center">
                  <span className="text-tau-dark-900 font-bold">τ</span>
                </div>
                <h3 className="text-xl font-semibold text-white">TauMail</h3>
              </div>
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                Compose
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Email Item */}
              <div className="flex items-center space-x-4 p-4 bg-tau-dark-700 rounded-lg hover:bg-tau-dark-600 transition-colors">
                <Star className="w-4 h-4 text-tau-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">john.doe@company.com</span>
                    <span className="text-gray-400 text-sm">2 hours ago</span>
                  </div>
                  <h4 className="text-white font-medium mb-1">Project Update - Q4 Goals</h4>
                  <p className="text-gray-400 text-sm">Hi team, I wanted to share our progress on the Q4 objectives...</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors">
                    <Archive className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Email Item */}
              <div className="flex items-center space-x-4 p-4 bg-tau-dark-700 rounded-lg hover:bg-tau-dark-600 transition-colors">
                <Star className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">support@tauos.org</span>
                    <span className="text-gray-400 text-sm">4 hours ago</span>
                  </div>
                  <h4 className="text-white font-medium mb-1">Welcome to TauMail!</h4>
                  <p className="text-gray-400 text-sm">Welcome to your new privacy-first email experience...</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors">
                    <Archive className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Security Features */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-tau-primary" />
                <h3 className="text-lg font-semibold text-white">End-to-End Encryption</h3>
              </div>
              <p className="text-gray-400">All emails are encrypted by default, ensuring your privacy is protected.</p>
            </Card>
            
            <Card variant="glass">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-tau-primary" />
                <h3 className="text-lg font-semibold text-white">Zero Tracking</h3>
              </div>
              <p className="text-gray-400">No telemetry, no tracking, no compromises. Your data stays yours.</p>
            </Card>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass" className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience TauOS?</h2>
            <p className="text-gray-400 text-lg mb-6">
              Join the privacy-first revolution and take back control of your digital life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </Button>
              <Button variant="ghost" size="lg" icon={<Settings className="w-5 h-5" />}>
                Learn More
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
} 