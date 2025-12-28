'use client';

import { useState, useEffect } from 'react';
import { ChecklistItem, Priority, ItemStatus } from '@/types';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Textarea from '@/components/shared/Textarea';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';

interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
  parentItems?: ChecklistItem[];
  editingItem?: ChecklistItem | null;
  defaultParentId?: string;
  loading?: boolean;
}

export interface ItemFormData {
  title: string;
  description: string;
  expected_result: string;
  priority: Priority;
  status: ItemStatus;
  parent_id: string | null;
  notes: string;
}

export default function AddItemForm({
  isOpen,
  onClose,
  onSubmit,
  parentItems = [],
  editingItem,
  defaultParentId,
  loading = false,
}: AddItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    expected_result: '',
    priority: 'medium',
    status: 'not_started',
    parent_id: defaultParentId || null,
    notes: '',
  });

  const [isQuickMode, setIsQuickMode] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          title: editingItem.title,
          description: editingItem.description || '',
          expected_result: editingItem.expected_result || '',
          priority: editingItem.priority as Priority,
          status: editingItem.status as ItemStatus,
          parent_id: editingItem.parent_id,
          notes: editingItem.notes || '',
        });
        setIsQuickMode(false);
      } else {
        setFormData({
          title: '',
          description: '',
          expected_result: '',
          priority: 'medium',
          status: 'not_started',
          parent_id: defaultParentId || null,
          notes: '',
        });
        setIsQuickMode(true);
      }
      setErrors({});
    }
  }, [isOpen, editingItem, defaultParentId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ItemFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: '',
      description: '',
      expected_result: '',
      priority: 'medium',
      status: 'not_started',
      parent_id: null,
      notes: '',
    });
    setErrors({});
    setIsQuickMode(true);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'passed', label: 'Passed' },
    { value: 'failed', label: 'Failed' },
    { value: 'blocked', label: 'Blocked' },
  ];

  const parentOptions = [
    { value: '', label: 'None (Root Level)' },
    ...parentItems.map((item) => ({
      value: item.id,
      label: item.title,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingItem ? 'Edit Item' : 'Add Checklist Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle */}
        {!editingItem && (
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setIsQuickMode(true)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isQuickMode
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Quick Add
            </button>
            <button
              type="button"
              onClick={() => setIsQuickMode(false)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !isQuickMode
                  ? 'bg-zinc-800 text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Full Form
            </button>
          </div>
        )}

        {/* Title (Always visible) */}
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Verify login with valid credentials"
          error={errors.title}
          required
        />

        {/* Full Form Fields */}
        {!isQuickMode && (
          <>
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Steps to reproduce or detailed description..."
              rows={3}
            />

            <Textarea
              label="Expected Result"
              value={formData.expected_result}
              onChange={(e) =>
                setFormData({ ...formData, expected_result: e.target.value })
              }
              placeholder="What should happen when this test passes..."
              rows={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(value) =>
                  setFormData({ ...formData, priority: value as Priority })
                }
                options={priorityOptions}
              />

              <Select
                label="Status"
                value={formData.status}
                onChange={(value) =>
                  setFormData({ ...formData, status: value as ItemStatus })
                }
                options={statusOptions}
              />
            </div>

            {parentItems.length > 0 && (
              <Select
                label="Parent Item"
                value={formData.parent_id || ''}
                onChange={(value) =>
                  setFormData({ ...formData, parent_id: value || null })
                }
                options={parentOptions}
              />
            )}

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes or comments..."
              rows={2}
            />
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading
              ? editingItem
                ? 'Saving...'
                : 'Adding...'
              : editingItem
              ? 'Save Changes'
              : 'Add Item'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
