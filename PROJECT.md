# Compliance Workflow Platform

## ⚠️ CRITICAL MEMORY MANAGEMENT - READ FIRST ⚠️

### Context Compaction Protocol
**COMPACT WHEN**:
- Context utilization > 60% (optimal: 40-60%)
- Current: [UPDATE_ON_COMPACT]%
- Error patterns repeat > 3 times
- Implementation deviates from plan
- Alternative approaches being considered

**COMPACTION PROCESS**:
1. Preserve: Current phase status, recent decisions, active todos
2. Compress: Completed phase details, old error logs
3. Update: This section with new context %
4. Eliminate: Redundant information, raw logs

### Anti-Regression Protocols
**NEVER**:
- ❌ Switch to "simpler" approach when facing challenges
- ❌ Abandon defined architecture due to complexity
- ❌ Skip planning phase and jump to implementation
- ❌ Create mock implementations instead of real features
- ❌ Deviate from demo expansion plan without user approval

**ALWAYS**:
- ✅ Fix existing code before writing new code
- ✅ Complete current phase before moving to next
- ✅ Follow user instructions exactly
- ✅ Reference PROJECT.md before major decisions
- ✅ Update todos and track progress

### Memory Check Before Actions
**BEFORE ANY IMPLEMENTATION**:
1. Read relevant PROJECT.md sections
2. Check current phase and todos
3. Verify alignment with demo expansion plan
4. Confirm no regressions from previous work

---

## Project Overview
A compliance-focused workflow automation platform with visual workflow canvas, evidence management, approval workflows, and regulatory mapping.

**Current Focus**: 3-environment demo (Prototype | Production | Evaluations)

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Framework**: Material-UI (MUI) v7
- **Workflow Canvas**: React Flow v11
- **Charts**: Recharts v3
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM v7

## Project Structure
```
src/
├── components/
│   └── workflow/
│       ├── ComponentPalette.tsx    # Left sidebar with draggable components
│       ├── CustomNode.tsx          # Custom node types (Standard, Decision, Circular)
│       └── WorkflowCard.tsx        # Top workflow persona cards
├── pages/
│   ├── Dashboard.tsx               # Framework readiness, charts, KPIs
│   ├── WorkflowCanvas.tsx          # Main workflow builder
│   ├── EvidenceBrowser.tsx         # Evidence management
│   ├── ApprovalWorkflows.tsx       # Approval swimlanes
│   └── RegulatoryMapping.tsx      # Framework-to-control mapping
├── store/
│   └── index.ts                    # Zustand global state
├── styles/
│   └── theme.ts                    # MUI theme + color constants
├── types/
│   └── index.ts                    # TypeScript interfaces
├── App.tsx                         # Main app with navigation
└── main.tsx                        # Entry point
```

## Key Features

### 1. Workflow Canvas (Main Feature)
- **Drag-drop components** from left palette onto canvas
- **10 component categories**: Triggers, AI Agents, Chat Models, Loops, Logic, Transformations, Parsers, Memory, Compliance Tools, Integrations
- **Visual node types**: Standard (rounded boxes), Decision (diamonds), Circular (sub-nodes)
- **Interactive connections**: Drag from green output handles to blue input handles
- **Node configuration**: Click node → opens drawer on right to edit properties
- **Delete nodes**: Click node → Delete button OR press Delete/Backspace key
- **Delete edges**: Click connection line → press Delete key
- **Multi-select**: Drag selection box around multiple nodes
- **Zoom/Pan**: Scroll to zoom, drag canvas to pan
- **Grid snapping**: Nodes snap to 15px grid

### 2. Component Palette (Left Sidebar)
- **Renameable components**: Click edit icon → rename → save
- **Expandable categories**: Click to expand/collapse sections
- **Categories**:
  - Triggers (Execute Workflow, Webhook, Schedule)
  - AI Agents (AI Agent, Critic, Refiner, Evaluation)
  - Chat Models (OpenAI, Anthropic, Custom)
  - Loop & Iteration (Loop Over Items, Split in Batches, Aggregate)
  - Logic & Conditionals (If, Switch, Merge)
  - Data Transformation (Edit Fields, Set Values, Filter, Sort)
  - Output & Parsers (Code, Structured Output Parser, JSON Parser)
  - Memory & Storage (Postgres, Redis, Vector Store)
  - Compliance Tools (Evidence Validator, Policy Checker, Risk Scorer, Audit Logger)
  - Integrations (Slack, Jira, GitHub, AWS)

