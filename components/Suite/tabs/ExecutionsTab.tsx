'use client';

import { TestExecution } from '@/types';
import EmptyState from '@/components/shared/EmptyState';
import Badge from '@/components/shared/Badge';
import { History, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ExecutionsTabProps {
  executions: TestExecution[];
  onExecutionClick: (execution: TestExecution) => void;
}

export default function ExecutionsTab({
  executions,
  onExecutionClick,
}: ExecutionsTabProps) {
  if (executions.length === 0) {
    return (
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-8">
        <EmptyState
          icon={History}
          title="No test executions yet"
          description="Run your first test to see execution history here"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
      <h3 className="text-base font-medium text-zinc-200 mb-6">
        Execution History ({executions.length})
      </h3>

      <div className="space-y-3">
        {executions.map((execution) => {
          const passRate = execution.total_items
            ? Math.round(
                ((execution.passed_items || 0) / execution.total_items) * 100
              )
            : 0;

          const statusVariant =
            execution.status === 'completed'
              ? passRate === 100
                ? 'passed'
                : passRate >= 80
                ? 'medium'
                : 'failed'
              : 'default';

          return (
            <button
              key={execution.id}
              onClick={() => onExecutionClick(execution)}
              className="w-full p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={statusVariant as any}>
                      {execution.status}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(execution.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500" />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-xs mb-3">
                <span className="text-green-400">
                  {execution.passed_items || 0} passed
                </span>
                <span className="text-red-400">
                  {execution.failed_items || 0} failed
                </span>
                <span className="text-orange-400">
                  {execution.blocked_items || 0} blocked
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${
                        ((execution.passed_items || 0) /
                          (execution.total_items || 1)) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${
                        ((execution.failed_items || 0) /
                          (execution.total_items || 1)) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-orange-500"
                    style={{
                      width: `${
                        ((execution.blocked_items || 0) /
                          (execution.total_items || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
