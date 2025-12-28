# TestFlow - Geliştirme Planı

## 📋 Proje Özeti

AI destekli test yönetim aracı. Next.js, Supabase ve Claude API kullanarak test suite'leri oluşturma, yönetme ve çalıştırma platformu.

---

## ✅ Tamamlanan İşler

### 1. Temel Altyapı
- [x] Next.js 16 + TypeScript + Tailwind CSS kurulumu
- [x] Cinematic Dark tema (StyleGuide'dan) uygulandı
- [x] Inter font entegrasyonu (Next.js font optimization)
- [x] Proje klasör yapısı oluşturuldu
- [x] Environment variables (.env.local) yapılandırıldı

### 2. Veritabanı
- [x] Supabase bağlantısı kuruldu
- [x] 11 tablo oluşturuldu:
  - folders (klasör organizasyonu)
  - test_suites (test paketleri)
  - checklist_items (test maddeleri, nested destekli)
  - test_executions (test koşuları)
  - execution_results (sonuçlar)
  - templates (şablonlar)
  - template_items (şablon maddeleri)
  - attachments (dosya ekleri)
  - tags (etiketler)
  - suite_tags (suite etiketleme)
  - item_tags (item etiketleme)
- [x] 60 hazır template item eklendi (6 kategori):
  - Login/Authentication (10 item)
  - Form Validation (10 item)
  - API Endpoint Testing (10 item)
  - Mobile Responsiveness (10 item)
  - Accessibility WCAG 2.1 (10 item)
  - Security Basics (10 item)
- [x] RLS policies aktif (şu an tüm işlemlere açık)
- [x] Auto-update triggers (updated_at otomatik güncelleme)
- [x] Indexler oluşturuldu

### 3. TypeScript Types
- [x] Database types generate edildi (`types/database.types.ts`)
- [x] Custom types oluşturuldu (`types/index.ts`)
- [x] Extended types (ilişkiler dahil)
- [x] UI state types

### 4. API Layer
- [x] Supabase client (`lib/supabase.ts`)
- [x] Suite API (`api/suites.ts`) - CRUD operasyonları
- [x] Items API (`api/items.ts`) - Tree building, bulk operations
- [x] Templates API (`api/templates.ts`) - Template'den suite oluşturma
- [x] Executions API (`api/executions.ts`) - Test koşuları, sonuç kaydetme

### 5. State Management
- [x] Zustand store (`store/useStore.ts`)
- [x] Suites, folders, items, executions, templates state'leri
- [x] UI state (sidebar, AI chat, dark mode)

### 6. UI Components
- [x] Layout (`app/layout.tsx`) - Sidebar entegrasyonu
- [x] Sidebar (`components/shared/Sidebar.tsx`) - Collapsible navigation
- [x] Button (`components/shared/Button.tsx`) - 4 variant
- [x] Input (`components/shared/Input.tsx`)
- [x] Textarea (`components/shared/Textarea.tsx`)
- [x] Home page (`app/page.tsx`) - Dashboard ile quick actions

### 7. Dependencies
Yüklü paketler:
- @supabase/supabase-js
- @anthropic-ai/sdk
- zustand
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- lucide-react
- date-fns

---

## 🚀 Yapılacaklar (Öncelik Sırasıyla)

### PHASE 1: Test Suite Yönetimi (YÜksek Öncelik)

#### 1.1 Suite List Page
**Dosya:** `app/suites/page.tsx`

**Özellikler:**
- Tüm suite'leri listeleme
- Grid/List view toggle
- Arama fonksiyonu
- Filtreleme (status: draft/active/archived)
- Sıralama (tarih, isim, durum)
- Suite card component ile görüntüleme

**Gerekli Componentler:**
- `components/Suite/SuiteList.tsx`
- `components/Suite/SuiteCard.tsx`
- `components/Suite/SuiteFilters.tsx`
- `components/shared/SearchInput.tsx`
- `components/shared/EmptyState.tsx`

**API Calls:**
```typescript
- getAllSuites() -> TestSuiteWithDetails[]
- Filters: status, created_at range, folder_id
```

**UI Tasarım:**
- Grid layout (responsive: 1/2/3 columns)
- Her card: isim, açıklama, item sayısı, son execution, status badge
- Hover'da: Edit, Delete, Duplicate, Run Test butonları
- Empty state: "Henüz suite yok" + "Create Suite" butonu

#### 1.2 Create Suite Page
**Dosya:** `app/suites/new/page.tsx`

**Form Fields:**
- Name (required)
- Description (optional)
- Folder (dropdown, optional)
- Status (draft/active/archived)
- Tags (multi-select)

**İki Yol:**
1. Boş suite oluştur
2. Template'den suite oluştur (template seçici)

**Gerekli Componentler:**
- `components/Suite/SuiteForm.tsx`
- `components/Suite/TemplateSelector.tsx`
- `components/shared/Select.tsx`
- `components/shared/TagInput.tsx`

**Flow:**
1. Form doldur
2. "Create from Template" seçilirse -> Template modal aç
3. Template seçilirse -> Template items otomatik kopyalanır
4. Suite oluşturulunca -> Suite detail sayfasına yönlendir

**API Calls:**
```typescript
- createSuite(data) -> suite
- getAllTemplates() -> Template[]
- createSuiteFromTemplate(templateId, suiteName) -> suiteId
```

#### 1.3 Suite Detail Page
**Dosya:** `app/suites/[id]/page.tsx`

**Sections:**
1. **Header**
   - Suite adı (inline edit)
   - Description (inline edit)
   - Status badge
   - Action buttons: Run Test, Edit, Archive, Delete, Duplicate

2. **Stats Bar**
   - Total items
   - Last execution date
   - Pass rate (son execution'dan)
   - Tags

3. **Tabs:**
   - **Checklist Items** (default)
     - Tüm items ağaç yapısında
     - Add item butonu
     - Drag-drop reordering
     - Bulk actions toolbar
   - **Executions**
     - Geçmiş test koşuları listesi
     - Her koşu: tarih, sonuç, stats
     - Detail sayfasına link
   - **Settings**
     - Suite düzenleme formu
     - Folder taşıma
     - Export as JSON
     - Danger zone (archive/delete)

**Gerekli Componentler:**
- `components/Suite/SuiteDetail.tsx`
- `components/Suite/SuiteHeader.tsx`
- `components/Suite/SuiteStats.tsx`
- `components/Suite/SuiteTabs.tsx`
- `components/Checklist/ChecklistTree.tsx`
- `components/Checklist/ChecklistItem.tsx`
- `components/Checklist/AddItemForm.tsx`

**API Calls:**
```typescript
- getSuiteById(id) -> SuiteWithDetails
- getItemsBySuiteId(id) -> ChecklistItem[]
- getExecutionsBySuiteId(id) -> TestExecution[]
- updateSuite(id, updates)
- deleteSuite(id)
```

---

### PHASE 2: Checklist Item Yönetimi

#### 2.1 Item CRUD
**Dosya:** `components/Checklist/ChecklistItem.tsx`

**Features:**
- Inline düzenleme (title, description, expected result)
- Priority badge (critical/high/medium/low)
- Status badge (not_started/in_progress/passed/failed/blocked)
- Notes field (collapsible)
- Tags
- Parent-child ilişkisi gösterimi
- Akciyonlar: Edit, Delete, Duplicate, Add Child, Move

**Component State:**
- Edit mode toggle
- Expanded/collapsed (nested items için)
- Selected (bulk actions için)

#### 2.2 Drag-Drop Reordering
**Library:** @dnd-kit

**Özellikler:**
- Same level'da yeniden sıralama
- Parent değiştirme (nested items)
- Visual feedback (dragging state)
- Position update API call

**Implementation:**
```typescript
- useSortable hook
- DndContext wrapper
- SortableContext for list
- Position güncelleme: updateItemPosition(id, newPosition)
```

#### 2.3 Bulk Actions
**Component:** `components/Checklist/BulkActionsBar.tsx`

**Actions:**
- Select all / Deselect all
- Delete selected
- Change priority
- Change status
- Add tags
- Move to another suite
- Duplicate

**UI:**
- Fixed bottom bar (selected items > 0)
- Selected count
- Action buttons
- Cancel button

**API Calls:**
```typescript
- bulkDeleteItems(ids[])
- bulkUpdateItems(ids[], updates)
```

#### 2.4 Add Item Form
**Component:** `components/Checklist/AddItemForm.tsx`

**Fields:**
- Title (required)
- Description (markdown supported)
- Expected Result (markdown supported)
- Priority (default: medium)
- Parent item (dropdown, optional)
- Tags (multi-select)

**Modes:**
1. Quick add (sadece title)
2. Full form (tüm alanlar)

**API Call:**
```typescript
- createItem(data) -> ChecklistItem
```

---

### PHASE 3: Test Execution Mode

#### 3.1 Start Execution
**Trigger:** Suite detail page'de "Run Test" butonu

**Flow:**
1. Execution oluştur (`startExecution(suiteId)`)
2. Execution sayfasına yönlendir (`/executions/[id]`)

#### 3.2 Execution Page
**Dosya:** `app/executions/[id]/page.tsx`

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: Suite Name, Timer, Progress │
│ Stats: 5/20 completed, 3 passed...  │
├─────────────────────────────────────┤
│                                     │
│  Current Item (büyük görünüm)      │
│  - Title                            │
│  - Description                      │
│  - Expected Result                  │
│  - Timer (bu item için)            │
│                                     │
│  Action Buttons:                    │
│  [Pass] [Fail] [Blocked] [Skip]    │
│                                     │
│  Comment (optional)                 │
│  Attach File (fail için)           │
│                                     │
├─────────────────────────────────────┤
│ Next Items Preview (liste)          │
└─────────────────────────────────────┘
```

**Features:**
- Item-by-item navigation
- Timer per item
- Result kaydetme (pass/fail/blocked/skip)
- Comment ekleme
- File upload (failed items için)
- Progress tracking
- Pause/Resume
- Complete execution

**Components:**
- `components/Execution/ExecutionHeader.tsx`
- `components/Execution/ExecutionProgress.tsx`
- `components/Execution/CurrentItem.tsx`
- `components/Execution/ActionButtons.tsx`
- `components/Execution/CommentBox.tsx`
- `components/Execution/FileUpload.tsx`
- `components/Execution/ItemsList.tsx`

**API Calls:**
```typescript
- getExecutionById(id) -> ExecutionWithDetails
- recordResult(executionId, itemId, status, comment, duration)
- completeExecution(executionId)
- uploadAttachment(file) -> attachmentUrl
```

#### 3.3 Execution Report
**Sayfa:** Execution complete olunca gösterilir

**Sections:**
1. Summary Stats
   - Total items
   - Passed/Failed/Blocked/Skipped counts
   - Pass rate %
   - Total duration
   - Started at / Completed at

2. Failed Items Detail
   - Her failed item için: Title, Comment, Attachments
   - Link to item (yeniden test için)

3. Actions
   - Retry failed items
   - Export report (PDF/JSON)
   - Return to suite

**Component:**
- `components/Execution/ExecutionReport.tsx`

---

### PHASE 4: AI Chat Integration

#### 4.1 Chat Panel Component
**Dosya:** `components/AIChat/ChatPanel.tsx`

**UI:**
- Sağdan slide-in panel
- Fixed width (400-500px)
- Close button
- Chat mesajları (scroll)
- Input area (textarea + send button)
- Loading state

**Features:**
- Anthropic SDK entegrasyonu
- System prompt (testing expertise)
- Chat history
- Code block highlighting
- Import generated tests to suite

**System Prompt:**
```
You are an expert software testing assistant. You help users:
- Generate comprehensive test checklists
- Suggest edge cases and boundary conditions
- Convert user stories into test cases
- Recommend testing approaches (smoke, regression, exploratory)
- Write clear test descriptions and expected results
- Follow testing best practices

When generating tests, format them as:
Title: [clear, actionable title]
Description: [steps to reproduce]
Expected Result: [what should happen]
Priority: [critical/high/medium/low]
```

#### 4.2 AI Features

**1. Generate Tests from Description**
Input: "Test login functionality"
Output: 10-15 test items

**2. Suggest Edge Cases**
Input: Mevcut test items
Output: Eksik edge case'ler

**3. Convert User Story to Tests**
Input: "As a user, I want to reset my password..."
Output: Complete test scenario

**4. Improve Test Description**
Input: Var olan test
Output: Daha detaylı test description

#### 4.3 Import to Suite
**Flow:**
1. AI test listesi üretir
2. "Import to Suite" butonu görünür
3. User tıklar
4. Tests suite'e eklenir
5. Success message

**Component:**
- `components/AIChat/ChatMessage.tsx`
- `components/AIChat/ChatInput.tsx`
- `components/AIChat/ImportButton.tsx`

**API:**
```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: TESTING_SYSTEM_PROMPT,
    messages: messages,
  });

  return Response.json(response);
}
```

---

### PHASE 5: Templates Browser

#### 5.1 Templates Page
**Dosya:** `app/templates/page.tsx`

**Layout:**
- Grid of template cards
- Categories filter (sidebar)
- Search
- Sort by name/category

**Template Card:**
- Name
- Description
- Category badge
- Item count
- "Use Template" button
- Preview button (modal)

**Components:**
- `components/Templates/TemplateList.tsx`
- `components/Templates/TemplateCard.tsx`
- `components/Templates/TemplatePreview.tsx` (modal)

#### 5.2 Use Template
**Flow:**
1. User clicks "Use Template"
2. Modal opens: "Create suite from template"
3. Form: Suite name, folder (optional)
4. Submit -> Suite oluşturulur
5. Redirect to new suite

**API:**
```typescript
- getAllTemplates() -> Template[]
- getTemplateWithItems(id) -> TemplateWithItems
- createSuiteFromTemplate(templateId, suiteName, folderId?)
```

#### 5.3 Save as Template
**Feature:** Mevcut suite'i template olarak kaydet

**Location:** Suite settings tab

**Flow:**
1. "Save as Template" button
2. Modal: Template name, description, category
3. Submit -> Template + items kopyalanır
4. Success message

---

### PHASE 6: Analytics Dashboard

#### 6.1 Dashboard Page
**Dosya:** `app/analytics/page.tsx`

**Widgets:**

1. **Overview Stats** (4 cards)
   - Total Suites
   - Total Items
   - Total Executions
   - Average Pass Rate

2. **Pass/Fail Trend** (Line chart)
   - X-axis: Last 30 days
   - Y-axis: Pass/Fail count
   - Library: recharts veya chart.js

3. **Most Failed Items** (Table)
   - Item title
   - Suite name
   - Fail count
   - Link to item

4. **Recent Executions** (List)
   - Suite name
   - Date
   - Stats (pass/fail counts)
   - Link to report

5. **Test Coverage by Category** (Pie chart)
   - Template categories
   - Item counts

**Components:**
- `components/Dashboard/OverviewStats.tsx`
- `components/Dashboard/TrendChart.tsx`
- `components/Dashboard/FailedItemsTable.tsx`
- `components/Dashboard/RecentExecutions.tsx`

**API:**
```typescript
- getAnalyticsData() -> {
    totalSuites,
    totalItems,
    totalExecutions,
    recentExecutions[],
    passFailTrend[],
    mostFailedItems[]
  }
