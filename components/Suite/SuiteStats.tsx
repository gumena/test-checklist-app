'use client';

import { TestSuiteWithDetails } from '@/types';
import { CheckSquare, Calendar, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SuiteStatsProps {
  suite: TestSuiteWithDetails;
}

export default function SuiteStats({ suite }: SuiteStatsProps) {
  const itemCount = suite.items?.length || 0;
  const lastExecution = suite.executions?.[0];
  const passRate = lastExecution
    ? Math.round(
        ((lastExecution.passed_items || 0) / (lastExecution.total_items || 1)) * 100
      )
    : 0;

  return (
    <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Items */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-light">Total Items</p>
            <p className="text-2xl font-medium text-zinc-200">{itemCount}</p>
          </div>
        </div>

        {/* Last Execution */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-light">Last Execution</p>
            <p className="text-base font-medium text-zinc-200">
              {lastExecution
                ? formatDistanceToNow(new Date(lastExecution.created_at), {
                    addSuffix: true,
                  })
                : 'Never'}
            </p>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-light">Pass Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-medium text-zinc-200">{passRate}%</p>
              {lastExecution && (
                <span className="text-xs text-zinc-500">
                  {lastExecution.passed_items}/{lastExecution.total_items}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {lastExecution && lastExecution.total_items > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>Test Results</span>
            <span>
              {lastExecution.passed_items} passed, {lastExecution.failed_items} failed
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-green-500"
                style={{
                  width: `${
                    ((lastExecution.passed_items || 0) /
                      lastExecution.total_items) *
                    100
                  }%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${
                    ((lastExecution.failed_items || 0) /
                      lastExecution.total_items) *
                    100
                  }%`,
                }}
              />
              <div
                className="bg-orange-500"
                style={{
                  width: `${
                    ((lastExecution.blocked_items || 0) /
                      lastExecution.total_items) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
