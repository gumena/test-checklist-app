'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getSuiteById, updateSuite, deleteSuite, cloneSuite } from '@/api/suites';
import { createTemplateFromSuite } from '@/api/templates';
import { startExecution } from '@/api/executions';
import {
  getItemsBySuiteId,
  createItem,
  updateItem,
  deleteItem,
  bulkDeleteItems,
  bulkUpdateItems,
} from '@/api/items';
import { getExecutionsBySuiteId } from '@/api/executions';
import {
  TestSuiteWithDetails,
  ChecklistItemWithChildren,
  TestExecution,
  Priority,
  ItemStatus,
} from '@/types';
import AddItemForm, { ItemFormData } from '@/components/Checklist/AddItemForm';
import SuiteHeader from '@/components/Suite/SuiteHeader';
import SuiteStats from '@/components/Suite/SuiteStats';
import SuiteTabs from '@/components/Suite/SuiteTabs';
import ChecklistItemsTab from '@/components/Suite/tabs/ChecklistItemsTab';
import ExecutionsTab from '@/components/Suite/tabs/ExecutionsTab';
import SettingsTab from '@/components/Suite/tabs/SettingsTab';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Button from '@/components/shared/Button';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useToast } from '@/components/shared/ToastContainer';
import { ArrowLeft } from 'lucide-react';