### 3. Workflow Personas (Top Cards)
- **5 pre-built workflow types**: Claims Detection, Vendor Risk, Access Review, Policy Violation, Evidence Collection
- Clickable cards to load templates (future enhancement)

### 4. Dashboard
- Framework readiness cards (SOC2, ISO27001, HIPAA, GDPR)
- Test trends line chart
- Evidence status donut chart
- Task forecast bar chart
- Approval queue list
- Integration health status

### 5. Evidence Browser
- Filter by status, framework, search
- Card-based grid view
- Evidence detail drawer with metadata
- Activity log tracking

### 6. Approval Workflows
- Swimlane visualization
- Parallel/sequential approval stages
- Approval timeline
- In-app approve/reject buttons

### 7. Regulatory Mapping
- Framework selector
- Control-to-citation mapping
- Citation text with interpretation
- Evidence requirements list

## Design System

### Colors
- **Primary Blue**: #1976D2
- **Success Green**: #2E7D32
- **Warning Yellow**: #ED6C02
- **Error Red**: #D32F2F
- **Dark Background**: #0f0f1e
- **Panel Background**: rgba(17, 24, 39, 0.98)

### Node Colors
- **Input Handle (target)**: #6366f1 (blue)
- **Output Handle (source)**: #10b981 (green)
- **Node Background**: rgba(30, 30, 50, 0.9)
- **Connection Lines**: #6366f1 (animated)

### Typography
- **Font**: Inter
- **H1**: 32px, 600 weight
- **H2**: 24px, 600 weight
- **Body**: 14px, 1.5 line-height
- **Code**: Roboto Mono

## Component Architecture

### CustomNode Types
1. **StandardNode**: Rectangular box with icon, label, subtitle, connector handles
2. **DecisionNode**: Diamond shape (45° rotated) for conditional logic
3. **CircularNode**: Small circles for sub-components (Chat Models, Memory, Tools)

### Handle System
- **Target (left side)**: Blue circle, accepts incoming connections
- **Source (right side)**: Green circle, creates outgoing connections
- **Sub-node handles**: Bottom of parent nodes with dashed connections
- **Handle size**: 16px × 16px, 3px white border, cursor: crosshair

### State Management
- **Zustand store**: Global state for controls, evidence, framework readiness
- **React Flow state**: useNodesState, useEdgesState for workflow nodes/edges
- **Local state**: Selected node, drawer open/close, dragged items

## Development

### Run Dev Server
```bash
cd ~/compliance-workflow-platform
npm run dev
```
Access at: http://localhost:3000/

### Build for Production
```bash
npm run build
```

### Key Files to Edit
- **Add new component**: `src/components/workflow/ComponentPalette.tsx` (componentCategories array)
- **Change node appearance**: `src/components/workflow/CustomNode.tsx`
- **Modify workflow logic**: `src/pages/WorkflowCanvas.tsx`
- **Update theme**: `src/styles/theme.ts`

## Known Issues & Solutions

### Issue: Connectors not visible
**Solution**: Handles are now 16px with 3px white border, green (source) and blue (target)

### Issue: Can't drag from palette
**Solution**: Ensure `draggable={editingId !== item.id}` in ComponentPalette, verify onDragStart handler

### Issue: Drawer not opening on node click
**Solution**: Verify `onNodeClick` prop in ReactFlow, check `configDrawerOpen` state

### Issue: Delete button not working
**Solution**: Check `handleDeleteNode` removes from both nodes and edges arrays

