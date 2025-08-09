import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Send, 
  Star, 
  Trash2, 
  Archive, 
  AlertCircle, 
  Settings,
  Plus,
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: "inbox", label: "Inbox", icon: Mail, count: 12 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "starred", label: "Starred", icon: Star, count: 3 },
  { id: "archive", label: "Archive", icon: Archive, count: 0 },
  { id: "spam", label: "Spam", icon: AlertCircle, count: 0 },
  { id: "trash", label: "Trash", icon: Trash2, count: 0 },
];

export function Sidebar({ isOpen, onToggle, activeSection, onSectionChange }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-tau-dark-800 border-r border-tau-dark-600 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-tau-dark-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-tau-gradient rounded-lg flex items-center justify-center">
                <span className="text-tau-dark-900 font-bold text-lg">τ</span>
              </div>
              <h1 className="text-xl font-bold text-white">TauMail</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Compose Button */}
          <div className="p-4">
            <Button
              className="w-full bg-tau-primary text-tau-dark-900 hover:bg-tau-primary/90"
              onClick={() => onSectionChange("compose")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                  activeSection === item.id
                    ? "bg-tau-primary/20 text-tau-primary border border-tau-primary/30"
                    : "text-gray-300 hover:bg-tau-dark-700 hover:text-white"
                )}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-tau-primary/20 text-tau-primary px-2 py-1 rounded-full text-xs font-medium">
                    {item.count}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-tau-dark-600">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSectionChange("settings")}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
} 