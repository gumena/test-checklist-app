'use client';

import Select from '@/components/shared/Select';
import { Grid, List } from 'lucide-react';

interface SuiteFiltersProps {
  status: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onStatusChange: (status: string) => void;
  onSortChange: (sortBy: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function SuiteFilters({
  status,
  sortBy,
  viewMode,
  onStatusChange,
  onSortChange,
  onViewModeChange,
}: SuiteFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Status Filter */}
      <Select
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
        className="w-48"
      />

      {/* Sort By */}
      <Select
        value={sortBy}
        onChange={onSortChange}
        options={sortOptions}
        className="w-48"
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 bg-[#0f0f10] border border-zinc-800 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-zinc-800 text-zinc-200'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded transition-all duration-200 ${
            viewMode === 'list'
              ? 'bg-zinc-800 text-zinc-200'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
