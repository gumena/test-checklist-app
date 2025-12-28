import { supabase } from '@/lib/supabase';
import { Template, TemplateWithItems, TemplateItem } from '@/types';

export async function getAllTemplates(): Promise<TemplateWithItems[]> {
  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      items:template_items(*)
    `)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as TemplateWithItems[];
}

export async function getTemplateWithItems(id: string): Promise<TemplateWithItems> {
  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      items:template_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as TemplateWithItems;
}

export async function createSuiteFromTemplate(templateId: string, suiteName: string): Promise<string> {
  const template = await getTemplateWithItems(templateId);

  // Create suite
  const { data: suite, error: suiteError } = await supabase
    .from('test_suites')
    .insert({
      name: suiteName,
      description: template.description,
      status: 'draft',
    })
    .select()
    .single();

  if (suiteError) throw suiteError;

  // Create checklist items from template
  if (template.items && template.items.length > 0) {
    const items = template.items.map((item) => ({
      suite_id: suite.id,
      title: item.title,
      description: item.description,
      expected_result: item.expected_result,
      priority: item.priority,
      position: item.position,
    }));

    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(items);

    if (itemsError) throw itemsError;
  }

  return suite.id;
}

export async function createTemplateFromSuite(
  suiteId: string,
  templateName: string,
  category?: string
): Promise<Template> {
  // Get suite with items
  const { data: suite, error: suiteError } = await supabase
    .from('test_suites')
    .select(`
      *,
      items:checklist_items(*)
    `)
    .eq('id', suiteId)
    .single();

  if (suiteError) throw suiteError;

  // Create template
  const { data: template, error: templateError } = await supabase
    .from('templates')
    .insert({
      name: templateName,
      description: suite.description,
      category: category || 'Custom',
    })
    .select()
    .single();

  if (templateError) throw templateError;

  // Create template items from suite items
  if (suite.items && suite.items.length > 0) {
    const templateItems = suite.items.map((item: any) => ({
      template_id: template.id,
      title: item.title,
      description: item.description,
      expected_result: item.expected_result,
      priority: item.priority,
      position: item.position,
    }));

    const { error: itemsError } = await supabase
      .from('template_items')
      .insert(templateItems);

    if (itemsError) throw itemsError;
  }

  return template;
}

export async function deleteTemplate(id: string): Promise<void> {
  // Delete template items first
  await supabase
    .from('template_items')
    .delete()
    .eq('template_id', id);

  // Delete template
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
