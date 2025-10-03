# Compliance Workflow Platform

## Project Overview
A compliance-focused workflow automation platform with visual workflow canvas, evidence management, approval workflows, and regulatory mapping.

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
