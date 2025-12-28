'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/api/analytics';
import { AnalyticsData } from '@/types';
import StatCard from '@/components/Analytics/StatCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  FolderTree,
  CheckSquare,
  PlayCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await getAnalytics();
      setData(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-zinc-400">Failed to load analytics data</p>
      </div>
    );
  }

  const totalTests = data.recentExecutions.reduce(
    (sum, exec) => sum + (exec.total_items || 0),
    0
  );

  const totalPassed = data.recentExecutions.reduce(
    (sum, exec) => sum + (exec.passed_items || 0),
    0
  );

  const totalFailed = data.recentExecutions.reduce(
    (sum, exec) => sum + (exec.failed_items || 0),
    0
  );

  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">
          Analytics
        </h1>
        <p className="text-sm text-zinc-400 font-light">
          View insights and testing metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Suites"
          value={data.totalSuites}
          icon={FolderTree}
          description="Active test suites"
        />
        <StatCard
          title="Total Items"
          value={data.totalItems}
          icon={CheckSquare}
          description="Checklist items"
        />
        <StatCard
          title="Total Executions"
          value={data.totalExecutions}
          icon={PlayCircle}
          description="Test runs completed"
        />
        <StatCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={TrendingUp}
          description={`${totalPassed} passed, ${totalFailed} failed`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pass/Fail Trend Chart */}
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">
            Pass/Fail Trend (Last 30 Days)
          </h3>
          {data.passFailTrend.length > 0 ? (
            <div className="space-y-3">
              {data.passFailTrend.slice(-10).map((day, index) => {
                const total = day.passed + day.failed;
                const passPercent = total > 0 ? (day.passed / total) * 100 : 0;
                const failPercent = total > 0 ? (day.failed / total) * 100 : 0;

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-zinc-400">{day.date}</span>
                      <span className="text-xs text-zinc-500">
                        {day.passed}P / {day.failed}F
                      </span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                      <div
                        className="bg-green-500"
                        style={{ width: `${passPercent}%` }}
                      />
                      <div
                        className="bg-red-500"
                        style={{ width: `${failPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-8">
              No execution data available
            </p>
          )}
        </div>

        {/* Most Failed Items */}
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">
            Most Failed Items
          </h3>
          {data.mostFailedItems.length > 0 ? (
            <div className="space-y-3">
              {data.mostFailedItems.map((failedItem, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1a1a1c] rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-300 truncate">
                      {failedItem.item?.title || 'Unknown Item'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-red-500 ml-3">
                    {failedItem.failCount} fails
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-8">
              No failed items yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Executions */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">
          Recent Executions
        </h3>
        {data.recentExecutions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs font-medium text-zinc-400 pb-3 px-4">
                    Execution
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-400 pb-3 px-4">
                    Suite
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-400 pb-3 px-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-400 pb-3 px-4">
                    Results
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-400 pb-3 px-4">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentExecutions.map((execution) => {
                  const total = execution.total_items || 0;
                  const passed = execution.passed_items || 0;
                  const failed = execution.failed_items || 0;
                  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

                  return (
                    <tr
                      key={execution.id}
                      className="border-b border-zinc-800/50 hover:bg-[#1a1a1c] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-300">
                          {execution.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-400">
                          {execution.suite?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            execution.status === 'completed'
                              ? 'bg-green-500/10 text-green-500'
                              : execution.status === 'in_progress'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-zinc-500/10 text-zinc-500'
                          }`}
                        >
                          {execution.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="text-sm">
                          <span className="text-green-500">{passed}P</span>
                          <span className="text-zinc-600 mx-1">/</span>
                          <span className="text-red-500">{failed}F</span>
                          <span className="text-zinc-600 mx-1">/</span>
                          <span className="text-zinc-400">{total}T</span>
                          <span className="text-zinc-600 ml-2">({passRate}%)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-zinc-500">
                          {new Date(execution.started_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-8">
            No executions yet
          </p>
        )}
      </div>
    </div>
  );
}
