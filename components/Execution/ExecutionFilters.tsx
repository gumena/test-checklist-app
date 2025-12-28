'use client';

import { ExecutionStatus } from '@/types';
import Select from '@/components/shared/Select';
import SearchInput from '@/components/shared/SearchInput';

interface ExecutionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ExecutionStatus | 'all';
  onStatusChange: (status: ExecutionStatus | 'all') => void;
  suiteFilter: string;
  onSuiteChange: (suiteId: string) => void;
  suites: { id: string; name: string }[];
}

export default function ExecutionFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  suiteFilter,
  onSuiteChange,
  suites,
}: ExecutionFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'aborted', label: 'Aborted' },
  ];

  const suiteOptions = [
    { value: 'all', label: 'All Suites' },
    ...suites.map((suite) => ({ value: suite.id, label: suite.name })),
  ];

  return (
    <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search executions..."
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            value={statusFilter}
            onChange={(value) => onStatusChange(value as ExecutionStatus | 'all')}
            options={statusOptions}
          />
        </div>

        {/* Suite Filter */}
        <div>
          <Select
            value={suiteFilter}
            onChange={(value) => onSuiteChange(value)}
            options={suiteOptions}
          />
        </div>
      </div>
    </div>
  );
}