```

---

## 🎨 Design System (StyleGuide)

### Colors
```css
--background: hsl(240 3% 6%)
--surface: #0f0f10
--surface-hover: #1a1a1c
--border: zinc-800 (#27272a)
--border-focus: zinc-700 (#3f3f46)
--text-primary: zinc-200 (#e4e4e7)
--text-secondary: zinc-400 (#a1a1aa)
--text-muted: zinc-500 (#71717a)
--text-accent: #d19d75
```

### Typography
- Font: Inter (300, 400, 500, 600)
- Headings: font-medium, tracking-tight
- Body: font-light
- Hero: text-4xl to text-5xl
- Section: text-2xl to text-3xl
- Body: text-sm to text-base

### Components
- Border Radius: rounded-xl (12px) for cards, rounded-lg (8px) for buttons
- Shadows: shadow-2xl shadow-black/40
- Transitions: transition-all duration-200
- Hover: hover:bg-[#1a1a1c] hover:border-zinc-700

### Status Colors
```typescript
status: {
  draft: 'zinc' (gray),
  active: 'blue',
  archived: 'zinc-600' (darker gray)
}

priority: {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'green'
}

result: {
  passed: 'green',
  failed: 'red',
  blocked: 'orange',
  skipped: 'gray'
}
```

---

## 📁 Dosya Yapısı (Tamamlanacak)

```
app/
├── suites/
│   ├── page.tsx              # Liste
│   ├── new/
│   │   └── page.tsx          # Yeni suite
│   └── [id]/
│       └── page.tsx          # Detail
├── executions/
│   └── [id]/
│       └── page.tsx          # Execution mode
├── templates/
│   └── page.tsx              # Template browser
├── analytics/
│   └── page.tsx              # Dashboard
└── api/
    └── chat/
        └── route.ts          # Claude API endpoint

components/
├── Suite/
│   ├── SuiteList.tsx
│   ├── SuiteCard.tsx
│   ├── SuiteForm.tsx
│   ├── SuiteDetail.tsx
│   ├── SuiteHeader.tsx
│   ├── SuiteStats.tsx
│   ├── SuiteTabs.tsx
│   ├── SuiteFilters.tsx
│   └── TemplateSelector.tsx
├── Checklist/
│   ├── ChecklistTree.tsx
│   ├── ChecklistItem.tsx
│   ├── AddItemForm.tsx
│   ├── BulkActionsBar.tsx
│   └── ItemEditor.tsx
├── Execution/
│   ├── ExecutionHeader.tsx
│   ├── ExecutionProgress.tsx
│   ├── CurrentItem.tsx
│   ├── ActionButtons.tsx
│   ├── CommentBox.tsx
│   ├── FileUpload.tsx
│   ├── ItemsList.tsx
│   └── ExecutionReport.tsx
├── AIChat/
│   ├── ChatPanel.tsx
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   └── ImportButton.tsx
├── Templates/
│   ├── TemplateList.tsx
│   ├── TemplateCard.tsx
│   └── TemplatePreview.tsx
├── Dashboard/
│   ├── OverviewStats.tsx
│   ├── TrendChart.tsx
│   ├── FailedItemsTable.tsx
│   └── RecentExecutions.tsx
└── shared/
    ├── Sidebar.tsx          ✅
    ├── Button.tsx           ✅
    ├── Input.tsx            ✅
    ├── Textarea.tsx         ✅
    ├── Select.tsx
    ├── SearchInput.tsx
    ├── TagInput.tsx
    ├── EmptyState.tsx
    ├── LoadingSpinner.tsx
    ├── Modal.tsx
    ├── Toast.tsx
    └── Badge.tsx
```

---

## 🔧 Geliştirme Notları

### API Calls Best Practices
```typescript
// Always handle errors
try {
  const data = await getAllSuites();
  return data;
} catch (error) {
  console.error('Error:', error);
  // Show toast notification
  return [];
}

// Loading states
const [loading, setLoading] = useState(false);
setLoading(true);
const data = await api();
setLoading(false);

// Optimistic updates
updateStore(optimisticData);
await api();
// If error, revert
```

### State Management Pattern
```typescript
// Zustand store
const { suites, addSuite } = useStore();

// Local component state
const [editMode, setEditMode] = useState(false);

// Server state (API calls)
const { data, loading, error } = useQuery();
```

### Component Composition
```typescript
// Container component
function SuitePage() {
  const suites = useStore(s => s.suites);
  // Data fetching, logic
  return <SuiteList suites={suites} />;
}

// Presentational component
function SuiteList({ suites }) {
  // Only UI logic
  return suites.map(s => <SuiteCard key={s.id} suite={s} />);
}
```

---

## 🚀 Next Session Checklist

Yeni session'da nereden devam edilecek:

1. **Hemen başla:**
   ```bash
   cd test-checklist-app
   npm run dev
   ```

2. **İlk yapılacak:**
   - [ ] Suite list page oluştur (`app/suites/page.tsx`)
   - [ ] SuiteCard component
   - [ ] API'den suite'leri çek
   - [ ] Grid layout

3. **Sonra:**
   - [ ] Create suite page
   - [ ] Suite detail page
   - [ ] Checklist item management

4. **Environment check:**
   - [ ] Supabase bağlantısı çalışıyor mu?
   - [ ] `.env.local` doğru mu?
   - [ ] Dev server başlıyor mu?

---

## 📚 Referanslar

### Supabase API Kullanımı
```typescript
// Query with relationships
const { data } = await supabase
  .from('test_suites')
  .select(`
    *,
    folder:folders(*),
    items:checklist_items(count)
  `)
  .eq('status', 'active');

// Insert
const { data } = await supabase
  .from('test_suites')
  .insert({ name, description })
  .select()
  .single();

// Update
await supabase
  .from('test_suites')
  .update({ status: 'archived' })
  .eq('id', suiteId);

// Delete
await supabase
  .from('test_suites')
  .delete()
  .eq('id', suiteId);
```

### Zustand Store Pattern
```typescript
const useStore = create<State>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(i =>
      i.id === id ? { ...i, ...updates } : i
    )
  })),
}));
```

### Next.js Navigation
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/suites/123');
router.back();
```

