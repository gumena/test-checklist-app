'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllExecutions } from '@/api/executions';
import { getAllSuites } from '@/api/suites';
import { TestExecutionWithDetails, ExecutionStatus } from '@/types';
import ExecutionFilters from '@/components/Execution/ExecutionFilters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import Badge from '@/components/shared/Badge';
import { PlayCircle, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

export default function ExecutionsPage() {
  const router = useRouter();
  const [executions, setExecutions] = useState<TestExecutionWithDetails[]>([]);
  const [suites, setSuites] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | 'all'>('all');
  const [suiteFilter, setSuiteFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [executionsData, suitesData] = await Promise.all([
        getAllExecutions(),
        getAllSuites(),
      ]);

      setExecutions(executionsData);
      setSuites(suitesData.map((s) => ({ id: s.id, name: s.name })));
    } catch (error) {
      console.error('Error loading executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExecutions = executions.filter((execution) => {
    // Search filter
    if (searchQuery && !execution.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && execution.status !== statusFilter) {
      return false;
    }

    // Suite filter
    if (suiteFilter !== 'all' && execution.suite_id !== suiteFilter) {
      return false;
    }

    return true;
  });

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'aborted':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ExecutionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'aborted':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">
          Test Executions
        </h1>
        <p className="text-sm text-zinc-400 font-light">
          View and manage all test execution history
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1a1a1c]">
              <PlayCircle className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total Executions</p>
              <p className="text-2xl font-medium text-zinc-200">{executions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Completed</p>
              <p className="text-2xl font-medium text-zinc-200">
                {executions.filter((e) => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">In Progress</p>
              <p className="text-2xl font-medium text-zinc-200">
                {executions.filter((e) => e.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Aborted</p>
              <p className="text-2xl font-medium text-zinc-200">
                {executions.filter((e) => e.status === 'aborted').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ExecutionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        suiteFilter={suiteFilter}
        onSuiteChange={setSuiteFilter}
        suites={suites}
      />

      {/* Executions Table */}
      {filteredExecutions.length === 0 ? (
        <EmptyState
          icon={PlayCircle}
          title="No executions found"
          description={
            searchQuery || statusFilter !== 'all' || suiteFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start executing test suites to see them here'
          }
        />
      ) : (
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#0a0a0a]">
                  <th className="text-left text-xs font-medium text-zinc-400 py-3 px-4">
                    Execution Name
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-400 py-3 px-4">
                    Suite
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-400 py-3 px-4">
                    Status
                  </th>
                  <th className="text-center text-xs font-medium text-zinc-400 py-3 px-4">
                    Progress
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-400 py-3 px-4">
                    Results
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-400 py-3 px-4">
                    Started
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-400 py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExecutions.map((execution) => {
                  const total = execution.total_items || 0;
                  const passed = execution.passed_items || 0;
                  const failed = execution.failed_items || 0;
                  const blocked = execution.blocked_items || 0;
                  const tested = passed + failed + blocked;
                  const progress = total > 0 ? Math.round((tested / total) * 100) : 0;
                  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

                  return (
                    <tr
                      key={execution.id}
                      className="border-b border-zinc-800/50 hover:bg-[#1a1a1c] transition-colors cursor-pointer"
                      onClick={() => router.push(`/suites/${execution.suite_id}?tab=executions`)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#1a1a1c]">
                            <PlayCircle className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">
                              {execution.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-zinc-400">
                          {execution.suite?.name || 'Unknown Suite'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(execution.status)}`}>
                          {getStatusIcon(execution.status)}
                          <span className="text-xs font-medium capitalize">
                            {execution.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-full max-w-[120px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">
                            {tested}/{total} ({progress}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-500 font-medium">{passed}P</span>
                            <span className="text-red-500 font-medium">{failed}F</span>
                            <span className="text-yellow-500 font-medium">{blocked}B</span>
                          </div>
                          <span className="text-xs text-zinc-500">
                            Pass rate: {passRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-zinc-300">
                            {new Date(execution.started_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(execution.started_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="p-2 hover:bg-[#252527] rounded-lg transition-colors">
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
