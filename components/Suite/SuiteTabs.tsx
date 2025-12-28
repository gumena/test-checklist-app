'use client';

import { CheckSquare, History, Settings } from 'lucide-react';

interface SuiteTabsProps {
  activeTab: 'items' | 'executions' | 'settings';
  onTabChange: (tab: 'items' | 'executions' | 'settings') => void;
}

export default function SuiteTabs({ activeTab, onTabChange }: SuiteTabsProps) {
  const tabs = [
    { id: 'items' as const, label: 'Checklist Items', icon: CheckSquare },
    { id: 'executions' as const, label: 'Executions', icon: History },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="border-b border-zinc-800 mb-6">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                isActive
                  ? 'text-zinc-200 border-zinc-400'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
