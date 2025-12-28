import { supabase } from '@/lib/supabase';
import { TestExecutionWithDetails, TestSuiteWithDetails } from '@/types';

export interface DashboardData {
  stats: {
    totalSuites: number;
    activeSuites: number;
    totalExecutions: number;
    activeExecutions: number;
  };
  recentExecutions: TestExecutionWithDetails[];
  activeExecutions: TestExecutionWithDetails[];
  recentSuites: TestSuiteWithDetails[];
}

export async function getDashboardData(): Promise<DashboardData> {
  // Get total suites count
  const { count: totalSuites } = await supabase
    .from('test_suites')
    .select('*', { count: 'exact', head: true });

  // Get active suites count
  const { count: activeSuites } = await supabase
    .from('test_suites')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get total executions count
  const { count: totalExecutions } = await supabase
    .from('test_executions')
    .select('*', { count: 'exact', head: true });

  // Get active executions count
  const { count: activeExecutions } = await supabase
    .from('test_executions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');

  // Get recent executions
  const { data: recentExecutions } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*)
    `)
    .order('started_at', { ascending: false })
    .limit(5);

  // Get active (in-progress) executions
  const { data: activeExecutionsData } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*)
    `)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(5);

  // Get recent suites
  const { data: recentSuites } = await supabase
    .from('test_suites')
    .select(`
      *,
      items:checklist_items(count),
      executions:test_executions(count)
    `)
    .order('updated_at', { ascending: false })
    .limit(6);

  return {
    stats: {
      totalSuites: totalSuites || 0,
      activeSuites: activeSuites || 0,
      totalExecutions: totalExecutions || 0,
      activeExecutions: activeExecutions || 0,
    },
    recentExecutions: (recentExecutions as any) || [],
    activeExecutions: (activeExecutionsData as any) || [],
    recentSuites: (recentSuites as any) || [],
  };
}
