'use client';

import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Priority, ItemStatus } from '@/types';

interface BulkActionsBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  onDelete: () => void;
  onChangePriority: (priority: Priority) => void;
  onChangeStatus: (status: ItemStatus) => void;
}

export default function BulkActionsBar({
  selectedCount,
  onDeselectAll,
  onDelete,
  onChangePriority,
  onChangeStatus,
}: BulkActionsBarProps) {
  const [showPrioritySelect, setShowPrioritySelect] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  if (selectedCount === 0) return null;

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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-200">
      <div className="bg-[#0f0f10] border border-zinc-700 rounded-xl shadow-2xl shadow-black/60 px-6 py-4 flex items-center gap-4">
        {/* Selected Count */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">
            {selectedCount} selected
          </span>
          <button
            onClick={onDeselectAll}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-700" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Change Priority */}
          {showPrioritySelect ? (
            <div className="flex items-center gap-2">
              <Select
                value=""
                onChange={(value) => {
                  onChangePriority(value as Priority);
                  setShowPrioritySelect(false);
                }}
                options={priorityOptions}
                placeholder="Select priority..."
                className="min-w-[150px]"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrioritySelect(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPrioritySelect(true)}
            >
              Change Priority
            </Button>
          )}

          {/* Change Status */}
          {showStatusSelect ? (
            <div className="flex items-center gap-2">
              <Select
                value=""
                onChange={(value) => {
                  onChangeStatus(value as ItemStatus);
                  setShowStatusSelect(false);
                }}
                options={statusOptions}
                placeholder="Select status..."
                className="min-w-[150px]"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStatusSelect(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowStatusSelect(true)}
            >
              Change Status
            </Button>
          )}

          {/* Delete */}
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
