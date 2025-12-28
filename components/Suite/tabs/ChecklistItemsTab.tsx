'use client';

import { useState } from 'react';
import { ChecklistItemWithChildren, Priority, ItemStatus } from '@/types';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/shared/Button';
import ChecklistTree from '@/components/Checklist/ChecklistTree';
import BulkActionsBar from '@/components/Checklist/BulkActionsBar';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { Plus, CheckSquare } from 'lucide-react';

interface ChecklistItemsTabProps {
  suiteId: string;
  items: ChecklistItemWithChildren[];
  onAddItem: () => void;
  onEditItem: (item: ChecklistItemWithChildren) => void;
  onDeleteItem: (itemId: string) => void;
  onDuplicateItem: (itemId: string) => void;
  onAddChildItem: (parentId: string) => void;
  onItemsReorder: (items: ChecklistItemWithChildren[]) => void;
  onBulkDelete: (itemIds: string[]) => void;
  onBulkChangePriority: (itemIds: string[], priority: Priority) => void;
  onBulkChangeStatus: (itemIds: string[], status: ItemStatus) => void;
}

export default function ChecklistItemsTab({
  suiteId,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDuplicateItem,
  onAddChildItem,
  onItemsReorder,
  onBulkDelete,
  onBulkChangePriority,
  onBulkChangeStatus,
}: ChecklistItemsTabProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const handleSelectItem = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = items.map((item) => item.id);
    setSelectedItems(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    onBulkDelete(Array.from(selectedItems));
    setSelectedItems(new Set());
    setShowBulkDeleteConfirm(false);
  };

  const handleBulkChangePriority = (priority: Priority) => {
    if (selectedItems.size === 0) return;
    onBulkChangePriority(Array.from(selectedItems), priority);
    setSelectedItems(new Set());
  };

  const handleBulkChangeStatus = (status: ItemStatus) => {
    if (selectedItems.size === 0) return;
    onBulkChangeStatus(Array.from(selectedItems), status);
    setSelectedItems(new Set());
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-8">
        <EmptyState
          icon={CheckSquare}
          title="No checklist items yet"
          description="Add your first test item to get started"
          actionLabel="Add Item"
          onAction={onAddItem}
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-medium text-zinc-200">
              Checklist Items ({items.length})
            </h3>
            {selectedItems.size > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Select All
              </button>
            )}
          </div>
          <Button variant="primary" size="sm" onClick={onAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <ChecklistTree
          items={items}
          onItemsReorder={onItemsReorder}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onDuplicate={onDuplicateItem}
          onAddChild={onAddChildItem}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedItems.size}
        onDeselectAll={handleDeselectAll}
        onDelete={handleBulkDelete}
        onChangePriority={handleBulkChangePriority}
        onChangeStatus={handleBulkChangeStatus}
      />

      <ConfirmModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Items"
        message={`Are you sure you want to delete ${selectedItems.size} item(s)? This action cannot be undone.`}
        confirmText={`Delete ${selectedItems.size} Item(s)`}
        variant="danger"
      />
    </>
  );
}
