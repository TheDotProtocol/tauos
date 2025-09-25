'use client';

import { Star, GitFork, Eye, Calendar, Lock, Globe } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface RepositoryCardProps {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: string;
  isPrivate: boolean;
  topics?: string[];
  owner: string;
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
  topics = [],
  owner
}: RepositoryCardProps) {
  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-green-500',
      'Rust': 'bg-orange-500',
      'Go': 'bg-cyan-500',
      'Java': 'bg-red-500',
      'C++': 'bg-purple-500',
      'C#': 'bg-indigo-500',
      'PHP': 'bg-pink-500',
      'Ruby': 'bg-red-600',
      'Swift': 'bg-orange-600',
      'Kotlin': 'bg-purple-600',
      'Dart': 'bg-blue-600',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-blue-500',
      'Vue': 'bg-green-600',
      'React': 'bg-cyan-500',
      'Angular': 'bg-red-500',
      'Svelte': 'bg-orange-500',
      'Solid': 'bg-blue-600',
    };
    return colors[lang] || 'bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            {isPrivate ? (
              <Lock className="h-4 w-4 text-gray-400" />
            ) : (
              <Globe className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {owner}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {topic}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{topics.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {/* Language */}
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`}></div>
            <span>{language}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="h-4 w-4" />
            <span>{forks}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{watchers}</span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatRelativeTime(lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}
