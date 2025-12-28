'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Textarea from '@/components/shared/Textarea';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';

interface SuiteFormData {
  name: string;
  description: string;
  folder_id: string;
  status: 'draft' | 'active' | 'archived';
}

interface SuiteFormProps {
  initialData?: Partial<SuiteFormData>;
  onSubmit: (data: SuiteFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function SuiteForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Create Suite',
}: SuiteFormProps) {
  const [formData, setFormData] = useState<SuiteFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    folder_id: initialData?.folder_id || '',
    status: initialData?.status || 'draft',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SuiteFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SuiteFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Login Flow Tests"
        error={errors.name}
        required
      />

      {/* Description */}
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe what this test suite covers..."
        rows={4}
      />

      {/* Status */}
      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => setFormData({ ...formData, status: value as any })}
        options={statusOptions}
      />

      {/* TODO: Add Folder selector when folders are implemented */}
      {/* TODO: Add Tags input when tags are implemented */}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Creating...' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
