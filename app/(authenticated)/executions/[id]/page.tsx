'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getExecutionById, recordResult, completeExecution } from '@/api/executions';
import { TestExecutionWithDetails, ResultStatus, ExecutionResultWithDetails } from '@/types';
import { useToast } from '@/components/shared/ToastContainer';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, SkipForward, Check } from 'lucide-react';

interface ExecutionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [execution, setExecution] = useState<TestExecutionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    loadExecution();
  }, [id]);

  const loadExecution = async () => {
    try {
      setLoading(true);
      const data = await getExecutionById(id);
      setExecution(data);

      // Find first item without result
      const firstPendingIndex = data.results?.findIndex(
        (r) => !r || r.status === null
      ) ?? 0;
      setCurrentItemIndex(Math.max(0, firstPendingIndex));
    } catch (error) {
      console.error('Error loading execution:', error);
      toast.error('Failed to load execution', 'Please try again');
      router.push('/executions');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordResult = async (itemId: string, status: ResultStatus) => {
    try {
      setRecording(true);
      await recordResult(id, itemId, status);
      await loadExecution(); // Reload to get updated stats

      // Move to next item
      if (currentItemIndex < (execution?.suite.items?.length ?? 0) - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      }

      toast.success(`Marked as ${status}`);
    } catch (error) {
      console.error('Error recording result:', error);
      toast.error('Failed to record result', 'Please try again');
    } finally {
      setRecording(false);
    }
  };

  const handleComplete = async () => {
    try {
      await completeExecution(id);
      toast.success('Execution completed successfully');
      router.push(`/suites/${execution?.suite_id}?tab=executions`);
    } catch (error) {
      console.error('Error completing execution:', error);
      toast.error('Failed to complete execution', 'Please try again');
    }
  };

  const goToItem = (index: number) => {
    setCurrentItemIndex(index);
  };

  if (loading || !execution) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const items = execution.suite.items || [];
  const currentItem = items[currentItemIndex];
  const currentResult = execution.results?.find(r => r.checklist_item_id === currentItem?.id);

  const totalItems = execution.total_items || 0;
  const passedItems = execution.passed_items || 0;
  const failedItems = execution.failed_items || 0;
  const blockedItems = execution.blocked_items || 0;
  const testedItems = passedItems + failedItems + blockedItems;
  const progress = totalItems > 0 ? Math.round((testedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[hsl(240,3%,6%)] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/suites/${execution.suite_id}?tab=executions`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Suite
          </Button>

          <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-medium text-zinc-200 mb-2">
                  {execution.name}
                </h1>
                <p className="text-sm text-zinc-400">
                  Suite: {execution.suite.name}
                </p>
              </div>
              <Badge variant={execution.status === 'completed' ? 'success' : 'default'}>
                {execution.status}
              </Badge>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progress</span>
                <span className="text-zinc-300">{testedItems} / {totalItems} ({progress}%)</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{passedItems} Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{failedItems} Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500">{blockedItems} Blocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Item */}
        {currentItem && (
          <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-500">
                  Item {currentItemIndex + 1} of {items.length}
                </span>
                <Badge variant={currentItem.priority as any}>{currentItem.priority}</Badge>
              </div>
              <h2 className="text-xl font-medium text-zinc-200 mb-3">
                {currentItem.title}
              </h2>
              {currentItem.description && (
                <p className="text-sm text-zinc-400 mb-4">{currentItem.description}</p>
              )}
              {currentItem.expected_result && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-1">Expected Result:</p>
                  <p className="text-sm text-zinc-300">{currentItem.expected_result}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="primary"
                onClick={() => handleRecordResult(currentItem.id, 'passed')}
                disabled={recording || execution.status === 'completed'}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Pass
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRecordResult(currentItem.id, 'failed')}
                disabled={recording || execution.status === 'completed'}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Fail
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRecordResult(currentItem.id, 'blocked')}
                disabled={recording || execution.status === 'completed'}
                className="bg-yellow-600/10 hover:bg-yellow-600/20 border-yellow-600/20 text-yellow-500"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Blocked
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRecordResult(currentItem.id, 'skipped')}
                disabled={recording || execution.status === 'completed'}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-800">
              <Button
                variant="ghost"
                onClick={() => goToItem(currentItemIndex - 1)}
                disabled={currentItemIndex === 0}
              >
                Previous
              </Button>
              <div className="flex-1 text-center text-sm text-zinc-500">
                Item {currentItemIndex + 1} / {items.length}
              </div>
              <Button
                variant="ghost"
                onClick={() => goToItem(currentItemIndex + 1)}
                disabled={currentItemIndex === items.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Complete Button */}
        {execution.status !== 'completed' && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleComplete}
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Execution
            </Button>
          </div>
        )}

        {/* Items List */}
        <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">All Items</h3>
          <div className="space-y-2">
            {items.map((item, index) => {
              const result = execution.results?.find(r => r.checklist_item_id === item.id);
              const isActive = index === currentItemIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => goToItem(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-zinc-800/50 border-zinc-600'
                      : 'bg-[#0f0f10] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-zinc-500 w-8">#{index + 1}</span>
                      <span className="text-sm text-zinc-300 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result?.status === 'passed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {result?.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      {result?.status === 'blocked' && (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      {result?.status === 'skipped' && (
                        <SkipForward className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