interface SuiteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SuiteDetailPage({ params }: SuiteDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'items' | 'executions' | 'settings' | null;
  const toast = useToast();

  const [suite, setSuite] = useState<TestSuiteWithDetails | null>(null);
  const [items, setItems] = useState<ChecklistItemWithChildren[]>([]);
  const [executions, setExecutions] = useState<TestExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'executions' | 'settings'>(
    tabParam || 'items'
  );
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItemWithChildren | null>(null);
  const [parentItemId, setParentItemId] = useState<string | null>(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteItemConfirm, setShowDeleteItemConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuiteData();
  }, [id]);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const loadSuiteData = async () => {
    try {
      setLoading(true);
      const [suiteData, itemsData, executionsData] = await Promise.all([
        getSuiteById(id),
        getItemsBySuiteId(id),
        getExecutionsBySuiteId(id),
      ]);

      setSuite(suiteData);
      setItems(itemsData);
      setExecutions(executionsData);
    } catch (error) {
      console.error('Error loading suite:', error);
      // TODO: Show error toast and redirect
      router.push('/suites');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: Partial<TestSuiteWithDetails>) => {
    if (!suite) return;

    try {
      setUpdating(true);
      await updateSuite(suite.id, updates);
      setSuite({ ...suite, ...updates });
      toast.success('Suite updated successfully');
    } catch (error) {
      console.error('Error updating suite:', error);
      toast.error('Failed to update suite', 'Please try again');
    } finally {
      setUpdating(false);
    }
  };

  const handleRun = async () => {
    if (!suite) return;

    try {
      const execution = await startExecution(suite.id);
      toast.success('Test execution started', 'Redirecting to execution...');
      setTimeout(() => {
        router.push(`/executions/${execution.id}`);
      }, 1000);
    } catch (error) {
      console.error('Error starting execution:', error);
      toast.error('Failed to start execution', 'Please try again');
    }
  };

  const handleArchive = async () => {
    setShowArchiveConfirm(true);
  };

  const confirmArchive = async () => {
    await handleUpdate({ status: 'archived' });
    setShowArchiveConfirm(false);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!suite) return;

    try {
      setDeleting(true);
      await deleteSuite(suite.id);
      toast.success('Suite deleted successfully');
      router.push('/suites');
    } catch (error) {
      console.error('Error deleting suite:', error);
      toast.error('Failed to delete suite', 'Please try again');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = async () => {
    if (!suite) return;

    const cloneName = window.prompt(
      'Enter a name for the cloned suite:',
      `${suite.name} (Copy)`
    );

    if (!cloneName) return;

    try {
      const newSuiteId = await cloneSuite(suite.id, cloneName);
      toast.success('Suite cloned successfully', 'Redirecting to cloned suite...');
      setTimeout(() => {
        router.push(`/suites/${newSuiteId}`);
      }, 1000);
    } catch (error) {
      console.error('Error cloning suite:', error);
      toast.error('Failed to clone suite', 'Please try again');
    }
  };

  const handleExport = () => {
    if (!suite) return;

    const exportData = {
      suite,
      items,
      executions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${suite.name.replace(/\s+/g, '-').toLowerCase()}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveAsTemplate = async () => {
    if (!suite) return;

    const templateName = window.prompt(
      'Enter a name for this template:',
      `${suite.name} Template`
    );

    if (!templateName) return;

    try {
      await createTemplateFromSuite(suite.id, templateName);
      toast.success('Template created successfully', 'You can now use this template when creating new suites');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template', 'Please try again');
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setParentItemId(null);
    setShowAddItemModal(true);
  };

  const handleAddChildItem = (parentId: string) => {
    setEditingItem(null);
    setParentItemId(parentId);
    setShowAddItemModal(true);
  };

  const handleEditItem = (item: ChecklistItemWithChildren) => {
    setEditingItem(item);
    setParentItemId(null);
    setShowAddItemModal(true);
  };

  const handleSubmitItem = async (data: ItemFormData) => {
    try {
      setItemLoading(true);

      if (editingItem) {
        // Update existing item
        await updateItem(editingItem.id, {
          title: data.title,
          description: data.description || null,
          expected_result: data.expected_result || null,
          priority: data.priority,
          status: data.status,
          parent_id: data.parent_id,
          notes: data.notes || null,
        });
      } else {
        // Create new item
        const nextPosition = items.length;
        await createItem({
          suite_id: id,
          title: data.title,
          description: data.description || null,
          expected_result: data.expected_result || null,
          priority: data.priority,
          status: data.status,
          parent_id: data.parent_id,
          notes: data.notes || null,
          position: nextPosition,
        });
      }

      // Reload items
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
      setShowAddItemModal(false);
      setEditingItem(null);
      setParentItemId(null);
      toast.success(editingItem ? 'Item updated successfully' : 'Item created successfully');
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item', 'Please try again');
    } finally {
      setItemLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteItemConfirm(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete);
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item', 'Please try again');
    } finally {
      setShowDeleteItemConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleDuplicateItem = async (itemId: string) => {
    try {
      const itemToDuplicate = items.find((item) => item.id === itemId);
      if (!itemToDuplicate) return;

      await createItem({
        suite_id: id,
        title: `${itemToDuplicate.title} (Copy)`,
        description: itemToDuplicate.description,
        expected_result: itemToDuplicate.expected_result,
        priority: itemToDuplicate.priority,
        status: 'not_started',
        parent_id: itemToDuplicate.parent_id,
        notes: itemToDuplicate.notes,
        position: items.length,
      });

      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error duplicating item:', error);
      // TODO: Show error toast
    }
  };

  const handleItemsReorder = async (reorderedItems: ChecklistItemWithChildren[]) => {
    try {
      // Update positions
      const updates = reorderedItems.map((item, index) =>
        updateItem(item.id, { position: index })
      );
      await Promise.all(updates);

      // Reload items
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error reordering items:', error);
      // TODO: Show error toast
    }
  };

  const handleBulkDelete = async (itemIds: string[]) => {
    try {
      await bulkDeleteItems(itemIds);
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
      toast.success(`Deleted ${itemIds.length} item(s) successfully`);
    } catch (error) {
      console.error('Error bulk deleting items:', error);
      toast.error('Failed to delete items', 'Please try again');
    }
  };

  const handleBulkChangePriority = async (itemIds: string[], priority: Priority) => {
    try {
      await bulkUpdateItems(itemIds, { priority });
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
      toast.success(`Updated ${itemIds.length} item(s) priority to ${priority}`);
    } catch (error) {
      console.error('Error changing priority:', error);
      toast.error('Failed to update priority', 'Please try again');
    }
  };

  const handleBulkChangeStatus = async (itemIds: string[], status: ItemStatus) => {
    try {
      await bulkUpdateItems(itemIds, { status });
      const updatedItems = await getItemsBySuiteId(id);
      setItems(updatedItems);
      toast.success(`Updated ${itemIds.length} item(s) status to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to update status', 'Please try again');
    }
  };

  const handleExecutionClick = (execution: TestExecution) => {
    router.push(`/executions/${execution.id}`);
  };

  const handleTabChange = (tab: 'items' | 'executions' | 'settings') => {
    setActiveTab(tab);
    router.push(`/suites/${id}?tab=${tab}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(240,3%,6%)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!suite) {
    return (
      <div className="min-h-screen bg-[hsl(240,3%,6%)] flex items-center justify-center">
        <p className="text-zinc-400">Suite not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(240,3%,6%)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/suites')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Suites
        </Button>

        {/* Header */}
        <SuiteHeader
          suite={suite}
          onUpdate={handleUpdate}
          onRun={handleRun}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />

        {/* Stats */}
        <SuiteStats suite={suite} />

        {/* Tabs */}
        <SuiteTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === 'items' && (
          <ChecklistItemsTab
            suiteId={suite.id}
            items={items}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onDuplicateItem={handleDuplicateItem}
            onAddChildItem={handleAddChildItem}
            onItemsReorder={handleItemsReorder}
            onBulkDelete={handleBulkDelete}
            onBulkChangePriority={handleBulkChangePriority}
            onBulkChangeStatus={handleBulkChangeStatus}
          />
        )}

        {/* Add/Edit Item Modal */}
        <AddItemForm
          isOpen={showAddItemModal}
          onClose={() => {
            setShowAddItemModal(false);
            setEditingItem(null);
            setParentItemId(null);
          }}
          onSubmit={handleSubmitItem}
          parentItems={items}
          editingItem={editingItem}
          defaultParentId={parentItemId || undefined}
          loading={itemLoading}
        />

        {activeTab === 'executions' && (
          <ExecutionsTab
            executions={executions}
            onExecutionClick={handleExecutionClick}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            suite={suite}
            onUpdate={handleUpdate}
            onExport={handleExport}
            onSaveAsTemplate={handleSaveAsTemplate}
            onArchive={handleArchive}
            onDelete={handleDelete}
            loading={updating}
          />
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Suite"
        message="Are you sure you want to delete this suite? This will permanently delete the suite and all its checklist items. This action cannot be undone."
        confirmText="Delete Suite"
        variant="danger"
        loading={deleting}
      />

      <ConfirmModal
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={confirmArchive}
        title="Archive Suite"
        message="Are you sure you want to archive this suite? Archived suites will be hidden from the main list but can be restored later."
        confirmText="Archive Suite"
        variant="warning"
        loading={updating}
      />

      <ConfirmModal
        isOpen={showDeleteItemConfirm}
        onClose={() => {
          setShowDeleteItemConfirm(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Delete Item"
        message="Are you sure you want to delete this checklist item? This action cannot be undone."
        confirmText="Delete Item"
        variant="danger"
      />
    </div>
  );
}
