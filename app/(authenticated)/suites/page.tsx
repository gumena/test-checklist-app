'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getAllSuites, deleteSuite } from '@/api/suites';
import { TestSuiteWithDetails } from '@/types';
import SuiteList from '@/components/Suite/SuiteList';
import SuiteFilters from '@/components/Suite/SuiteFilters';
import SearchInput from '@/components/shared/SearchInput';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';
import { Plus } from 'lucide-react';

export default function SuitesPage() {
  const router = useRouter();
  const { suites, setSuites } = useStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suiteToDelete, setSuiteToDelete] = useState<TestSuiteWithDetails | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuites();
  }, []);

  const loadSuites = async () => {
    try {
      setLoading(true);
      const data = await getAllSuites();
      setSuites(data);
    } catch (error) {
      console.error('Error loading suites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuites = suites
    .filter((suite) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = suite.name.toLowerCase().includes(query);
        const matchesDescription = suite.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDescription) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && suite.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated_at':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleCreateNew = () => {
    router.push('/suites/new');
  };

  const handleSuiteClick = (suite: TestSuiteWithDetails) => {
    router.push(`/suites/${suite.id}`);
  };

  const handleRun = (suite: TestSuiteWithDetails) => {
    // TODO: Implement start execution
    console.log('Run test:', suite.id);
  };

  const handleEdit = (suite: TestSuiteWithDetails) => {
    router.push(`/suites/${suite.id}?tab=settings`);
  };

  const handleDuplicate = async (suite: TestSuiteWithDetails) => {
    // TODO: Implement duplicate
    console.log('Duplicate suite:', suite.id);
  };

  const handleDelete = async (suite: TestSuiteWithDetails) => {
    setSuiteToDelete(suite);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!suiteToDelete) return;

    try {
      setDeleting(true);
      await deleteSuite(suiteToDelete.id);

      // Update local state
      setSuites(suites.filter(s => s.id !== suiteToDelete.id));

      setDeleteModalOpen(false);
      setSuiteToDelete(null);
    } catch (error) {
      console.error('Error deleting suite:', error);
      alert('Failed to delete suite. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(240,3%,6%)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">
                Test Suites
              </h1>
              <p className="text-sm text-zinc-400 font-light">
                Manage and organize your test suites
              </p>
            </div>
            <Button variant="primary" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Suite
            </Button>
          </div>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search test suites..."
            className="mb-4"
          />

          {/* Filters */}
          <SuiteFilters
            status={statusFilter}
            sortBy={sortBy}
            viewMode={viewMode}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <SuiteList
            suites={filteredSuites}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onRun={handleRun}
            onClick={handleSuiteClick}
            onCreateNew={handleCreateNew}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Test Suite"
        size="md"
      >
        <div className="space-y-2">
          <p className="text-sm text-zinc-300">
            Are you sure you want to delete <span className="font-medium text-zinc-100">"{suiteToDelete?.name}"</span>?
          </p>
          <p className="text-xs text-zinc-400">
            This action cannot be undone. All checklist items and execution history will be permanently deleted.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 !bg-red-600 hover:!bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete Suite'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
