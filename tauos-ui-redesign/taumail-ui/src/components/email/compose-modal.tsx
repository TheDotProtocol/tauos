import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Plus,
  FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: EmailData) => void;
  onSave: (email: EmailData) => void;
}

interface EmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments: File[];
  isEncrypted: boolean;
  priority: "low" | "normal" | "high";
}

export function ComposeModal({ isOpen, onClose, onSend, onSave }: ComposeModalProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    attachments: [],
    isEncrypted: true,
    priority: "normal"
  });
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (field: keyof EmailData, value: string | boolean | File[]) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(emailData);
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = () => {
    onSave(emailData);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl bg-tau-dark-800 rounded-xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-tau-dark-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-tau-gradient rounded-lg flex items-center justify-center">
                  <span className="text-tau-dark-900 font-bold text-sm">τ</span>
                </div>
                <h2 className="text-xl font-semibold text-white">Compose Email</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Email Form */}
            <div className="p-6 space-y-4">
              {/* Recipients */}
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="To"
                  value={emailData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  className="bg-tau-dark-700 border-tau-dark-600"
                />
                <Input
                  type="email"
                  placeholder="Cc"
                  value={emailData.cc}
                  onChange={(e) => handleInputChange("cc", e.target.value)}
                  className="bg-tau-dark-700 border-tau-dark-600"
                />
                {showBcc && (
                  <Input
                    type="email"
                    placeholder="Bcc"
                    value={emailData.bcc}
                    onChange={(e) => handleInputChange("bcc", e.target.value)}
                    className="bg-tau-dark-700 border-tau-dark-600"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-gray-400 hover:text-white"
                >
                  {showBcc ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showBcc ? "Hide Bcc" : "Add Bcc"}
                </Button>
              </div>

              {/* Subject */}
              <Input
                type="text"
                placeholder="Subject"
                value={emailData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="bg-tau-dark-700 border-tau-dark-600"
              />

              {/* Priority and Security */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Priority:</span>
                  <select
                    value={emailData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value as any)}
                    className="bg-tau-dark-700 border border-tau-dark-600 text-white rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={emailData.isEncrypted ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleInputChange("isEncrypted", !emailData.isEncrypted)}
                  >
                    {emailData.isEncrypted ? <Lock className="w-4 h-4 mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                    {emailData.isEncrypted ? "Encrypted" : "Not Encrypted"}
                  </Button>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="ghost" size="sm" asChild>
                      <span>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach Files
                      </span>
                    </Button>
                  </label>
                  <span className="text-sm text-gray-400">
                    {emailData.attachments.length} file(s) attached
                  </span>
                </div>
                
                {/* Attachment List */}
                {emailData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {emailData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-tau-dark-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Email Body */}
              <div className="space-y-2">
                <textarea
                  placeholder="Write your message here..."
                  value={emailData.body}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  className="w-full h-64 bg-tau-dark-700 border border-tau-dark-600 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-tau-primary/50"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-tau-dark-600">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSend}
                  loading={isSending}
                  icon={<Send className="w-4 h-4" />}
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 