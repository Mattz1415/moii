import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-lg overflow-x-auto scrollbar-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
              isActive
                ? 'bg-red-600 text-white shadow-sm shadow-red-900/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-red-800 text-red-100' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
