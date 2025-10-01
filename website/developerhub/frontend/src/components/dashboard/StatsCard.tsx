'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    period: string;
  };
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  trend
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeBgColor = () => {
    switch (changeType) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      {(change || trend) && (
        <div className="mt-4 flex items-center justify-between">
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeBgColor()} ${getChangeColor()}`}>
              {changeType === 'positive' && '+'}
              {change}
            </div>
          )}
          {trend && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