## Future Enhancements
- [ ] Undo/Redo (Cmd+Z, Cmd+Shift+Z)
- [ ] Copy/Paste nodes (Cmd+C, Cmd+V)
- [ ] Right-click context menu
- [ ] Save/Load workflow as JSON
- [ ] Execute/Test workflow mode
- [ ] Template library from workflow cards
- [ ] Edge labels
- [ ] Custom edge types
- [ ] Node grouping
- [ ] Mini-map navigation

## Git Repository
Repository: https://github.com/arpitvyas (to be initialized)

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support

## Performance
- ~2,100 lines of code
- 13 TypeScript files
- Fast HMR with Vite
- No console errors

---

## Demo Expansion Plan

### Overview
Expanding the platform into a **3-environment demo** showcasing:
1. **Prototype Station** - Open-access workflow builder (enhance existing WorkflowCanvas)
2. **Production Environment** - Restricted deployment and monitoring (new page)
3. **Evaluation Library** - Shared evaluation system like LangSmith (new page)

**Goal**: Working visual demo/prototype with mock data and localStorage persistence

---

### Three Demo Environments

#### 1. Prototype Station (Enhanced WorkflowCanvas)
**Route**: `/prototype`
**Access**: Open to everyone, no authentication
**Purpose**: Build and test workflows with simulated execution

**Enhancements to Add**:
- Top toolbar: Save | Load | Run Test | Clear Canvas
- Bottom execution panel with mock progress logs
- Save/load workflows to localStorage
- 3 pre-built example workflow templates
- "Run Test" simulates execution with delays and mock output
- Export workflow as JSON

**New Components**:
- `PrototypeToolbar.tsx` - Save/Load/Run/Clear buttons
- `ExecutionPanel.tsx` - Bottom panel showing simulated logs
- `WorkflowTemplates.tsx` - Load example workflows

---

#### 2. Production Environment (New Page)
**Route**: `/production`
**Access**: Mock authentication (visual only, no real auth)
**Purpose**: Show deployed workflows, execution monitoring, role-based UI

**Features**:
- Mock login banner: "Logged in as: Alex Chen (Data Scientist)"
- Role toggle: SDE ↔ Data Scientist
- List of deployed workflows with status cards (Running/Completed/Failed)
- "Deploy from Prototype" button
- Execution timeline visualization
- Workflow metrics: success rate, avg duration, last run

**New Components**:
- `ProductionEnvironment.tsx` - Main production page
- `MockAuthBanner.tsx` - Shows logged-in user and role
- `DeployedWorkflowList.tsx` - Grid of workflow status cards
- `WorkflowStatusCard.tsx` - Individual workflow card
- `DeploymentModal.tsx` - Shows deployment progress (mock)
- `ExecutionTimeline.tsx` - Visual timeline of workflow runs

**Mock Data Example**:
```typescript
const mockDeployedWorkflows = [
  {
    id: 1,
    name: "Claims Detection v2",
    status: "running",
    lastRun: "2 mins ago",
    successRate: 94.2,
    avgDuration: "1.3s"
  },
  // ... more workflows
]
```

---

#### 3. Evaluation Library (New Page - LangSmith Style)
**Route**: `/evaluations`
**Access**: Shared across prototype and production
**Purpose**: Manage test datasets, run evaluations, compare workflow performance

**Features**:
- **Tab 1: Datasets** - List of test case collections
  - Create/edit datasets with test cases
  - Tag datasets by domain (HIPAA, SOC2, etc.)

- **Tab 2: Evaluation Runs** - History of evaluations
  - Table: Workflow | Dataset | Accuracy | Latency | Date | Environment
  - Filter by workflow, dataset, environment

- **Tab 3: Comparisons** - Side-by-side workflow comparison
  - Select 2+ workflow versions
  - Charts showing accuracy, latency, cost over time
  - Highlight improvements/regressions

**New Components**:
- `EvaluationLibrary.tsx` - Main page with 3 tabs
- `DatasetList.tsx` - Grid of dataset cards
- `CreateDatasetModal.tsx` - Form to create/edit datasets
- `EvaluationRunHistory.tsx` - Table of past evaluation runs
- `ComparisonView.tsx` - Charts comparing multiple workflows
- `EvaluationRunner.tsx` - UI to run evaluation (mock execution)

