import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { clearAccessTokenCookie } from '@/lib/authCookies';
import {
  TestSuiteWithDetails,
  ChecklistItemWithChildren,
  TestExecutionWithDetails,
  Template,
  Folder,
  Tag
} from '@/types';

interface AppState {
  // Suites
  suites: TestSuiteWithDetails[];
  currentSuite: TestSuiteWithDetails | null;
  setSuites: (suites: TestSuiteWithDetails[]) => void;
  setCurrentSuite: (suite: TestSuiteWithDetails | null) => void;
  addSuite: (suite: TestSuiteWithDetails) => void;
  updateSuite: (id: string, updates: Partial<TestSuiteWithDetails>) => void;
  deleteSuite: (id: string) => void;

  // Folders
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // Checklist Items
  items: ChecklistItemWithChildren[];
  setItems: (items: ChecklistItemWithChildren[]) => void;
  addItem: (item: ChecklistItemWithChildren) => void;
  updateItem: (id: string, updates: Partial<ChecklistItemWithChildren>) => void;
  deleteItem: (id: string) => void;

  // Executions
  executions: TestExecutionWithDetails[];
  currentExecution: TestExecutionWithDetails | null;
  setExecutions: (executions: TestExecutionWithDetails[]) => void;
  setCurrentExecution: (execution: TestExecutionWithDetails | null) => void;
  addExecution: (execution: TestExecutionWithDetails) => void;
  updateExecution: (id: string, updates: Partial<TestExecutionWithDetails>) => void;

  // Templates
  templates: Template[];
  setTemplates: (templates: Template[]) => void;

  // Tags
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  // Suites
  suites: [],
  currentSuite: null,
  setSuites: (suites) => set({ suites }),
  setCurrentSuite: (suite) => set({ currentSuite: suite }),
  addSuite: (suite) => set((state) => ({ suites: [...state.suites, suite] })),
  updateSuite: (id, updates) => set((state) => ({
    suites: state.suites.map((s) => s.id === id ? { ...s, ...updates } : s),
    currentSuite: state.currentSuite?.id === id ? { ...state.currentSuite, ...updates } : state.currentSuite,
  })),
  deleteSuite: (id) => set((state) => ({
    suites: state.suites.filter((s) => s.id !== id),
    currentSuite: state.currentSuite?.id === id ? null : state.currentSuite,
  })),

  // Folders
  folders: [],
  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (id, updates) => set((state) => ({
    folders: state.folders.map((f) => f.id === id ? { ...f, ...updates } : f),
  })),
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter((f) => f.id !== id),
  })),

  // Checklist Items
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((i) => i.id === id ? { ...i, ...updates } : i),
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  // Executions
  executions: [],
  currentExecution: null,
  setExecutions: (executions) => set({ executions }),
  setCurrentExecution: (execution) => set({ currentExecution: execution }),
  addExecution: (execution) => set((state) => ({ executions: [...state.executions, execution] })),
  updateExecution: (id, updates) => set((state) => ({
    executions: state.executions.map((e) => e.id === id ? { ...e, ...updates } : e),
    currentExecution: state.currentExecution?.id === id ? { ...state.currentExecution, ...updates } : state.currentExecution,
  })),

  // Templates
  templates: [],
  setTemplates: (templates) => set({ templates }),

  // Tags
  tags: [],
  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  aiChatOpen: false,
  setAiChatOpen: (open) => set({ aiChatOpen: open }),
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Auth State
  user: null,
  isAuthenticated: false,
  authLoading: true,
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    authLoading: false
  }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } finally {
      clearAccessTokenCookie();
      set({
        user: null,
        isAuthenticated: false,
        suites: [],
        executions: [],
        items: [],
        folders: [],
        templates: [],
        tags: [],
        currentSuite: null,
        currentExecution: null,
      });
    }
  },
}));
