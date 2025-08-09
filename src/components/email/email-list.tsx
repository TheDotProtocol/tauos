import React from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Star as StarFilled, 
  Paperclip, 
  Trash2, 
  Archive,
  Mail,
  Send,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime, truncateText } from "@/lib/utils";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  priority: "high" | "normal" | "low";
}

interface EmailListProps {
  emails: Email[];
  selectedEmail: string | null;
  onEmailSelect: (emailId: string) => void;
  onEmailStar: (emailId: string) => void;
  onEmailDelete: (emailId: string) => void;
  onEmailArchive: (emailId: string) => void;
}

export function EmailList({ 
  emails, 
  selectedEmail, 
  onEmailSelect, 
  onEmailStar, 
  onEmailDelete, 
  onEmailArchive 
}: EmailListProps) {
  return (
    <div className="h-full overflow-y-auto">
      {emails.map((email, index) => (
        <motion.div
          key={email.id}
          className={cn(
            "flex items-center space-x-4 p-4 border-b border-tau-dark-600 cursor-pointer transition-all duration-200",
            selectedEmail === email.id
              ? "bg-tau-primary/10 border-tau-primary/30"
              : "hover:bg-tau-dark-700",
            !email.isRead && "bg-tau-dark-700/50 font-medium"
          )}
          onClick={() => onEmailSelect(email.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Star Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmailStar(email.id);
            }}
            className="flex-shrink-0 p-1 hover:bg-tau-dark-600 rounded-full transition-colors"
          >
            {email.isStarred ? (
              <StarFilled className="w-4 h-4 text-tau-primary fill-current" />
            ) : (
              <Star className="w-4 h-4 text-gray-400 hover:text-tau-primary" />
            )}
          </button>

          {/* Email Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "text-sm font-medium",
                  email.isRead ? "text-gray-300" : "text-white"
                )}>
                  {email.from}
                </span>
                {email.priority === "high" && (
                  <span className="w-2 h-2 bg-error rounded-full"></span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                {email.hasAttachments && (
                  <Paperclip className="w-3 h-3" />
                )}
                <span>{formatRelativeTime(email.timestamp)}</span>
              </div>
            </div>
            
            <h3 className={cn(
              "text-sm font-medium mb-1 truncate",
              email.isRead ? "text-gray-300" : "text-white"
            )}>
              {email.subject}
            </h3>
            
            <p className="text-sm text-gray-400 truncate">
              {truncateText(email.preview, 100)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmailArchive(email.id);
              }}
              className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors"
            >
              <Archive className="w-4 h-4 text-gray-400 hover:text-tau-primary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmailDelete(email.id);
              }}
              className="p-1 hover:bg-tau-dark-600 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-error" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 