**Mock Data Models**:
```typescript
interface EvaluationDataset {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  tags: string[];
  createdAt: Date;
}

interface EvaluationRun {
  id: string;
  workflowId: string;
  workflowName: string;
  datasetId: string;
  results: {
    accuracy: number;      // 0-100%
    latency: number;       // milliseconds
    passedTests: number;
    totalTests: number;
  };
  timestamp: Date;
  environment: 'prototype' | 'production';
}
```

---

### Updated Navigation Structure

**App.tsx Sidebar**:
```
├─ 🏠 Dashboard (existing)
├─ 🧪 Prototype Station (enhanced WorkflowCanvas)
├─ 🚀 Production (new - mock production UI)
├─ 📊 Evaluations (new - evaluation library)
├─ 📁 Evidence Browser (existing)
├─ ✅ Approvals (existing)
└─ 📋 Regulatory Mapping (existing)
```

**Routes**:
- `/` → Dashboard
- `/prototype` → PrototypeStation
- `/production` → ProductionEnvironment
- `/evaluations` → EvaluationLibrary
- `/evidence` → EvidenceBrowser
- `/approvals` → ApprovalWorkflows
- `/regulatory` → RegulatoryMapping

---

### Implementation Phases

#### Phase 1: Navigation & Structure (4 hours)
- [ ] Update App.tsx sidebar with new nav items
- [ ] Add environment indicator badge at top
- [ ] Create placeholder pages
- [ ] Add route configuration

#### Phase 2: Enhance Prototype Station (8 hours)
- [ ] Create PrototypeToolbar with Save/Load/Run/Clear
- [ ] Implement localStorage save/load
- [ ] Create 3 pre-built workflow templates
- [ ] Build ExecutionPanel with mock execution simulation
- [ ] Add export workflow JSON functionality

#### Phase 3: Build Evaluation Library (10 hours)

**Updated Design: Contextual Evaluations (not standalone page)**

**Implementation:**
- Evaluations accessed via toolbar button (not separate tab)
- Slide-in drawer from right (600px width - medium)
- Available on Prototype and Production pages
- Always visible in toolbar
- Canvas stays fully visible when drawer open

**Drawer Tabs:**
1. **Datasets** - List of test datasets
2. **Run Evaluation** - Main action tab
   - Auto-populated workflow from current page
   - Select dataset dropdown
   - Environment auto-detected
   - Quick actions: "Quick Test", "Last Run", "Save as Template"
3. **Recent Runs** - History filtered to current workflow
4. **Compare** - Side-by-side workflow comparison

**Components to Create:**
- `EvaluationsButton.tsx` - Toolbar button
- `EvaluationsDrawer.tsx` - 600px wide slide-in drawer
- `DatasetsTab.tsx` - Tab 1
- `RunEvaluationTab.tsx` - Tab 2 with quick actions
- `RecentRunsTab.tsx` - Tab 3
- `CompareTab.tsx` - Tab 4

**Props:**
```typescript
<EvaluationsDrawer
  open={boolean}
  onClose={() => void}
  environment="prototype" | "production"  // Auto-detected
  workflowId={string}                      // Current workflow
  workflowName={string}
/>
```

---

#### Phase 3 Original: Build Evaluation Library (10 hours)
- [ ] Create EvaluationLibrary page with 3 tabs
- [ ] Build Datasets tab with create/edit functionality
- [ ] Build Evaluation Runs tab with history table
- [ ] Build Comparisons tab with charts (Recharts)
- [ ] Implement localStorage persistence

#### Phase 4: Build Production Environment (8 hours)
- [ ] Create ProductionEnvironment page
- [ ] Add mock authentication banner
- [ ] Build DeployedWorkflowList with status cards
- [ ] Add deployment flow from Prototype
- [ ] Create execution timeline visualization

#### Phase 5: Integration & Polish (6 hours)
- [ ] Connect "Deploy to Production" from Prototype
- [ ] Link evaluation runs to workflows
- [ ] Add workflow versioning (v1, v2, v3)
- [ ] Update Zustand store for shared state
- [ ] Polish UI, add loading states, toasts

