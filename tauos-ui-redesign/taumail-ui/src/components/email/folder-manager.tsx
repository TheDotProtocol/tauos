import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder,
  FolderPlus,
  Edit3,
  Trash2,
  X,
  Plus,
  Move,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Folder {
  id: string;
  name: string;
  color: string;
  emailCount: number;
  isSystem?: boolean;
}

interface FolderManagerProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onCreateFolder: (name: string, color: string) => void;
  onUpdateFolder: (id: string, name: string, color: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveToFolder: (emailId: string, folderId: string) => void;
  selectedEmailId?: string;
}

const folderColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
];

export function FolderManager({ 
  isOpen, 
  onClose, 
  folders, 
  onCreateFolder, 
  onUpdateFolder, 
  onDeleteFolder,
  onMoveToFolder,
  selectedEmailId 
}: FolderManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(folderColors[0]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor);
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  const handleUpdateFolder = (id: string) => {
    if (newFolderName.trim()) {
      onUpdateFolder(id, newFolderName.trim(), selectedColor);
      setNewFolderName("");
      setEditingFolder(null);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Are you sure you want to delete this folder? All emails in this folder will be moved to Inbox.")) {
      onDeleteFolder(id);
    }
  };

  const handleMoveToFolder = (folderId: string) => {
    if (selectedEmailId) {
      onMoveToFolder(selectedEmailId, folderId);
      onClose();
    }
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
            className="w-full max-w-md bg-tau-dark-800 rounded-xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-tau-dark-600">
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5 text-tau-primary" />
                <h2 className="text-xl font-semibold text-white">
                  {selectedEmailId ? "Move to Folder" : "Manage Folders"}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Create New Folder */}
              {!selectedEmailId && (
                <div className="space-y-3">
                  {isCreating ? (
                    <Card variant="glass" className="p-4">
                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="Folder name"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="bg-tau-dark-700 border-tau-dark-600"
                        />
                        
                        {/* Color Picker */}
                        <div className="space-y-2">
                          <span className="text-sm text-gray-400">Color:</span>
                          <div className="flex flex-wrap gap-2">
                            {folderColors.map((color) => (
                              <button
                                key={color}
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 transition-all",
                                  selectedColor === color 
                                    ? "border-white scale-110" 
                                    : "border-transparent hover:scale-105"
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim()}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Create
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsCreating(false);
                              setNewFolderName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsCreating(true)}
                    >
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Create New Folder
                    </Button>
                  )}
                </div>
              )}

              {/* Folder List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {selectedEmailId ? "Select Folder:" : "Your Folders:"}
                </h3>
                
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    className="flex items-center justify-between p-3 bg-tau-dark-700 rounded-lg hover:bg-tau-dark-600 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: folder.color }}
                      />
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{folder.name}</span>
                        {folder.emailCount > 0 && (
                          <span className="text-xs text-gray-400">
                            ({folder.emailCount})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {selectedEmailId ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveToFolder(folder.id)}
                        >
                          <Move className="w-4 h-4" />
                        </Button>
                      ) : (
                        <>
                          {!folder.isSystem && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingFolder(folder.id);
                                  setNewFolderName(folder.name);
                                  setSelectedColor(folder.color);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFolder(folder.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Edit Folder Modal */}
                <AnimatePresence>
                  {editingFolder && (
                    <motion.div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="w-full max-w-sm bg-tau-dark-800 rounded-xl shadow-2xl p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">Edit Folder</h3>
                        
                        <div className="space-y-4">
                          <Input
                            type="text"
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="bg-tau-dark-700 border-tau-dark-600"
                          />
                          
                          <div className="space-y-2">
                            <span className="text-sm text-gray-400">Color:</span>
                            <div className="flex flex-wrap gap-2">
                              {folderColors.map((color) => (
                                <button
                                  key={color}
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 transition-all",
                                    selectedColor === color 
                                      ? "border-white scale-110" 
                                      : "border-transparent hover:scale-105"
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setSelectedColor(color)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateFolder(editingFolder)}
                              disabled={!newFolderName.trim()}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingFolder(null);
                                setNewFolderName("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 