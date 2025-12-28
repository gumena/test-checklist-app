import { supabase } from '@/lib/supabase';
import { TestSuiteWithDetails, SuiteStatus } from '@/types';
import { TablesInsert, TablesUpdate } from '@/types/database.types';

export async function getAllSuites(): Promise<TestSuiteWithDetails[]> {
  const { data, error } = await supabase
    .from('test_suites')
    .select(`
      *,
      folder:folders(*),
      items:checklist_items(*),
      executions:test_executions(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as any as TestSuiteWithDetails[];
}

export async function getSuiteById(id: string): Promise<TestSuiteWithDetails> {
  const { data, error } = await supabase
    .from('test_suites')
    .select(`
      *,
      folder:folders(*),
      items:checklist_items(*),
      executions:test_executions(*),
      tags:suite_tags(tag:tags(*))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Transform tags from { tag: Tag }[] to Tag[]
  const transformedData = {
    ...data,
    tags: data.tags?.map((t: any) => t.tag) || []
  };

  return transformedData as any as TestSuiteWithDetails;
}

export async function createSuite(suite: TablesInsert<'test_suites'>): Promise<TestSuiteWithDetails> {
  const { data, error } = await supabase
    .from('test_suites')
    .insert(suite)
    .select()
    .single();

  if (error) throw error;
  return data as TestSuiteWithDetails;
}

export async function updateSuite(
  id: string,
  updates: TablesUpdate<'test_suites'>
): Promise<TestSuiteWithDetails> {
  const { data, error } = await supabase
    .from('test_suites')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as TestSuiteWithDetails;
}

export async function deleteSuite(id: string): Promise<void> {
  const { error } = await supabase
    .from('test_suites')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateSuiteStatus(id: string, status: SuiteStatus): Promise<void> {
  await updateSuite(id, { status });
}

export async function cloneSuite(suiteId: string, newName: string): Promise<string> {
  // Get original suite with items
  const { data: originalSuite, error: suiteError } = await supabase
    .from('test_suites')
    .select(`
      *,
      items:checklist_items(*)
    `)
    .eq('id', suiteId)
    .single();

  if (suiteError) throw suiteError;

  // Create new suite
  const { data: newSuite, error: createError } = await supabase
    .from('test_suites')
    .insert({
      name: newName,
      description: originalSuite.description,
      folder_id: originalSuite.folder_id,
      status: 'draft', // Always start clones as draft
    })
    .select()
    .single();

  if (createError) throw createError;

  // Clone all items
  if (originalSuite.items && originalSuite.items.length > 0) {
    const clonedItems = originalSuite.items.map((item: any) => ({
      suite_id: newSuite.id,
      title: item.title,
      description: item.description,
      expected_result: item.expected_result,
      priority: item.priority,
      position: item.position,
      parent_id: item.parent_id, // Note: parent_id references might need mapping if we support nested items
      notes: item.notes,
    }));

    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(clonedItems);

    if (itemsError) throw itemsError;
  }

  return newSuite.id;
}
