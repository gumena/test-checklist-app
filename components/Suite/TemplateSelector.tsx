'use client';

import { useState, useEffect } from 'react';
import { TemplateWithItems } from '@/types';
import { getAllTemplates } from '@/api/templates';
import Modal from '@/components/shared/Modal';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SearchInput from '@/components/shared/SearchInput';
import { FileText, CheckCircle2, ListChecks } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: TemplateWithItems) => void;
}

export default function TemplateSelector({
  isOpen,
  onClose,
  onSelect,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateWithItems | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query) ||
      template.category?.toLowerCase().includes(query)
    );
  });

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
      setSearchQuery('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Template" size="lg">
      <div className="space-y-4">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search templates..."
        />

        {/* Templates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => {
              const itemCount = template.items?.length || 0;

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedTemplate?.id === template.id
                      ? 'bg-zinc-800/50 border-zinc-600'
                      : 'bg-[#0f0f10] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-medium text-zinc-200">
                          {template.name}
                        </h3>
                        {template.category && (
                          <Badge variant="default">
                            {template.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <ListChecks className="w-3 h-3" />
                        <span>{itemCount} checklist items</span>
                      </div>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  {template.description && (
                    <p className="text-xs text-zinc-400 font-light line-clamp-2 mt-2">
                      {template.description}
                    </p>
                  )}
                </button>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500">No templates found</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
          <Button
            variant="primary"
            onClick={handleSelect}
            disabled={!selectedTemplate}
            className="flex-1"
          >
            Use Template
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
