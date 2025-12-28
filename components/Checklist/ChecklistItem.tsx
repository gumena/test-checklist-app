'use client';

import { useState } from 'react';
import { ChecklistItem as ChecklistItemType } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import {
  Edit2,
  Trash2,
  Copy,
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreVertical,
} from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType & { tags?: { id: string; name: string; color: string | null; created_at: string }[] };
  depth?: number;
  isSelected?: boolean;
  onSelect?: (itemId: string, selected: boolean) => void;
  onEdit?: (item: ChecklistItemType) => void;
  onDelete?: (itemId: string) => void;
  onDuplicate?: (itemId: string) => void;
  onAddChild?: (parentId: string) => void;
  dragHandleProps?: any;
}

export default function ChecklistItem({
  item,
  depth = 0,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onAddChild,
  dragHandleProps,
}: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const priorityVariant = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
  }[item.priority] as any;

  const statusVariant = {
    not_started: 'default',
    in_progress: 'medium',
    passed: 'passed',
    failed: 'failed',
    blocked: 'blocked',
  }[item.status] as any;

  return (
    <div
      className={`group relative ${depth > 0 ? 'ml-8' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex items-start gap-3 p-4 bg-zinc-900/30 border rounded-lg transition-all duration-200 ${
          isSelected
            ? 'border-blue-500/50 bg-blue-500/5'
            : 'border-zinc-800 hover:border-zinc-700'
        }`}
      >
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(item.id, e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Badges */}
          <div className="flex items-start gap-2 mb-2">
            <h4 className="text-sm font-medium text-zinc-200 flex-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant={priorityVariant}>{item.priority}</Badge>
              <Badge variant={statusVariant}>
                {item.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-zinc-400 font-light mb-2">
              {item.description}
            </p>
          )}

          {/* Expected Result */}
          {item.expected_result && (
            <div className="text-xs text-zinc-500 mb-2">
              <span className="font-medium">Expected: </span>
              {item.expected_result}
            </div>
          )}

          {/* Notes (Collapsible) */}
          {item.notes && (
            <div className="mt-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                Notes
              </button>
              {isExpanded && (
                <p className="text-xs text-zinc-400 font-light mt-2">
                  {item.notes}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {item.tags.map((tag) => (
                <Badge key={tag.id} variant="default">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(item)}
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild?.(item.id)}
            title="Add Child"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate?.(item.id)}
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(item.id)}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
