'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSuite } from '@/api/suites';
import { createSuiteFromTemplate } from '@/api/templates';
import { Template } from '@/types';
import SuiteForm from '@/components/Suite/SuiteForm';
import TemplateSelector from '@/components/Suite/TemplateSelector';
import Button from '@/components/shared/Button';
import Tabs from '@/components/shared/Tabs';
import { ArrowLeft, FileText, PenTool } from 'lucide-react';

type CreationMode = 'scratch' | 'template';

export default function NewSuitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<CreationMode>('scratch');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const handleCreateEmpty = async (data: any) => {
    try {
      setLoading(true);
      const suite = await createSuite({
        name: data.name,
        description: data.description || null,
        folder_id: data.folder_id || null,
        status: data.status,
      });

      router.push(`/suites/${suite.id}`);
    } catch (error) {
      console.error('Error creating suite:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async (template: Template) => {
    try {
      setLoading(true);
      // For now, we'll just use the template name as suite name
      // In a real app, you'd want to show a form to customize the suite name
      const suiteId = await createSuiteFromTemplate(
        template.id,
        `${template.name} - Copy`
      );

      router.push(`/suites/${suiteId}`);
    } catch (error) {
      console.error('Error creating suite from template:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'scratch',
      label: 'Start from Scratch',
      icon: <PenTool className="w-4 h-4" />,
    },
    {
      id: 'template',
      label: 'Use a Template',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[hsl(240,3%,6%)] px-8 pt-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">
            Create Test Suite
          </h1>
          <p className="text-sm text-zinc-400 font-light">
            Create a new test suite from scratch or use a template
          </p>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={mode} onTabChange={(id) => setMode(id as CreationMode)} />

        {/* Tab Content */}
        {mode === 'scratch' ? (
          <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
            <h3 className="text-base font-medium text-zinc-200 mb-2">
              Suite Details
            </h3>
            <p className="text-sm text-zinc-400 font-light mb-6">
              Create an empty test suite and add items manually
            </p>
            <SuiteForm
              onSubmit={handleCreateEmpty}
              onCancel={() => router.back()}
              loading={loading}
              submitLabel="Create Suite"
            />
          </div>
        ) : (
          <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
            <h3 className="text-base font-medium text-zinc-200 mb-2">
              Choose a Template
            </h3>
            <p className="text-sm text-zinc-400 font-light mb-6">
              Start with pre-defined test items from a template
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowTemplateSelector(true)}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        )}

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelect={handleCreateFromTemplate}
        />
      </div>
    </div>
  );
}