**Total Time Estimate**: ~36 hours (~5 days)

---

### Design Principles for Demo
1. **Mock Everything** - No real API calls, all simulated with delays
2. **Visual Only** - Show what it would look like in production
3. **LocalStorage** - Persist all data locally in browser
4. **Reuse Existing** - Build on current WorkflowCanvas foundation
5. **Fast to Build** - Target 5 days for working demo

---

### Success Criteria
- [x] Can build workflows in Prototype Station
- [x] Can save/load workflows from localStorage
- [x] Can run simulated execution with mock results
- [ ] Can "deploy" workflow to Production Environment
- [ ] Can view deployed workflows with mock metrics
- [ ] Can create evaluation datasets
- [ ] Can run evaluations and see mock results
- [ ] Can compare workflow versions with charts
- [ ] All 3 environments connected and functional
- [ ] Clean, professional UI matching existing design

---

## 📋 CURRENT PHASE STATUS

### Completed Phases
✅ **Phase 1: Navigation & Structure** (Completed)
- Created PrototypeStation and ProductionEnvironment pages
- Updated navigation tabs with icons
- Added environment badge to AppBar
- All routing working correctly

✅ **Phase 2: Prototype Station Enhancement** (Completed)
- Created PrototypeToolbar with Save/Load/Run/Clear/Export
- Implemented localStorage persistence
- Built 3 workflow templates (Claims Detection, Vendor Risk, Policy Checker)
- Created ExecutionPanel with mock execution simulation
- Added toast notifications and confirmation dialogs

✅ **Phase 3: Evaluation Library** (Completed)
- Created EvaluationsButton component (toolbar integration)
- Created EvaluationsDrawer (600px slide-in from right)
- Built DatasetsTab with mock datasets and create dialog
- Built RunEvaluationTab with quick actions (Quick Test, Repeat Last, Save Template)
- Built RecentRunsTab with evaluation history table
- Built CompareTab with Recharts (accuracy + latency charts)
- Integrated into both Prototype and Production pages
- Auto-detects environment and passes workflow context

### Active Phase
🔄 **Phase 4: Production Environment** (Ready to start)
- Build deployed workflow list with status cards
- Add deployment flow from Prototype
- Create execution timeline visualization
- Mock workflow metrics and monitoring

### Remaining Phases
⏳ **Phase 5: Integration & Polish** (Pending)

### Current Session Context
- **Last Action**: Phase 3 complete + implementing template workflow functionality
- **Context Utilization**: 66% (132K/200K tokens) - COMPACTED
- **In Progress**:
  - Making workflow template cards functional (Claims Detection, Vendor Risk, Access Review, Policy Violation, Evidence Collection)
  - Adding explanatory text to evaluation methods
  - Will add component palette tooltips next
- **Known Issues**:
  - State persistence needed (clicking outside canvas loses work)
  - Evaluation methods need clearer explanations
  - Component palette needs use-case descriptions
- **Components Created (Phase 3)**:
  - EvaluationsButton, EvaluationsDrawer, DatasetsTab, RunEvaluationTab, RecentRunsTab, CompareTab
  - Dynamic workflow comparison with real-time chart updates
  - Dataset view modal with sample test cases
  - Renamed datasets: GDPR Regulation, SP Communication, Financial Fraud Detection
- **Templates Research Complete**:
  - Claims Detection: Webhook→Parser→AI Fraud Check→Policy Validator→Decision→Approve/Flag→Notification
  - Vendor Risk: Schedule→Fetch Vendors→Parallel(Security Scan + Compliance Check + Financial Review)→Risk Scorer→Decision→Jira
  - Access Review: Schedule→Fetch Users→Loop→Policy Matcher→Decision→Manager Alert
  - Policy Violation: Event Trigger→Document Scanner→Policy Engine→Decision→Audit Log→Alert
  - Evidence Collection: Manual Trigger→Validator→Storage→Audit Log
