import { Tables } from './database.types';

// Database table types
export type Folder = Tables<'folders'>;
export type TestSuite = Tables<'test_suites'>;
export type ChecklistItem = Tables<'checklist_items'>;
export type TestExecution = Tables<'test_executions'>;
export type ExecutionResult = Tables<'execution_results'>;
export type Template = Tables<'templates'>;
export type TemplateItem = Tables<'template_items'>;
export type Attachment = Tables<'attachments'>;
export type Tag = Tables<'tags'>;

// Enums
export type SuiteStatus = 'draft' | 'active' | 'archived';
export type ItemStatus = 'not_started' | 'in_progress' | 'passed' | 'failed' | 'blocked';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ExecutionStatus = 'in_progress' | 'completed' | 'aborted';
export type ResultStatus = 'passed' | 'failed' | 'blocked' | 'skipped';

// Extended types with relationships
export interface ChecklistItemWithChildren extends ChecklistItem {
  children?: ChecklistItemWithChildren[];
  tags?: Tag[];
}

export interface TestSuiteWithDetails extends TestSuite {
  folder?: Folder;
  items?: ChecklistItemWithChildren[];
  executions?: TestExecution[];
  tags?: Tag[];
  _count?: {
    items: number;
    executions: number;
  };
}

export interface TestExecutionWithDetails extends TestExecution {
  suite: TestSuiteWithDetails;
  results?: ExecutionResultWithDetails[];
}

export interface ExecutionResultWithDetails extends ExecutionResult {
  item: ChecklistItem;
  attachments?: Attachment[];
}

export interface TemplateWithItems extends Template {
  items?: TemplateItem[];
}

// UI State types
export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
  suites: TestSuite[];
}

export interface ExecutionStats {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  passRate: number;
}

export interface AnalyticsData {
  totalSuites: number;
  totalItems: number;
  totalExecutions: number;
  recentExecutions: TestExecutionWithDetails[];
  passFailTrend: {
    date: string;
    passed: number;
    failed: number;
  }[];
  mostFailedItems: {
    item: ChecklistItem;
    failCount: number;
  }[];
}
