'use client';

import { TestSuiteWithDetails } from '@/types';
import SuiteCard from './SuiteCard';
import EmptyState from '@/components/shared/EmptyState';
import { FileText } from 'lucide-react';

interface SuiteListProps {
  suites: TestSuiteWithDetails[];
  viewMode: 'grid' | 'list';
  onEdit?: (suite: TestSuiteWithDetails) => void;
  onDelete?: (suite: TestSuiteWithDetails) => void;
  onDuplicate?: (suite: TestSuiteWithDetails) => void;
  onRun?: (suite: TestSuiteWithDetails) => void;
  onClick?: (suite: TestSuiteWithDetails) => void;
  onCreateNew?: () => void;
}

export default function SuiteList({
  suites,
  viewMode,
  onEdit,
  onDelete,
  onDuplicate,
  onRun,
  onClick,
  onCreateNew,
}: SuiteListProps) {
  if (suites.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No test suites found"
        description="Create your first test suite to get started with testing"
        actionLabel="Create Suite"
        onAction={onCreateNew}
      />
    );
  }

  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'flex flex-col gap-3';

  return (
    <div className={gridClasses}>
      {suites.map((suite) => (
        <SuiteCard
          key={suite.id}
          suite={suite}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onRun={onRun}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
