'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  Eye, 
  Code, 
  Calendar,
  Lock,
  Globe
} from 'lucide-react';

interface RepositoryCardProps {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: Date;
  isPrivate: boolean;
  color?: string;
  delay?: number;
}

export default function RepositoryCard({
  name,
  description,
  language,
  stars,
  forks,
  watchers,
  lastUpdated,
  isPrivate,
  color = 'purple',
  delay = 0
}: RepositoryCardProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    red: 'from-red-500 to-pink-500',
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors duration-200">
              {name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {isPrivate ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span>{isPrivate ? 'Private' : 'Public'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Language */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span className="text-sm text-gray-400">{language}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{forks}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{watchers}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatRelativeTime(lastUpdated)}</span>
        </div>
      </div>
    </motion.div>
  );
}