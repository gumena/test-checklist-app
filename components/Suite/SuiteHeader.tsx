'use client';

import { useState } from 'react';
import { TestSuiteWithDetails } from '@/types';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { Play, Edit2, Archive, Trash2, Copy, Check, X } from 'lucide-react';

interface SuiteHeaderProps {
  suite: TestSuiteWithDetails;
  onUpdate: (updates: Partial<TestSuiteWithDetails>) => void;
  onRun: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function SuiteHeader({
  suite,
  onUpdate,
  onRun,
  onArchive,
  onDelete,
  onDuplicate,
}: SuiteHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState(suite.name);
  const [description, setDescription] = useState(suite.description || '');

  const handleSaveName = () => {
    if (name.trim() && name !== suite.name) {
      onUpdate({ name: name.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    if (description !== suite.description) {
      onUpdate({ description: description.trim() || null });
    }
    setIsEditingDescription(false);
  };

  const handleCancelName = () => {
    setName(suite.name);
    setIsEditingName(false);
  };

  const handleCancelDescription = () => {
    setDescription(suite.description || '');
    setIsEditingDescription(false);
  };

  return (
    <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-4">
          {/* Name */}
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelName();
                }}
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 text-xl font-medium
                  focus:outline-none focus:border-zinc-600"
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={handleSaveName}>
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCancelName}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-3 group">
              <h1 className="text-2xl font-medium text-zinc-200 tracking-tight">
                {suite.name}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Description */}
          {isEditingDescription ? (
            <div className="flex items-start gap-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') handleCancelDescription();
                }}
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm
                  focus:outline-none focus:border-zinc-600 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="sm" onClick={handleSaveDescription}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancelDescription}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="group">
              {suite.description ? (
                <div className="flex items-start gap-2">
                  <p className="text-sm text-zinc-400 font-light flex-1">
                    {suite.description}
                  </p>
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  Add description...
                </button>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="mt-3">
            <Badge variant={suite.status as any}>{suite.status}</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={onRun}>
            <Play className="w-4 h-4 mr-2" />
            Run Test
          </Button>
          <Button variant="secondary" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={onArchive}>
            <Archive className="w-4 h-4" />
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
