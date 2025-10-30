// components/StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  subtitle?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'blue',
  subtitle
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
  };

  const [bgClass, textClass, lightBgClass] = (colorClasses[color as keyof typeof colorClasses] || colorClasses.blue).split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {value && <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        <div className={`${lightBgClass} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${textClass}`} />
        </div>
      </div>
    </div>
  );
}
