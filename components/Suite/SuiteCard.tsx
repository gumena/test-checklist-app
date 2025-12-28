'use client';

import { useState } from 'react';
import { TestSuiteWithDetails } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { Play, Edit, Copy, Trash2, MoreVertical, Folder, CheckSquare, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SuiteCardProps {
  suite: TestSuiteWithDetails;
  onEdit?: (suite: TestSuiteWithDetails) => void;
  onDelete?: (suite: TestSuiteWithDetails) => void;
  onDuplicate?: (suite: TestSuiteWithDetails) => void;
  onRun?: (suite: TestSuiteWithDetails) => void;
  onClick?: (suite: TestSuiteWithDetails) => void;
}

export default function SuiteCard({
  suite,
  onEdit,
  onDelete,
  onDuplicate,
  onRun,
  onClick,
}: SuiteCardProps) {
  const [showActions, setShowActions] = useState(false);

  const itemCount = suite.items?.length || 0;
  const lastExecution = suite.executions?.[0];

  return (
    <div
      className="group relative bg-[#0f0f10] border border-zinc-800 rounded-xl p-6
        hover:border-zinc-700 hover:bg-[#1a1a1c] transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(suite)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-zinc-200 tracking-tight truncate mb-1">
            {suite.name}
          </h3>
          <Badge variant={suite.status as any}>
            {suite.status}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="ml-4">
          <button
            className={`text-zinc-500 hover:text-zinc-300 transition-opacity ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {suite.description && (
        <p className="text-sm text-zinc-400 font-light line-clamp-2 mb-4">
          {suite.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{itemCount} items</span>
        </div>

        {suite.folder && (
          <div className="flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5" />
            <span>{suite.folder.name}</span>
          </div>
        )}

        {lastExecution && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {formatDistanceToNow(new Date(lastExecution.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}
      </div>

      {/* Last Execution Stats */}
      {lastExecution && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${
                  ((lastExecution.passed_items || 0) /
                    (lastExecution.total_items || 1)) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="text-xs text-zinc-500">
            {lastExecution.passed_items || 0}/{lastExecution.total_items || 0}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div
        className={`flex items-center gap-2 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRun?.(suite);
          }}
          className="flex-1"
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Run Test
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(suite);
          }}
        >
          <Edit className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate?.(suite);
          }}
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(suite);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
