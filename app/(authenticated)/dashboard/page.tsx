'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardData, DashboardData } from '@/api/dashboard';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import {
  Plus,
  PlayCircle,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with New Suite Button */}
      <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div>
          <h1 className="text-4xl font-medium text-zinc-200 mb-2 tracking-tight">
            Welcome to TestFlow
          </h1>
          <p className="text-lg text-zinc-400 font-light">
            AI-powered checklist testing tool for efficient test management
          </p>
        </div>
        <Link href="/suites/new">
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Test Suite
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Test Runs */}
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-200">Active Test Runs</h2>
            <Link href="/executions">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-zinc-800/50 h-20 rounded-lg" />
              ))}
            </div>
          ) : data?.activeExecutions && data.activeExecutions.length > 0 ? (
            <div className="space-y-3">
              {data.activeExecutions.map((execution) => {
                const progress =
                  execution.total_items > 0
                    ? Math.round(
                        (((execution.passed_items || 0) +
                          (execution.failed_items || 0) +
                          (execution.blocked_items || 0)) /
                          execution.total_items) *
                          100
                      )
                    : 0;

                return (
                  <Link
                    key={execution.id}
                    href={`/executions/${execution.id}`}
                    className="block"
                  >
                    <div className="bg-[#1a1a1c] border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-zinc-200 mb-1 truncate">
                            {execution.name}
                          </h3>
                          <p className="text-xs text-zinc-500">
                            {execution.suite?.name}
                          </p>
                        </div>
                        <Badge variant="default" className="ml-3">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-400">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={PlayCircle}
              title="No active test runs"
              description="Start a test execution to see it here"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-200">Recent Activity</h2>
            <Activity className="w-5 h-5 text-zinc-600" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-zinc-800/50 h-16 rounded-lg" />
              ))}
            </div>
          ) : data?.recentExecutions && data.recentExecutions.length > 0 ? (
            <div className="space-y-3">
              {data.recentExecutions.map((execution) => {
                const passRate =
                  execution.total_items > 0
                    ? Math.round(
                        ((execution.passed_items || 0) / execution.total_items) * 100
                      )
                    : 0;

                return (
                  <Link
                    key={execution.id}
                    href={`/suites/${execution.suite_id}?tab=executions`}
                    className="block"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1a1a1c] transition-all">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          execution.status === 'completed'
                            ? 'bg-green-500/10'
                            : 'bg-blue-500/10'
                        }`}
                      >
                        {execution.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 mb-1 truncate">
                          {execution.name}
                        </p>
                        <p className="text-xs text-zinc-500 mb-1">
                          {execution.suite?.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-green-500">
                            {execution.passed_items || 0}P
                          </span>
                          <span className="text-red-500">
                            {execution.failed_items || 0}F
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-500">{passRate}% pass</span>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600 flex-shrink-0">
                        {new Date(execution.started_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Execute tests to see activity here"
            />
          )}
        </div>
      </div>
    </div>
  );
}

