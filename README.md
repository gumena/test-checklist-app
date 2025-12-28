# TestFlow - AI-Powered Testing Tool

A web-based checklist testing tool with AI-assisted test generation built with Next.js, Supabase, and Claude AI.

## What's Been Built

### ✅ Completed Features

#### 1. Project Setup
- Next.js 16 with TypeScript and Tailwind CSS
- Cinematic Dark theme configured (from your style guide)
- Inter font family integration
- Project structure with organized folders

#### 2. Database & Backend
- **Supabase Database Schema** with the following tables:
  - `folders` - Organize test suites into folders
  - `test_suites` - Main test suite management
  - `checklist_items` - Checklist items with nesting support
  - `test_executions` - Track test execution runs
  - `execution_results` - Individual item results
  - `templates` - Reusable test templates
  - `template_items` - Template checklist items
  - `attachments` - File attachments for failed items
  - `tags` - Tag system for categorization

- **Pre-built Templates** (already in database):
  - Login/Authentication Testing
  - Form Validation Testing
  - API Endpoint Testing
  - Mobile Responsiveness
  - Accessibility (WCAG 2.1)
  - Security Basics

#### 3. TypeScript Types
- Fully typed database schema
- Extended types with relationships
- UI state types
- Analytics types

#### 4. API Layer
- Supabase client configuration
- Suite management API (`api/suites.ts`)
- Checklist items API with tree building (`api/items.ts`)
- Templates API with suite creation from templates (`api/templates.ts`)
- Test execution API with result tracking (`api/executions.ts`)

#### 5. State Management
- Zustand store configured
- State for suites, folders, items, executions, templates, tags
- UI state (sidebar, AI chat, dark mode)

#### 6. UI Components
- **Layout**: Main layout with sidebar navigation
- **Sidebar**: Collapsible navigation with routes
- **Shared Components**: Button, Input, Textarea
- **Home Page**: Dashboard with quick actions

#### 7. Development Server
- Running on http://localhost:3000
- Hot reload enabled

## Project Structure

```
test-checklist-app/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Main layout with sidebar
│   ├── page.tsx             # Home/Dashboard page
│   └── globals.css          # Global styles with theme
├── components/
│   ├── Suite/               # Suite management components
│   ├── Checklist/           # Checklist components
│   ├── AIChat/              # AI chat components
│   ├── Dashboard/           # Dashboard components
│   ├── Templates/           # Template components
│   └── shared/              # Shared UI components
│       ├── Sidebar.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Textarea.tsx
├── api/                     # API layer
│   ├── suites.ts
│   ├── items.ts
│   ├── templates.ts
│   └── executions.ts
├── store/
│   └── useStore.ts          # Zustand state management
├── types/
│   ├── database.types.ts    # Generated Supabase types
│   └── index.ts             # Custom types
├── lib/
│   └── supabase.ts          # Supabase client
└── .env.local               # Environment variables
```

## Getting Started

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Configure Environment
Your `.env.local` file is already configured with Supabase credentials. Add your Claude API key:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 to see the app.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://hbqajrhvnhtjjijurbbk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Mih9Gs0Grq-A7RapiVpJ6w_Db-Re9cV
ANTHROPIC_API_KEY=your_api_key_here
```

## Next Steps - Continue Building

### 1. Suite Management (High Priority)
Create these files:
- `app/suites/page.tsx` - List all test suites
- `app/suites/new/page.tsx` - Create new suite
- `app/suites/[id]/page.tsx` - Suite detail view
- `components/Suite/SuiteList.tsx`
- `components/Suite/SuiteForm.tsx`
- `components/Suite/SuiteCard.tsx`

### 2. Checklist Items
- Drag-and-drop reordering (using @dnd-kit)
- Nested item support
- Bulk operations
- Tag management

### 3. Test Execution
- Execution mode UI
- Timer for each item
- Pass/fail/blocked/skip actions
- File upload for attachments
- Execution reports

### 4. AI Chat Integration
Create `components/AIChat/ChatPanel.tsx`:
- Sliding panel from right
- Anthropic SDK integration
- System prompt for testing expertise
- Test generation and import

### 5. Templates & Analytics
- Template browser
- Analytics dashboard with charts

## Design System

### Colors
- Background: `hsl(240 3% 6%)`
- Surface: `#0f0f10`
- Surface Hover: `#1a1a1c`
- Border: `zinc-800`
- Text: `zinc-200`, `zinc-400`
- Accent: `#d19d75`

### Typography
- Font: Inter (300 Light, 500 Medium)
- Components: `rounded-xl`, `shadow-2xl shadow-black/40`

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Zustand
- Claude API
- @dnd-kit
- Lucide React

## Database

Supabase is configured with:
- All tables and relationships
- 60 pre-built template items
- RLS policies (permissive for development)