---

## 🎯 Başarı Kriterleri

Her phase için "done" sayılabilmesi için:

### Phase 1: Suite Management
- [ ] Suite listesi görüntüleniyor
- [ ] Yeni suite oluşturulabiliyor
- [ ] Template'den suite oluşturulabiliyor
- [ ] Suite düzenlenebiliyor
- [ ] Suite silinebiliyor
- [ ] Suite detayları görüntüleniyor

### Phase 2: Checklist Items
- [ ] Item eklenebiliyor
- [ ] Item düzenlenebiliyor
- [ ] Item silinebiliyor
- [ ] Drag-drop çalışıyor
- [ ] Nested items oluşturulabiliyor
- [ ] Bulk actions çalışıyor

### Phase 3: Execution
- [ ] Execution başlatılabiliyor
- [ ] Items tek tek test edilebiliyor
- [ ] Sonuçlar kaydediliyor
- [ ] Timer çalışıyor
- [ ] Report oluşturuluyor

### Phase 4: AI Chat
- [ ] Chat açılıyor/kapanıyor
- [ ] Claude API yanıt veriyor
- [ ] Test listesi üretilebiliyor
- [ ] Tests suite'e import edilebiliyor

### Phase 5: Templates
- [ ] Templates listelenebiliyor
- [ ] Template preview çalışıyor
- [ ] Template'den suite oluşturuluyor
- [ ] Suite template olarak kaydedilebiliyor

### Phase 6: Analytics
- [ ] Stats doğru hesaplanıyor
- [ ] Grafikler render oluyor
- [ ] Failed items tablosu çalışıyor
- [ ] Recent executions gösteriliyor

---

## 💡 İpuçları

1. **Her feature için önce API test et**
   - Supabase'de manuel query çalıştır
   - API fonksiyonunu test et
   - Sonra UI'a entegre et

2. **Component'leri küçük tut**
   - Single responsibility
   - Reusable olsun
   - Props well-typed

3. **Loading states unutma**
   - Her API call'da loading state
   - Skeleton screens kullan
   - Error states handle et

4. **Mobile responsive olsun**
   - Tailwind responsive classes
   - Test on mobile viewport
   - Touch-friendly buttons

5. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Focus indicators

---

**Son Güncelleme:** 28 Aralık 2025
**Proje Durumu:** Foundation Complete - Ready for Feature Development
**Dev Server:** http://localhost:3000
**Database:** Supabase (hbqajrhvnhtjjijurbbk)
