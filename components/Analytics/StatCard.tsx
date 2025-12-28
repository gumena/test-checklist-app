import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-400 font-light mb-1">{title}</p>
          <h3 className="text-3xl font-medium text-zinc-200 mb-2">{value}</h3>
          {description && (
            <p className="text-xs text-zinc-500 font-light">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-zinc-500">vs last period</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="inline-flex p-3 rounded-lg bg-[#1a1a1c]">
            <Icon className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
