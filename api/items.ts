import { supabase } from '@/lib/supabase';
import { ChecklistItemWithChildren, ItemStatus } from '@/types';
import { TablesInsert, TablesUpdate } from '@/types/database.types';

export async function getItemsBySuiteId(suiteId: string): Promise<ChecklistItemWithChildren[]> {
  const { data, error } = await supabase
    .from('checklist_items')
    .select(`
      *,
      tags:item_tags(tag:tags(*))
    `)
    .eq('suite_id', suiteId)
    .order('position', { ascending: true });

  if (error) throw error;

  // Transform tags from { tag: Tag }[] to Tag[]
  const transformedData = data?.map(item => ({
    ...item,
    tags: item.tags?.map((t: any) => t.tag) || []
  })) || [];

  // Build tree structure
  return buildItemTree(transformedData as ChecklistItemWithChildren[]);
}

function buildItemTree(items: ChecklistItemWithChildren[]): ChecklistItemWithChildren[] {
  const itemMap = new Map<string, ChecklistItemWithChildren>();
  const rootItems: ChecklistItemWithChildren[] = [];

  // First pass: create map
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build tree
  items.forEach(item => {
    const node = itemMap.get(item.id)!;
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    } else {
      rootItems.push(node);
    }
  });

  return rootItems;
}

export async function createItem(item: TablesInsert<'checklist_items'>): Promise<ChecklistItemWithChildren> {
  const { data, error } = await supabase
    .from('checklist_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as ChecklistItemWithChildren;
}

export async function updateItem(
  id: string,
  updates: TablesUpdate<'checklist_items'>
): Promise<ChecklistItemWithChildren> {
  const { data, error } = await supabase
    .from('checklist_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ChecklistItemWithChildren;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateItemPosition(id: string, position: number): Promise<void> {
  await updateItem(id, { position });
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<void> {
  await updateItem(id, { status });
}

export async function bulkDeleteItems(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function bulkUpdateItems(
  ids: string[],
  updates: TablesUpdate<'checklist_items'>
): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .update(updates)
    .in('id', ids);

  if (error) throw error;
}
