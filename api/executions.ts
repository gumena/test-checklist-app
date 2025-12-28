import { supabase } from '@/lib/supabase';
import { TestExecutionWithDetails, ExecutionResultWithDetails, ResultStatus } from '@/types';
import { TablesInsert } from '@/types/database.types';

export async function startExecution(suiteId: string, name?: string): Promise<TestExecutionWithDetails> {
  // Get total items count
  const { count } = await supabase
    .from('checklist_items')
    .select('*', { count: 'exact', head: true })
    .eq('suite_id', suiteId);

  const { data, error } = await supabase
    .from('test_executions')
    .insert({
      suite_id: suiteId,
      name: name || `Execution ${new Date().toLocaleDateString()}`,
      total_items: count || 0,
      status: 'in_progress',
    })
    .select(`
      *,
      suite:test_suites(*)
    `)
    .single();

  if (error) throw error;
  return data as TestExecutionWithDetails;
}

export async function getExecutionById(id: string): Promise<TestExecutionWithDetails> {
  const { data, error } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*),
      results:execution_results(
        *,
        item:checklist_items(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as TestExecutionWithDetails;
}

export async function recordResult(
  executionId: string,
  itemId: string,
  status: ResultStatus,
  comment?: string,
  durationSeconds?: number
): Promise<void> {
  const { error } = await supabase
    .from('execution_results')
    .insert({
      execution_id: executionId,
      checklist_item_id: itemId,
      status,
      comment,
      duration_seconds: durationSeconds,
    });

  if (error) throw error;

  // Update execution stats
  await updateExecutionStats(executionId);
}

async function updateExecutionStats(executionId: string): Promise<void> {
  const { data: results } = await supabase
    .from('execution_results')
    .select('status')
    .eq('execution_id', executionId);

  if (!results) return;

  const stats = results.reduce(
    (acc, result) => {
      if (result.status === 'passed') acc.passed_items++;
      else if (result.status === 'failed') acc.failed_items++;
      else if (result.status === 'blocked') acc.blocked_items++;
      return acc;
    },
    { passed_items: 0, failed_items: 0, blocked_items: 0 }
  );

  await supabase
    .from('test_executions')
    .update(stats)
    .eq('id', executionId);
}

export async function completeExecution(executionId: string): Promise<void> {
  const { error } = await supabase
    .from('test_executions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', executionId);

  if (error) throw error;
}

export async function getExecutionsBySuiteId(suiteId: string): Promise<TestExecutionWithDetails[]> {
  const { data, error } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*)
    `)
    .eq('suite_id', suiteId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data as TestExecutionWithDetails[];
}

export async function getAllExecutions(): Promise<TestExecutionWithDetails[]> {
  const { data, error } = await supabase
    .from('test_executions')
    .select(`
      *,
      suite:test_suites(*)
    `)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data as TestExecutionWithDetails[];
}
