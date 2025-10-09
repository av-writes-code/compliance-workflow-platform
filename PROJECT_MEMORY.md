# Compliance Workflow Platform - Project Memory

## Core Product Vision

### AI-Powered Conversational Workflow Interface
**Primary Feature**: Users interact with deployed workflows through a natural language chat interface

**User Flow**:
1. User navigates to chat section in Production environment
2. User asks questions about their use case (e.g., "What happened with claim #12345?", "Why was transaction X flagged?")
3. AI agent queries the backend execution history, workflow state, and data artifacts
4. AI responds with contextual answers citing specific sources:
   - Which workflow nodes executed
   - What decisions were made
   - Input/output data at each step
   - Compliance checks that passed/failed
   - Timestamps and execution metadata

**Advanced Capabilities**:
- **Scheduled Jobs**: Users can schedule workflows via chat ("Run fraud detection on tonight's transactions at 2 AM")
- **Artifact Delivery**: Responses include adjoining artifacts (PDFs, CSVs, reports, visualizations)
- **Source Attribution**: All answers cite data sources, node outputs, and execution logs
- **Proactive Insights**: Agent can surface anomalies, trends, or issues from workflow executions

**Technical Requirements**:
- Backend integration with workflow execution engine
- Query interface to execution history/logs database
- LLM integration (Claude/GPT) for natural language understanding
- Vector search for semantic retrieval of execution data
- Authentication/authorization for data access

---

## Product Phases

### Phase 1: Foundation (COMPLETED)
- Drag-and-drop workflow builder
- Basic node types (Standard, Decision, Circular, Ghost)
- React Flow canvas with node connections
- Component palette

### Phase 2: Workflow Templates (COMPLETED)
- Predefined workflow templates
- Template selection and loading
- Workflow cards UI

### Phase 3: Evaluation Library (COMPLETED)
- Test case management
- Evaluation metrics (Precision, Recall, F1, Accuracy)
- LLM-as-a-Judge configuration
- Dataset integration
- Evaluation drawer UI

### Phase 4: Production Environment (IN PROGRESS)
**Completed**:
- Read-only WorkflowCanvas reuse
- ExecutionControlBar with Run/Pause/Stop
- DeployedWorkflowCard component
- Mock workflow visualization

**Next Steps**:
- Add workflow selector sidebar with DeployedWorkflowCards
- Add node execution status overlays (running/completed/failed states)
- Add execution timeline panel
- Add data input form for workflow execution
- Add execution results display panel
- Add real-time metrics dashboard

### Phase 5: AI Chat Interface (FUTURE)
- Natural language query interface
- Backend execution history API
- LLM-powered response generation with source attribution
- Scheduled job management via chat
- Artifact attachment and delivery
- Conversational workflow execution

---

## Known Issues & Improvements Needed

### Production Environment UI (Current)
1. Missing workflow selector - No DeployedWorkflowCard list
2. No node execution status visualization
3. Control bar could be docked to top edge
4. Missing execution timeline/history
5. No data input mechanism before execution
6. No output/results display
7. Edge styling should better indicate read-only state
8. Missing real-time metrics panel during execution
9. Pause/Stop buttons too small (IconButton vs Button)
10. No breadcrumb showing workflow version context

---

## Technical Architecture

### Frontend Stack
- React 19 + TypeScript
- Vite 7 (build tool)
- Material-UI v7 (components)
- React Flow v11 (workflow canvas)
- Zustand (state management - if needed)

### Backend (Planned)
- Node.js/Python API server
- Workflow execution engine
- PostgreSQL (execution logs, workflow state)
- Vector database (Pinecone/Weaviate for semantic search)
- LLM API integration (Anthropic Claude/OpenAI GPT)

### Key Components
- **WorkflowCanvas**: Main canvas component (shared between Prototype/Production)
- **ExecutionControlBar**: Execution controls overlay
- **EvaluationsDrawer**: Evaluation metrics and test cases
- **DeployedWorkflowCard**: Deployed workflow selector
- **EditableEdge**: Custom edge with draggable reshaping and reconnection
- **CustomNode**: Node type variants (Standard, Decision, Circular, Ghost)

---

## Design Principles
- Dark theme (#0f0f1e background, indigo accents)
- Role-based access (Data Scientist, Compliance Officer roles)
- n8n-inspired workflow visualization
- LangSmith-inspired evaluation UI
- Conversational AI-first for production usage
