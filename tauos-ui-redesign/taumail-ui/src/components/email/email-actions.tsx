import React from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw,
  Archive,
  Trash2,
  Folder,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
  Download,
  Share,
  Flag,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Move,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailActionsProps {
  selectedEmails: string[];
  onRefresh: () => void;
  onArchive: (emailIds: string[]) => void;
  onDelete: (emailIds: string[]) => void;
  onStar: (emailIds: string[]) => void;
  onUnstar: (emailIds: string[]) => void;
  onMoveToFolder: (emailIds: string[], folderId: string) => void;
  onReply: (emailId: string) => void;
  onForward: (emailId: string) => void;
  onMarkAsRead: (emailIds: string[]) => void;
  onMarkAsUnread: (emailIds: string[]) => void;
  onFlag: (emailIds: string[]) => void;
  onUnflag: (emailIds: string[]) => void;
  onCopy: (emailIds: string[]) => void;
  onDownload: (emailIds: string[]) => void;
  onShare: (emailIds: string[]) => void;
  isRefreshing?: boolean;
  showFolderManager?: () => void;
}

export function EmailActions({
  selectedEmails,
  onRefresh,
  onArchive,
  onDelete,
  onStar,
  onUnstar,
  onMoveToFolder,
  onReply,
  onForward,
  onMarkAsRead,
  onMarkAsUnread,
  onFlag,
  onUnflag,
  onCopy,
  onDownload,
  onShare,
  isRefreshing = false,
  showFolderManager
}: EmailActionsProps) {
  const hasSelection = selectedEmails.length > 0;
  const singleSelection = selectedEmails.length === 1;

  return (
    <motion.div
      className="flex items-center space-x-2 p-4 border-b border-tau-dark-600 bg-tau-dark-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Refresh */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        loading={isRefreshing}
        icon={<RefreshCw className="w-4 h-4" />}
      >
        Refresh
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-tau-dark-600" />

      {/* Selection-based actions */}
      {hasSelection && (
        <>
          {/* Star/Unstar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStar(selectedEmails)}
            icon={<Star className="w-4 h-4" />}
          >
            Star
          </Button>

          {/* Archive */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onArchive(selectedEmails)}
            icon={<Archive className="w-4 h-4" />}
          >
            Archive
          </Button>

          {/* Move to Folder */}
          <Button
            variant="ghost"
            size="sm"
            onClick={showFolderManager}
            icon={<Folder className="w-4 h-4" />}
          >
            Move
          </Button>

          {/* Mark as Read/Unread */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(selectedEmails)}
            icon={<Eye className="w-4 h-4" />}
          >
            Mark Read
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsUnread(selectedEmails)}
            icon={<EyeOff className="w-4 h-4" />}
          >
            Mark Unread
          </Button>

          {/* Flag */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFlag(selectedEmails)}
            icon={<Flag className="w-4 h-4" />}
          >
            Flag
          </Button>

          {/* Copy */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(selectedEmails)}
            icon={<Copy className="w-4 h-4" />}
          >
            Copy
          </Button>

          {/* Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(selectedEmails)}
            icon={<Download className="w-4 h-4" />}
          >
            Download
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(selectedEmails)}
            icon={<Share className="w-4 h-4" />}
          >
            Share
          </Button>

          {/* Divider */}
          <div className="w-px h-6 bg-tau-dark-600" />

          {/* Single email actions */}
          {singleSelection && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(selectedEmails[0])}
                icon={<Reply className="w-4 h-4" />}
              >
                Reply
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onForward(selectedEmails[0])}
                icon={<Forward className="w-4 h-4" />}
              >
                Forward
              </Button>
            </>
          )}

          {/* Delete */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(selectedEmails)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </>
      )}

      {/* Selection indicator */}
      {hasSelection && (
        <motion.div
          className="ml-auto px-3 py-1 bg-tau-primary/20 text-tau-primary rounded-full text-sm font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {selectedEmails.length} selected
        </motion.div>
      )}
    </motion.div>
  );
} 