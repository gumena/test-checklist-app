'use client';

import { TestSuiteWithDetails } from '@/types';
import SuiteForm from '@/components/Suite/SuiteForm';
import Button from '@/components/shared/Button';
import { Download, Archive, Trash2, FileText } from 'lucide-react';

interface SettingsTabProps {
  suite: TestSuiteWithDetails;
  onUpdate: (data: any) => void;
  onExport: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onSaveAsTemplate: () => void;
  loading?: boolean;
}

export default function SettingsTab({
  suite,
  onUpdate,
  onExport,
  onArchive,
  onDelete,
  onSaveAsTemplate,
  loading = false,
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <h3 className="text-base font-medium text-zinc-200 mb-6">
          General Settings
        </h3>
        <SuiteForm
          initialData={{
            name: suite.name,
            description: suite.description || '',
            folder_id: suite.folder_id || '',
            status: suite.status as 'draft' | 'active' | 'archived',
          }}
          onSubmit={onUpdate}
          loading={loading}
          submitLabel="Save Changes"
        />
      </div>

      {/* Export */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <h3 className="text-base font-medium text-zinc-200 mb-2">
          Export Suite
        </h3>
        <p className="text-sm text-zinc-400 font-light mb-4">
          Download this test suite as a JSON file
        </p>
        <Button variant="secondary" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export as JSON
        </Button>
      </div>

      {/* Save as Template */}
      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <h3 className="text-base font-medium text-zinc-200 mb-2">
          Save as Template
        </h3>
        <p className="text-sm text-zinc-400 font-light mb-4">
          Convert this suite into a reusable template for creating similar test suites
        </p>
        <Button variant="secondary" onClick={onSaveAsTemplate}>
          <FileText className="w-4 h-4 mr-2" />
          Save as Template
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0f0f10] border border-red-900/20 rounded-xl p-6">
        <h3 className="text-base font-medium text-red-400 mb-4">
          Danger Zone
        </h3>

        <div className="space-y-4">
          {/* Archive */}
          <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
            <div>
              <h4 className="text-sm font-medium text-zinc-200 mb-1">
                Archive Suite
              </h4>
              <p className="text-xs text-zinc-500">
                Archive this suite to hide it from the main list
              </p>
            </div>
            <Button variant="secondary" onClick={onArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>

          {/* Delete */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-1">
                Delete Suite
              </h4>
              <p className="text-xs text-zinc-500">
                Permanently delete this suite and all its items. This action cannot be undone.
              </p>
            </div>
            <Button variant="danger" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
