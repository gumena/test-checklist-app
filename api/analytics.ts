import { supabase } from '@/lib/supabase';
import { AnalyticsData, TestExecutionWithDetails } from '@/types';

export async function getAnalytics(): Promise<AnalyticsData> {
  // Get total suites count
  const { count: totalSuites } = await supabase
    .from('test_suites')
    .select('*', { count: 'exact', head: true });

  // Get total items count
  const { count: totalItems } = await supabase
    .from('checklist_items')
    .select('*', { count: 'exact', head: true });

  // Get total executions count
  const { count: totalExecutions } = await supabase
    .from('test_executions')
    .select('*', { count: 'exact', head: true });

  // Get recent executions
  const { data: recentExecutions } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*)
    `)
    .order('started_at', { ascending: false })
    .limit(10);

  // Get pass/fail trend for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: executions } = await supabase
    .from('test_executions')
    .select('*')
    .gte('started_at', thirtyDaysAgo.toISOString())
    .order('started_at', { ascending: true });

  // Calculate daily pass/fail trend
  const passFailTrend = calculateDailyTrend(executions || []);

  // Get most failed items
  const { data: failedResults } = await supabase
    .from('execution_results')
    .select(`
      checklist_item_id,
      item:checklist_items(*)
    `)
    .eq('status', 'failed');

  const mostFailedItems = calculateMostFailedItems(failedResults || []);

  return {
    totalSuites: totalSuites || 0,
    totalItems: totalItems || 0,
    totalExecutions: totalExecutions || 0,
    recentExecutions: (recentExecutions as any) || [],
    passFailTrend,
    mostFailedItems,
  };
}

function calculateDailyTrend(executions: any[]): { date: string; passed: number; failed: number }[] {
  const trendMap = new Map<string, { passed: number; failed: number }>();

  executions.forEach((execution) => {
    const date = new Date(execution.started_at).toLocaleDateString();
    const current = trendMap.get(date) || { passed: 0, failed: 0 };

    current.passed += execution.passed_items || 0;
    current.failed += execution.failed_items || 0;

    trendMap.set(date, current);
  });

  return Array.from(trendMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function calculateMostFailedItems(results: any[]): { item: any; failCount: number }[] {
  const failCountMap = new Map<string, { item: any; count: number }>();

  results.forEach((result) => {
    const itemId = result.checklist_item_id;
    const current = failCountMap.get(itemId);

    if (current) {
      current.count++;
    } else {
      failCountMap.set(itemId, { item: result.item, count: 1 });
    }
  });

  return Array.from(failCountMap.values())
    .map(({ item, count }) => ({ item, failCount: count }))
    .sort((a, b) => b.failCount - a.failCount)
    .slice(0, 10);
}
