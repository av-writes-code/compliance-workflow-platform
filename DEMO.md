# 🎬 Compliance Workflow Platform - Complete Demo Implementation Guide

**⚠️ IMPORTANT: This is the SINGLE SOURCE OF TRUTH for demo implementation**

All test requirements, implementation steps, and audit protocols are in this file.
Use Table of Contents with line offsets to navigate to specific sections.

---

## 📑 TABLE OF CONTENTS (Navigation by Line Number)

1. **Demo Script** ........................... Lines 30-250
   - Cold Open, ACT 1-4 narration
2. **Granular Test Requirements** ............ Lines 252-900
   - Test-driven approach, exact assertions per phase
3. **Pre-Phase Audit Protocol** .............. Lines 902-1100
   - Mandatory checklists before each phase
4. **Implementation Phases** ................. Lines 1102-2100
   - Phase 0: Test Infrastructure
   - Phase 1: Chatbot P0 Enhancement
   - Phase 2: Evaluation Engine
   - Phase 3: demoDataStore Foundation
   - Phase 4: Deployment Flow
   - Phase 5: Production Integration
   - Phase 6: App Initialization
   - Phase 7: Unit Tests
   - Phase 8: E2E Tests
5. **E2E Test Specifications** .............. Lines 2102-2350
6. **Testing Strategy & Timeline** .......... Lines 2352-2450
7. **Success Criteria** ..................... Lines 2452-2500

**USAGE**: Use Read tool with offset/limit to load only relevant section.
Example: `Read DEMO.md offset=1102 limit=200` (loads only Phase 1)

---

# SECTION 1: DEMO SCRIPT

## Overview
End-to-end demo: Non-Tech User (Prototype) → Evaluations → Production Deployment

**Duration**: ~13 minutes
**Audience**: Technical & Non-Technical stakeholders
**Goal**: Show workflow creation, evaluation, and production deployment
**Version**: Enhanced with P0 Chatbot improvements + Granular Testing

---

## **COLD OPEN** (30 seconds)

**[Screen shows Production Environment with "Claims Detection v1.0.0" running]**

**Narrator**: "This is our production workflow for claims detection. It's been running for 6 months with **87% accuracy**. But we're seeing too many false positives costing us manual review time."

**[Camera zooms to workflow: Webhook → Parser → AI Agent → Decision]**

**Narrator**: "Notice there's no validation layer between the AI and the final decision. Let's fix that in under 10 minutes."

**[Screen transitions to Prototype Station]**

---

## **ACT 1: Discovery & Smart Workflow Selection** (3 mins)

### **SCRIPT:**

**[Open browser, navigate to http://localhost:5173/prototype]**

**Narrator**: "I'm a compliance analyst, not a developer. Let me ask the AI assistant for help..."

**[Screen shows: Empty Prototype canvas with toolbar at top, component palette on left]**

**Action 1**: Click chatbot icon (bottom right)

**Chatbot**: "Hi! I'm your compliance workflow assistant. I can help you discover workflows, understand components, and build automations. What would you like to do?"

**User types**: "I need to improve our claims detection workflow - it has too many false positives. What can help?"

**Chatbot Response** (Enhanced):
```
I can help! False positives often happen when decisions lack validation.
The **Claims Detection** workflow is perfect for this:

📊 Workflow Details:
  • 8 nodes (webhook, parser, AI agent, policy checker, decision, actions)
  • Integrations: OpenAI Chat Model, Postgres Memory
  • Current performance: 87% accuracy, 2.1s avg runtime
  • Status: Active in production (v1.0.0)

This template includes fraud detection and policy validation layers.

[Tell me more] [Load this template]
```

**Narrator**: "Perfect! Let me load it."

**Action 2**: Click "Load this template" button

**[Canvas auto-populates with 8 nodes from template]**

**[Chatbot auto-responds]**: "✓ Loaded Claims Detection template! The canvas now shows all 8 nodes. You can customize any node by clicking it, or ask me to add components."

**Narrator**: "Great! Now I want to add a validation step..."

**User types**: "How do I add a validation step before the decision node?"

**Chatbot Response** (Enhanced):
```
Great idea! You can use a **Critic Agent** to validate AI outputs.

🤖 Critic Agent:
  • Purpose: Evaluates and critiques AI-generated content
  • Use case: Quality assurance, compliance checking
  • Configuration: Define validation criteria and confidence thresholds

📍 How to add it:
  1. Drag 'Critic Agent' from Components palette (left side)
  2. Drop between 'AI Agent' and 'Decision' nodes
  3. Connect: AI Agent → Critic Agent → Decision

[Show me Critic Agent in palette]
```

**Action 3**: Drag "Critic Agent" from Component Palette → Drop between nodes → Connect edges

**[Chatbot auto-responds]**: "✓ Nice! Critic Agent added. This will validate AI outputs before they reach the decision node."

**Action 4**: Click "Save" button

**[Snackbar]: "Workflow saved as 'Claims Detection v2 (Draft)'"**

---

## **ACT 2: Evaluation with Baseline Comparison** (4 mins)

**Narrator**: "Before deploying, I need to prove this works better. Let me run an evaluation..."

**Action 1**: Click "Evaluations" button

**Action 2**: Select "Financial Fraud Detection (52 cases)" dataset

**Action 3**: Click "Built-in Evals" card

**Action 4**: Click "Quick Test" button

**[Progress bar animates for 3 seconds with live test case names scrolling]:**
```
Testing case 1/10: Large $10K transfer... ✓
Testing case 2/10: Twenty small payments... ✓
...
```

**[After 3s - Snackbar with celebration animation]**: "🎉 94% accuracy - outperforms baseline by 7%!"

**Narrator**: "Excellent! Let's check detailed results..."

**Action 5**: Click "Recent Runs" tab

**[Table shows 2 rows]:**
```
Run #1 (v2.0 New)     | 94% | 49/52 passed | just now     | ✓ SUCCESS
Run #2 (v1.0 Baseline)| 87% | 45/52 passed | 2 hours ago  | ⚠ WARNING
```

**Narrator**: "Clear improvement. The Critic Agent reduced false positives significantly. Time to deploy."

---

## **ACT 3: Deploy to Production** (2 mins)

**Action 1**: Click "Deploy to Production" button

**[DeploymentDialog opens]:**
```
Deploy to Production

Workflow Details:
  Name: Claims Detection v2
  Version: 2.0.0

Pre-Deployment Checklist:
  ✓ Evaluations passed (94% accuracy)
  ✓ All nodes validated
  ✓ Connections verified

[Cancel] [Deploy 🚀]
```

**Action 2**: Click "Deploy to Production"

**[Deploy animation, success snackbar, auto-navigate to /production]**

---

## **ACT 4: Production Execution** (3 mins)

**[Production page loads with "Claims Detection v2.0.0" selected]**

**Narrator**: "Now as a developer, let me execute this..."

**[Canvas shows custom workflow WITH Critic Agent]**

**Action 1**: Click "Run" button

**Action 2**: Enter claim data → Click "Run Workflow"

**[ExecutionTimeline shows all 9 nodes executing]**

**Action 3**: Click "Critic Agent" node

**[NodeInspector shows LLM metrics, validation results]**

**Narrator**: "Perfect! The validation layer is working. Demo complete."

---

# SECTION 2: GRANULAR TEST REQUIREMENTS

## Test-Driven Implementation Approach

**CRITICAL**: Before writing ANY code, read the test requirements for that phase.
Each implementation step below shows the EXACT test assertion it must satisfy.

---

## Test Requirements Overview

| Phase | Test File | Assertions | What It Validates |
|-------|-----------|------------|-------------------|
| Phase 1: Chatbot | `chatbot-interactions.spec.ts` | 35+ | Workflow metadata, template loading, auto-responses |
| Phase 2: Evaluation | `evaluation-execution.spec.ts` | 25+ | Progress timing, accuracy calc, baseline comparison |
| Phase 3: Data Store | `demoDataStore.test.ts` (unit) | 15+ | localStorage CRUD, sanitization, error handling |
| Phase 4: Deployment | `deployment-flow.spec.ts` | 20+ | Dialog pre-fill, race condition prevention |
| Phase 5: Production | `production-execution.spec.ts` | 15+ | Workflow selection, canvas render |

---

## Phase 1 Test Requirements: Chatbot Enhancement

### Test File: `e2e/granular/chatbot-interactions.spec.ts`

**Test 1.1: Chatbot FAB Button Initial State** (Lines 10-30)
```typescript
test('Chatbot: FAB button renders with correct styles', async ({ page }) => {
  await page.goto('/prototype');

  const fab = page.locator('button[aria-label="Open chat assistant"]');
  await expect(fab).toBeVisible();
  await expect(fab).toHaveCSS('width', '60px');
  await expect(fab).toHaveCSS('bottom', '24px');
  await expect(fab).toHaveCSS('right', '24px');
  await expect(fab).toHaveCSS('z-index', '1400');
});
```

**Implementation Requirement**:
- ChatbotWidget FAB must have aria-label="Open chat assistant"
- CSS: width 60px, bottom 24px, right 24px, z-index 1400

---

**Test 1.2: Workflow Discovery Response** (Lines 120-145)
```typescript
test('Chatbot: Returns workflow metadata on discovery query', async ({ page }) => {
  await page.goto('/prototype');
  await page.click('button[aria-label="Open chat assistant"]');

  const input = page.locator('input[placeholder="Type your message..."]');
  await input.fill('improve claims detection with false positives');
  await input.press('Enter');

  await page.waitForTimeout(1600); // AI response delay

  const aiMsg = page.locator('[data-message-role="assistant"]').last();

  // CRITICAL ASSERTIONS - Implementation MUST provide these:
  await expect(aiMsg).toContainText('8 nodes'); // ← Must show node count
  await expect(aiMsg).toContainText('OpenAI Chat Model'); // ← Must show integrations
  await expect(aiMsg).toContainText('87%'); // ← Must show baseline accuracy
  await expect(aiMsg).toContainText('accuracy');

  const loadBtn = page.locator('button:has-text("Load this template")');
  await expect(loadBtn).toBeVisible(); // ← Quick action must exist
  await expect(loadBtn).toBeEnabled();
});
```

**Implementation Requirements**:
1. **workflowTemplates.ts MUST have metadata**:
   ```typescript
   metadata: {
     nodeCount: 8,
     integrations: ['OpenAI Chat Model', 'Postgres Memory'],
     baselineAccuracy: 87,
   }
   ```

2. **ChatbotWidget response MUST include**:
   - Text: "{nodeCount} nodes"
   - Text: "{integrations.join(', ')}"
   - Text: "{baselineAccuracy}% accuracy"
   - Quick action button with label "Load this template"

---

**Test 1.3: Template Load Confirmation** (Lines 200-225)
```typescript
test('Chatbot: Shows confirmation after template loads', async ({ page }) => {
  // ... (load template via quick action)

  await page.locator('button:has-text("Load this template")').click();
  await page.waitForTimeout(500);

  // Canvas should have 8 nodes
  const nodes = page.locator('.react-flow__node');
  await expect(nodes).toHaveCount(8);

  // Chatbot should auto-respond
  await page.waitForTimeout(200);
  const confirmMsg = page.locator('[data-message-role="assistant"]').last();
  await expect(confirmMsg).toContainText('✓ Loaded');
  await expect(confirmMsg).toContainText('Claims Detection');
  await expect(confirmMsg).toContainText('8 nodes');
});
```

**Implementation Requirements**:
1. **PrototypeStation.tsx MUST**:
   - Have `handleLoadTemplate` function
   - Load template nodes/edges to canvas
   - Call chatbot to add confirmation message

2. **ChatbotWidget.tsx MUST**:
   - Expose `addMessage` method via ref or callback
   - Message format: "✓ Loaded {name}! The canvas now shows all {count} nodes."

---

**Test 1.4: Component Guidance Response** (Lines 280-310)
```typescript
test('Chatbot: Provides Critic Agent guidance with steps', async ({ page }) => {
  await page.goto('/prototype');
  await page.click('button[aria-label="Open chat assistant"]');

  await page.locator('input').fill('How do I add validation step?');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1600);

  const aiMsg = page.locator('[data-message-role="assistant"]').last();

  // MUST contain component name and explanation
  await expect(aiMsg).toContainText('Critic Agent');
  await expect(aiMsg).toContainText('evaluates and critiques');

  // MUST contain numbered steps
  await expect(aiMsg).toContainText('1.');
  await expect(aiMsg).toContainText('Drag');
  await expect(aiMsg).toContainText('Component Palette');
  await expect(aiMsg).toContainText('connect');
});
```

**Implementation Requirements**:
- **ChatbotWidget response MUST include**:
  - Component name: "Critic Agent"
  - Purpose: "evaluates and critiques AI-generated content"
  - Numbered steps (1, 2, 3)
  - Mention: "Components palette", "Drag", "connect"

---

## Phase 2 Test Requirements: Evaluation Engine

### Test File: `e2e/granular/evaluation-execution.spec.ts`

**Test 2.1: Progress Bar Timing** (Lines 15-60)
```typescript
test('Evaluation: Progress animates in exactly 3 seconds', async ({ page }) => {
  // ... (setup: load template, open evaluations, select dataset)

  const startTime = Date.now();
  await page.click('button:has-text("Quick Test")');

  // Progress bar should be visible immediately
  const progressBar = page.locator('.MuiLinearProgress-root');
  await expect(progressBar).toBeVisible({ timeout: 100 });

  // Wait for completion
  await page.waitForTimeout(3200);
  const totalTime = Date.now() - startTime;

  // Total should be ~3000ms (10 steps @ 300ms)
  expect(totalTime).toBeGreaterThan(2900);
  expect(totalTime).toBeLessThan(3500);

  // Progress should complete
  await expect(progressBar).not.toBeVisible(); // Progress completes
});
```

**Implementation Requirements**:
- **RunEvaluationTab.tsx MUST**:
  - Loop exactly 10 times
  - Each iteration: await setTimeout(300ms)
  - Total time: ~3000ms
  - Show LinearProgress during execution

---

**Test 2.2: Accuracy Calculation & Baseline Comparison** (Lines 100-135)
```typescript
test('Evaluation: Shows 94% accuracy with 7% improvement', async ({ page }) => {
  // ... (run evaluation)

  // Wait for snackbar
  const snackbar = page.locator('.MuiSnackbar-root');
  await expect(snackbar).toBeVisible({ timeout: 500 });

  // CRITICAL: Must show exact improvement calculation
  await expect(snackbar).toContainText('94%'); // Current accuracy
  await expect(snackbar).toContainText('outperforms baseline by 7%'); // Improvement
  await expect(snackbar).toContainText('🎉'); // Celebration emoji

  // Check Recent Runs table
  await page.click('text=Recent Runs');
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(2); // v2.0 + v1.0 baseline

  // First row: v2.0 (most recent)
  await expect(rows.nth(0)).toContainText('94%');
  await expect(rows.nth(0)).toContainText('49/52'); // Passed tests

  // Second row: v1.0 baseline
  await expect(rows.nth(1)).toContainText('87%');
  await expect(rows.nth(1)).toContainText('45/52');
});
```

**Implementation Requirements**:
1. **evaluationEngine.ts MUST**:
   - Calculate accuracy: 94% for v2.0 (seeded random)
   - Passed tests: 49 out of 52 (94% * 52 = 49.88)

2. **RunEvaluationTab.tsx MUST**:
   - Call `getBaselineRun(datasetName)` to get v1.0 results
   - Calculate improvement: `currentAccuracy - baselineAccuracy`
   - Show snackbar: "🎉 {accuracy}% - outperforms baseline by {improvement}%!"
   - Save result via `addEvaluationRun(newRun)`

3. **RecentRunsTab.tsx MUST**:
   - Load from `getEvaluationRuns()` (not hard-coded array)
   - Display runs sorted by timestamp (newest first)

---

**Test 2.3: Deterministic Results** (Lines 180-210)
```typescript
test('Evaluation: Running twice produces identical 94% result', async ({ page }) => {
  // Run evaluation first time
  await page.click('button:has-text("Quick Test")');
  await page.waitForTimeout(3500);

  const snackbar1 = await page.locator('.MuiSnackbar-root').textContent();
  expect(snackbar1).toContain('94%');

  // Close snackbar
  await page.click('.MuiSnackbar-root button[aria-label="close"]');

  // Run evaluation second time (same dataset, same workflow)
  await page.click('button:has-text("Quick Test")');
  await page.waitForTimeout(3500);

  const snackbar2 = await page.locator('.MuiSnackbar-root').textContent();

  // Results MUST be identical (seeded random)
  expect(snackbar2).toContain('94%');
  expect(snackbar1).toBe(snackbar2); // Exact match
});
```

**Implementation Requirements**:
- **evaluationEngine.ts MUST use seeded pseudo-random**:
  ```typescript
  import seedrandom from 'seedrandom';

  const seed = `${workflowId}-${datasetId}`;
  const rng = seedrandom(seed);

  // Use rng() instead of Math.random()
  const accuracy = 0.94 + (rng() - 0.5) * 0.02; // 94% ± 1%
  ```

---

## Phase 3 Test Requirements: demoDataStore (Unit Tests)

### Test File: `src/utils/__tests__/demoDataStore.test.ts`

**Test 3.1: Initialize Seed Data** (Lines 10-25)
```typescript
test('initializeDemoData: Seeds baseline workflow on first load', () => {
  localStorage.clear();

  initializeDemoData();

  const workflows = getDeployedWorkflows();
  expect(workflows).toHaveLength(1);
  expect(workflows[0].name).toBe('Claims Detection v1.0.0');
  expect(workflows[0].version).toBe('1.0.0');
  expect(workflows[0].successRate).toBe(87.3);
});
```

**Implementation Requirements**:
- `initializeDemoData()` must check if localStorage is empty
- If empty, write SEED_DEPLOYED_WORKFLOWS and SEED_EVALUATION_RUNS
- Baseline workflow: "Claims Detection v1.0.0", 87.3% success rate

---

**Test 3.2: Add Deployed Workflow** (Lines 40-60)
```typescript
test('addDeployedWorkflow: Adds to beginning of array', () => {
  const newWorkflow: DeployedWorkflow = {
    id: 'workflow-v2',
    name: 'Claims Detection v2.0.0',
    version: '2.0.0',
    // ... other fields
  };

  addDeployedWorkflow(newWorkflow);

  const workflows = getDeployedWorkflows();
  expect(workflows[0].id).toBe('workflow-v2'); // Should be first (newest)
  expect(workflows).toHaveLength(2); // v2.0 + v1.0 baseline
});
```

**Implementation Requirements**:
- `addDeployedWorkflow()` must use `unshift()` (not push)
- Newest workflows appear first in array

---

**Test 3.3: Baseline Comparison** (Lines 80-100)
```typescript
test('getBaselineRun: Returns v1.0 run for dataset', () => {
  const baseline = getBaselineRun('Financial Fraud Detection');

  expect(baseline).not.toBeNull();
  expect(baseline?.workflowName).toContain('v1.0');
  expect(baseline?.accuracy).toBe(87);
  expect(baseline?.datasetName).toBe('Financial Fraud Detection');
});
```

**Implementation Requirements**:
- `getBaselineRun()` must find first run where:
  - `workflowName` contains "v1.0"
  - `datasetName` matches parameter

---

**Test 3.4: Error Handling** (Lines 120-140)
```typescript
test('getDeployedWorkflows: Handles corrupted localStorage', () => {
  localStorage.setItem('demo-deployed-workflows', 'invalid json{');

  const workflows = getDeployedWorkflows();

  // Should return empty array or seed data, not crash
  expect(workflows).toBeDefined();
  expect(Array.isArray(workflows)).toBe(true);
});
```

**Implementation Requirements**:
- All `JSON.parse()` calls MUST be wrapped in try-catch
- On error, return fallback data (seed data or empty array)

---

## Phase 4 Test Requirements: Deployment Flow

### Test File: `e2e/granular/deployment-flow.spec.ts`

**Test 4.1: Dialog Pre-fill** (Lines 15-50)
```typescript
test('Deployment: Dialog pre-fills name and version', async ({ page }) => {
  // ... (load workflow)

  await page.click('button:has-text("Deploy to Production")');
  await page.waitForTimeout(300);

  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();

  // Name should be pre-filled
  const nameInput = dialog.locator('input[name="workflow-name"]');
  await expect(nameInput).toHaveValue('Claims Detection v2');

  // Version should suggest 2.0.0
  const versionInput = dialog.locator('input[name="version"]');
  await expect(versionInput).toHaveValue('2.0.0');

  // 3 checkmarks visible
  const checkmarks = dialog.locator('[data-checklist-item]');
  await expect(checkmarks).toHaveCount(3);
  await expect(checkmarks.nth(0)).toContainText('Evals passed');
});
```

**Implementation Requirements**:
- **DeploymentDialog.tsx MUST**:
  - Accept `workflowName` prop
  - Pre-fill name input with prop value
  - Default version to "2.0.0"
  - Show 3 checklist items with green checkmarks
  - Each checklist item needs `data-checklist-item` attribute

---

**Test 4.2: Race Condition Prevention** (Lines 80-115)
```typescript
test('Deployment: localStorage written before navigation', async ({ page }) => {
  // ... (open deployment dialog)

  const startTime = Date.now();
  await page.click('button:has-text("Deploy")');

  // Wait 50ms (less than 100ms buffer)
  await page.waitForTimeout(50);

  // Check localStorage immediately
  const storageData = await page.evaluate(() => {
    const data = localStorage.getItem('demo-deployed-workflows');
    return data ? JSON.parse(data) : [];
  });

  // CRITICAL: Should be written within 50ms
  expect(storageData).toHaveLength(2); // v2.0 + v1.0
  expect(storageData[0].name).toContain('Claims Detection v2');

  // Wait for navigation
  await page.waitForURL('/production', { timeout: 2000 });
  const navTime = Date.now() - startTime;

  // Navigation should happen after ~100ms delay
  expect(navTime).toBeGreaterThan(100);
  expect(navTime).toBeLessThan(500);
});
```

**Implementation Requirements**:
- **handleDeploy MUST**:
  ```typescript
  const handleDeploy = async (name: string, version: string) => {
    // 1. Write to localStorage (synchronous)
    addDeployedWorkflow(newWorkflow);

    // 2. Wait 100ms for flush
    await new Promise(resolve => setTimeout(resolve, 100));

    // 3. Navigate
    navigate('/production');
  };
  ```

---

## Phase 5 Test Requirements: Production Integration

### Test File: `e2e/granular/production-execution.spec.ts`

**Test 5.1: Auto-select Deployed Workflow** (Lines 10-35)
```typescript
test('Production: v2.0.0 selected by default after deployment', async ({ page }) => {
  // ... (deploy workflow from prototype)

  // Should auto-navigate to /production
  await expect(page).toHaveURL('/production');

  // Dropdown should have v2.0.0 selected
  const dropdown = page.locator('[aria-label="Select workflow"]');
  await expect(dropdown).toContainText('Claims Detection v2.0.0');

  // Canvas should render 9 nodes (8 + Critic)
  const nodes = page.locator('.react-flow__node');
  await expect(nodes).toHaveCount(9);

  // Verify Critic Agent present
  const criticNode = page.locator('.react-flow__node:has-text("Critic Agent")');
  await expect(criticNode).toBeVisible();
});
```

**Implementation Requirements**:
- **ProductionEnvironment.tsx MUST**:
  - Load workflows from `getDeployedWorkflows()` in useEffect
  - Auto-select first workflow (most recent) by default
  - Render workflow nodes/edges to canvas

---

## Working Backwards: Dependency Graph

```
Test Requirements (217 assertions)
    ↓
    ├─ Test 1.2: Chatbot workflow metadata
    │   ↓
    │   ├─ workflowTemplates.ts: Add metadata { nodeCount, integrations, baselineAccuracy }
    │   └─ ChatbotWidget.tsx: Query metadata, format response with stats
    │
    ├─ Test 1.3: Template load confirmation
    │   ↓
    │   ├─ ChatbotWidget.tsx: Expose addMessage method
    │   ├─ PrototypeStation.tsx: Call chatbot.addMessage after load
    │   └─ PrototypeStation.tsx: handleLoadTemplate function
    │
    ├─ Test 2.2: Evaluation accuracy
    │   ↓
    │   ├─ evaluationEngine.ts: Seeded random for deterministic results
    │   ├─ demoDataStore.ts: getBaselineRun function
    │   └─ RunEvaluationTab.tsx: Calculate improvement, show snackbar
    │
    ├─ Test 4.2: Race condition prevention
    │   ↓
    │   ├─ demoDataStore.ts: Synchronous addDeployedWorkflow
    │   └─ DeploymentDialog.tsx: 100ms delay before navigate
    │
    └─ Test 5.1: Auto-select workflow
        ↓
        └─ ProductionEnvironment.tsx: Load from localStorage, select first
```

---

# SECTION 3: PRE-PHASE AUDIT PROTOCOL

## Mandatory Audit Before Each Phase

**⚠️ CRITICAL**: This audit MUST run before starting any phase. DO NOT skip.

---

## Automated Checks (5 minutes)

### 1. TypeScript Compilation
```bash
npx tsc --noEmit
```
**Expected**: 0 errors
**Action if fails**: Fix all type errors before proceeding

### 2. ESLint
```bash
npx eslint src/ --ext .ts,.tsx --max-warnings 0
```
**Expected**: 0 warnings
**Action if fails**: Fix linting issues

### 3. Anti-Pattern Detection

**Pattern Check 1: localStorage without try-catch**
```bash
grep -r "localStorage\." src/ --include="*.ts" -B 2 | grep -v "try"
```
**Expected**: 0 results
**Action if fails**: Wrap all localStorage calls in try-catch

**Pattern Check 2: JSON.parse without error handling**
```bash
grep -r "JSON\.parse" src/ --include="*.ts" -B 1 | grep -v "try"
```
**Expected**: 0 results
**Action if fails**: Add try-catch around JSON.parse

**Pattern Check 3: useEffect without stable deps**
```bash
grep -r "useEffect.*\[.*workflow.*\]" src/ --include="*.tsx"
```
**Expected**: Each occurrence should have `useMemo` or `workflow.id`
**Action if manual review**: Check dependencies aren't objects

---

## Manual Audit Checklist (10 minutes)

### Before Phase N:

- [ ] **Git Checkpoint**: Current state committed
  ```bash
  git add .
  git commit -m "checkpoint before Phase N"
  git tag phase-N-start
  ```

- [ ] **Review Test Requirements**: Read Section 2 for Phase N test assertions

- [ ] **Check Dependencies**: All previous phases completed successfully

- [ ] **localStorage State**: Clear and re-seed if testing from scratch
  ```javascript
  localStorage.clear();
  initializeDemoData();
  ```

### After Each File Modification:

- [ ] **TypeScript Check**: `npx tsc --noEmit` passes
- [ ] **Browser Test**: Manually verify change in browser
- [ ] **Console Check**: No errors in browser console
- [ ] **Git Commit**:
  ```bash
  git add <file>
  git commit -m "feat: <change description>"
  ```

### After Phase N Complete:

- [ ] **All Phase Tests Pass**: Run relevant E2E tests (human)
- [ ] **Manual Demo**: Walk through affected demo steps
- [ ] **Performance Check**: No lag, animations smooth
- [ ] **Git Tag**:
  ```bash
  git tag phase-N-complete
  git push --tags
  ```

- [ ] **🔴 BLOCKER CHECK**: If ANY item fails, STOP and fix before Phase N+1

---

## Critical Risks Review (5 minutes)

Before EACH phase, review these 5 risks:

### Risk 1: localStorage Race Conditions
- [ ] All `addDeployedWorkflow()` calls followed by 100ms delay?
- [ ] All navigation after deploy uses `await setTimeout(100)`?

### Risk 2: React Flow Node Mutations
- [ ] No new callbacks created in useMemo?
- [ ] All callbacks use stable Map-based references?

### Risk 3: JSON Circular References
- [ ] All node/edge storage uses sanitization?
- [ ] Sanitization removes callback functions?

### Risk 4: Stale Chatbot State
- [ ] Chatbot responses use latest workflow data?
- [ ] No hardcoded stats in responses?

### Risk 5: Evaluation Randomness
- [ ] Evaluation uses seeded random (seedrandom package)?
- [ ] Same seed produces same 94% result?

---

## Audit Failure Protocol

If audit fails:

1. **STOP**: Do not proceed to implementation
2. **Document**: Note which check failed and why
3. **Fix**: Address the issue
4. **Re-run**: Complete audit again
5. **Proceed**: Only after ALL checks pass

---

# SECTION 4: IMPLEMENTATION PHASES

## Phase 0: Test Infrastructure Setup (~1 hour)

### Goal
Install and configure Vitest + Playwright for testing

### Pre-Phase Audit
- [ ] Git checkpoint: `git commit -m "checkpoint before test infrastructure"`
- [ ] No uncommitted changes: `git status` clean
- [ ] package.json readable

### Test Requirements
None (this phase enables future tests)

### Implementation Steps

**Step 0.1**: Install Vitest and testing libraries
```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event seedrandom @types/seedrandom
```

**Step 0.2**: Create vitest.config.ts
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setup.ts',
  },
});
```

**Step 0.3**: Create test setup
```typescript
// src/test-utils/setup.ts
import '@testing-library/jest-dom';
```

**Step 0.4**: Install Playwright
```bash
npm init playwright@latest
```
Accept defaults:
- TypeScript
- tests folder: `e2e`
- Add GitHub Actions: No

**Step 0.5**: Update package.json scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Post-Phase Verification
- [ ] `npm test` runs (no tests yet, should pass)
- [ ] `npm run test:e2e` runs (no tests yet)
- [ ] vitest.config.ts has no TypeScript errors
- [ ] Git commit: `git commit -m "feat: add test infrastructure"`

---

## Phase 1: Chatbot P0 Enhancement (~2 hours)

### Goal
Enable chatbot to show workflow metadata and load templates

### Pre-Phase Audit
- [ ] Phase 0 complete
- [ ] Read test requirements: Section 2 - Phase 1 (lines 252-450)
- [ ] Run `npx tsc --noEmit` - 0 errors
- [ ] Git checkpoint: `git tag phase-1-start`

### Test Requirements Summary
- Test 1.1: FAB button with aria-label
- Test 1.2: Response shows "8 nodes", "OpenAI Chat Model", "87%"
- Test 1.3: Confirmation message after template load
- Test 1.4: Component guidance with steps

### Implementation Steps

**Step 1.1**: Modify workflowTemplates.ts (Satisfies Test 1.2 line 126-128)

File: `src/data/workflowTemplates.ts`

**BEFORE** (read first):
```typescript
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}
```

**AFTER**:
```typescript
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];

  // ADD for Test 1.2:
  metadata: {
    nodeCount: number; // Test expects "8 nodes"
    integrations: string[]; // Test expects "OpenAI Chat Model"
    baselineAccuracy: number; // Test expects "87%"
    avgLatency: number;
    useCase: string;
  };
}

// Update claims-detection template:
export const workflowTemplates: Record<string, WorkflowTemplate> = {
  'claims-detection': {
    // ... existing fields
    metadata: {
      nodeCount: 8,
      integrations: ['OpenAI Chat Model', 'Postgres Chat Memory'],
      baselineAccuracy: 87,
      avgLatency: 450,
      useCase: 'Detect misleading compliance claims',
    },
  },
  // ... other templates with metadata
};
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] Manually verify: `workflowTemplates['claims-detection'].metadata.nodeCount === 8`

---

**Step 1.2**: Enhance ChatbotWidget generateResponse (Satisfies Test 1.2, 1.4)

File: `src/components/workflow/ChatbotWidget.tsx`

**Add import** (top of file):
```typescript
import { workflowTemplates } from '../../data/workflowTemplates';
```

**Modify generateResponse** (replace lines ~117-181):
```typescript
const generateResponse = (query: string): { content: string; quickActions?: { label: string; action: () => void }[] } => {
  const lowerQuery = query.toLowerCase();

  // Enhanced workflow discovery (Satisfies Test 1.2)
  if ((lowerQuery.includes('improve') || lowerQuery.includes('false positive')) && lowerQuery.includes('claims')) {
    const template = workflowTemplates['claims-detection'];
    return {
      content:
        `I can help! False positives often happen when decisions lack validation.\n` +
        `The **${template.name}** workflow is perfect for this:\n\n` +
        `📊 Workflow Details:\n` +
        `  • ${template.metadata.nodeCount} nodes\n` + // ← Test 1.2 line 126
        `  • Integrations: ${template.metadata.integrations.join(', ')}\n` + // ← Test 1.2 line 127
        `  • Current performance: ${template.metadata.baselineAccuracy}% accuracy\n` + // ← Test 1.2 line 128
        `  • Status: Active in production (v1.0.0)\n\n` +
        `This template includes fraud detection and policy validation layers.`,
      quickActions: [
        { label: 'Tell me more', action: () => handleQuickAction('explain-claims') },
        { label: 'Load this template', action: () => onLoadTemplate?.('claims-detection') }, // ← Test 1.2 line 135
      ],
    };
  }

  // Enhanced component guidance (Satisfies Test 1.4)
  if (lowerQuery.includes('validation') || (lowerQuery.includes('add') && lowerQuery.includes('step'))) {
    return {
      content:
        `Great idea! You can use a **Critic Agent** to validate AI outputs.\n\n` + // ← Test 1.4 line 286
        `🤖 Critic Agent:\n` +
        `  • Purpose: Evaluates and critiques AI-generated content\n` + // ← Test 1.4 line 287
        `  • Use case: Quality assurance, compliance checking\n` +
        `  • Configuration: Define validation criteria\n\n` +
        `📍 How to add it:\n` +
        `  1. Drag 'Critic Agent' from Components palette (left side)\n` + // ← Test 1.4 line 290-292
        `  2. Drop between 'AI Agent' and 'Decision' nodes\n` +
        `  3. Connect: AI Agent → Critic Agent → Decision`,
      quickActions: [
        { label: 'Show me Critic Agent in palette', action: () => onComponentInfo?.('critic-agent') },
      ],
    };
  }

  // ... keep existing responses (loop, ai agent, compliance, etc.)
};
```

---

**Step 1.3**: Add onLoadTemplate prop (Satisfies Test 1.2 line 135)

File: `src/components/workflow/ChatbotWidget.tsx`

**Modify interface** (around line 32):
```typescript
interface ChatbotWidgetProps {
  onWorkflowPreview?: (workflowId: string) => void;
  onComponentInfo?: (componentId: string) => void;
  onLoadTemplate?: (templateId: string) => void; // ← ADD
}
```

**Update component signature** (around line 37):
```typescript
export default function ChatbotWidget({
  onWorkflowPreview,
  onComponentInfo,
  onLoadTemplate, // ← ADD
}: ChatbotWidgetProps) {
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] In browser: Chatbot response shows "8 nodes", "87%", "OpenAI Chat Model"
- [ ] "Load this template" button visible

---

**Step 1.4**: Add handleLoadTemplate in PrototypeStation (Satisfies Test 1.3)

File: `src/pages/PrototypeStation.tsx`

**Add import**:
```typescript
import { workflowTemplates } from '../data/workflowTemplates';
```

**Add state for chatbot ref** (after existing useState):
```typescript
const [chatbotMessage, setChatbotMessage] = useState<string | null>(null);
```

**Add handleLoadTemplate function** (before return):
```typescript
const handleLoadTemplate = useCallback((templateId: string) => {
  const template = workflowTemplates[templateId];
  if (!template) return;

  // Load template to canvas
  setNodes(template.nodes);
  setEdges(template.edges);

  // Auto-fit canvas
  setTimeout(() => {
    // Assuming reactFlowInstance is available
    // If using useReactFlow: const { fitView } = useReactFlow();
    // fitView({ padding: 0.2 });
  }, 100);

  // Trigger chatbot confirmation (Satisfies Test 1.3)
  setChatbotMessage(
    `✓ Loaded **${template.name}**! The canvas now shows all ${template.metadata.nodeCount} nodes. ` +
    `You can customize any node by clicking it, or ask me to add components.`
  );
}, []);
```

**Update ChatbotWidget prop** (in JSX):
```typescript
<ChatbotWidget
  onWorkflowPreview={handleWorkflowPreview}
  onComponentInfo={handleComponentInfo}
  onLoadTemplate={handleLoadTemplate} // ← ADD
/>
```

---

**Step 1.5**: Enable chatbot to receive external messages (Satisfies Test 1.3 line 221)

File: `src/components/workflow/ChatbotWidget.tsx`

**Add useEffect to listen for external messages** (before return):
```typescript
// In PrototypeStation, parent can trigger messages via state
// ChatbotWidget listens and adds to conversation

// For now, simplest approach: Parent passes message via prop
interface ChatbotWidgetProps {
  // ... existing props
  externalMessage?: string | null; // ← ADD
}

export default function ChatbotWidget({
  onWorkflowPreview,
  onComponentInfo,
  onLoadTemplate,
  externalMessage, // ← ADD
}: ChatbotWidgetProps) {

  // Add useEffect to handle external messages
  useEffect(() => {
    if (externalMessage) {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: externalMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Reset to prevent re-triggering when template loaded multiple times
      setTimeout(() => setChatbotMessage(null), 100);
    }
  }, [externalMessage]);
```

**Update PrototypeStation** to pass message:
```typescript
<ChatbotWidget
  onWorkflowPreview={handleWorkflowPreview}
  onComponentInfo={handleComponentInfo}
  onLoadTemplate={handleLoadTemplate}
  externalMessage={chatbotMessage} // ← ADD
/>
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] In browser: Click "Load this template" → Canvas shows 8 nodes
- [ ] Chatbot shows "✓ Loaded Claims Detection! The canvas now shows all 8 nodes"

### Post-Phase Audit
- [ ] All Step verifications passed
- [ ] Manual demo: Chatbot workflow discovery works end-to-end
- [ ] No console errors
- [ ] Git commit: `git commit -m "feat: chatbot P0 enhancements with metadata"`
- [ ] Git tag: `git tag phase-1-complete`

---

## Phase 2: Evaluation Engine (~2 hours)

### Goal
Implement seeded evaluation calculation with baseline comparison

### Pre-Phase Audit
- [ ] Phase 1 complete
- [ ] Read test requirements: Section 2 - Phase 2 (lines 552-650)
- [ ] Run `npx tsc --noEmit` - 0 errors
- [ ] Git checkpoint: `git tag phase-2-start`

### Test Requirements Summary
- Test 2.1: Progress animates for exactly 3 seconds
- Test 2.2: Shows 94% accuracy with 7% improvement snackbar
- Test 2.3: Running twice produces identical results (deterministic)

### Implementation Steps

**Step 2.1**: Create evaluationEngine.ts (Satisfies Test 2.2, 2.3)

File: `src/utils/evaluationEngine.ts` (NEW)

```typescript
import seedrandom from 'seedrandom';

export interface EvaluationResult {
  accuracy: number; // 94
  passedTests: number; // 49
  totalTests: number; // 52
  latency: number; // 420ms
}

export function runEvaluation(
  workflowId: string,
  datasetId: string,
  testCases: any[]
): EvaluationResult {
  // Use seeded random for deterministic results (Test 2.3)
  const seed = `${workflowId}-${datasetId}`;
  const rng = seedrandom(seed);

  // v2.0 workflows with Critic Agent: 92-96% accuracy range
  const baseAccuracy = 0.94;

  // Add deterministic variance
  const variance = (rng() - 0.5) * 0.02; // ±1%
  const accuracy = Math.max(0, Math.min(1, baseAccuracy + variance));

  const passedTests = Math.round(accuracy * testCases.length);

  return {
    accuracy: Math.round(accuracy * 100), // 94 (Test 2.2 line 110)
    passedTests, // 49 (Test 2.2 line 115)
    totalTests: testCases.length,
    latency: 400 + Math.round(rng() * 100), // 400-500ms
  };
}
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] Manual test: `runEvaluation('v2', 'dataset1', new Array(52))` returns ~94%
- [ ] Call twice with same params → same result

---

**Step 2.2**: Make RunEvaluationTab functional (Satisfies Test 2.1, 2.2)

File: `src/components/workflow/RunEvaluationTab.tsx`

**Add imports**:
```typescript
import { runEvaluation } from '../../utils/evaluationEngine';
import { addEvaluationRun, getBaselineRun, EvaluationRun } from '../../utils/demoDataStore';
import { useSnackbar } from 'notistack';
```

**Add snackbar hook** (in component):
```typescript
const { enqueueSnackbar } = useSnackbar();
```

**Replace handleQuickTest** (lines ~76-87):
```typescript
const handleQuickTest = async () => {
  const dataset = datasets.find(d => d.id === selectedDataset);
  if (!dataset) return;

  setIsRunning(true);
  setProgress(0);

  // Animate progress: 10 steps @ 300ms = 3000ms (Test 2.1)
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 300));
    setProgress(i);
  }

  // Run actual evaluation
  const mockTestCases = new Array(dataset.testCases).fill({});
  const result = runEvaluation(
    workflowId || 'v2.0',
    dataset.id,
    mockTestCases
  );

  // Save result
  const newRun: EvaluationRun = {
    id: Date.now().toString(),
    workflowName: workflowName || 'Claims Detection v2.0.0',
    datasetName: dataset.name,
    accuracy: result.accuracy, // 94 (Test 2.2 line 110)
    latency: result.latency,
    passedTests: result.passedTests, // 49 (Test 2.2 line 115)
    totalTests: result.totalTests,
    timestamp: new Date().toLocaleString(),
    status: result.accuracy >= 90 ? 'success' : 'warning',
  };

  addEvaluationRun(newRun);
  setIsRunning(false);

  // Get baseline for comparison (Test 2.2 line 109)
  const baseline = getBaselineRun(dataset.name);
  if (baseline) {
    const improvement = result.accuracy - baseline.accuracy; // 7% (Test 2.2 line 111)
    enqueueSnackbar(
      `🎉 ${result.accuracy}% accuracy - outperforms baseline by ${improvement}%!`, // ← Test 2.2 line 110-111
      { variant: 'success' }
    );
  } else {
    enqueueSnackbar(
      `✅ ${result.accuracy}% accuracy (${result.passedTests}/${result.totalTests} passed)`,
      { variant: 'success' }
    );
  }
};
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` - should show errors (demoDataStore not created yet)
- [ ] Expected: Will fix in Phase 3

---

## Phase 3: demoDataStore Foundation (~2 hours)

### Goal
Create localStorage utilities with seed data

### Pre-Phase Audit
- [ ] Phase 2 attempted (has TS errors - expected)
- [ ] Read test requirements: Section 2 - Phase 3 (lines 700-800)
- [ ] Git checkpoint: `git tag phase-3-start`

### Test Requirements Summary
- Test 3.1: Initialize seed data on first load
- Test 3.2: Add workflow to beginning of array
- Test 3.3: Get baseline run by dataset name
- Test 3.4: Handle corrupted localStorage gracefully

### Implementation Steps

**Step 3.1**: Create demoDataStore.ts (Satisfies All Phase 3 Tests)

File: `src/utils/demoDataStore.ts` (NEW - ~200 lines)

```typescript
import { Node, Edge } from 'reactflow';

// Storage keys
const KEYS = {
  DEPLOYED_WORKFLOWS: 'demo-deployed-workflows',
  EVALUATION_RUNS: 'demo-evaluation-runs',
};

export interface DeployedWorkflow {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive';
  lastRun: string;
  totalRuns: number;
  successRate: number;
  avgExecutionTime: string;
  nodes: Node[];
  edges: Edge[];
}

export interface EvaluationRun {
  id: string;
  workflowName: string;
  datasetName: string;
  accuracy: number;
  latency: number;
  passedTests: number;
  totalTests: number;
  timestamp: string;
  status: 'success' | 'warning' | 'failed';
}

// Seed data - Baseline v1.0.0 workflow (without Critic Agent)
const SEED_DEPLOYED_WORKFLOWS: DeployedWorkflow[] = [
  {
    id: 'workflow-baseline',
    name: 'Claims Detection v1.0.0',
    version: '1.0.0',
    status: 'active',
    lastRun: '2 hours ago',
    totalRuns: 1284,
    successRate: 87.3, // ← Baseline: 87%
    avgExecutionTime: '2.1s',
    nodes: [], // Simplified (would have 8 nodes without Critic)
    edges: [],
  }
];

// Baseline evaluation run (Test 3.3 expects this)
const SEED_EVALUATION_RUNS: EvaluationRun[] = [
  {
    id: 'run-baseline',
    workflowName: 'Claims Detection v1.0.0', // ← Contains "v1.0" (Test 3.3)
    datasetName: 'Financial Fraud Detection',
    accuracy: 87, // ← Baseline accuracy
    latency: 450,
    passedTests: 45, // 87% of 52
    totalTests: 52,
    timestamp: '2025-10-14 12:30',
    status: 'success',
  }
];

// Initialize on first load (Test 3.1)
export const initializeDemoData = (): void => {
  if (!localStorage.getItem(KEYS.DEPLOYED_WORKFLOWS)) {
    localStorage.setItem(KEYS.DEPLOYED_WORKFLOWS, JSON.stringify(SEED_DEPLOYED_WORKFLOWS));
  }
  if (!localStorage.getItem(KEYS.EVALUATION_RUNS)) {
    localStorage.setItem(KEYS.EVALUATION_RUNS, JSON.stringify(SEED_EVALUATION_RUNS));
  }
  console.log('[DemoDataStore] Initialized seed data');
};

// CRUD - Deployed Workflows
export const getDeployedWorkflows = (): DeployedWorkflow[] => {
  try {
    const data = localStorage.getItem(KEYS.DEPLOYED_WORKFLOWS);
    return data ? JSON.parse(data) : SEED_DEPLOYED_WORKFLOWS; // ← Test 3.4: Fallback
  } catch (error) {
    console.error('[DemoDataStore] Failed to parse workflows:', error);
    return SEED_DEPLOYED_WORKFLOWS; // ← Test 3.4: Error handling
  }
};

export const addDeployedWorkflow = (workflow: DeployedWorkflow): void => {
  try {
    const workflows = getDeployedWorkflows();
    workflows.unshift(workflow); // ← Test 3.2: Add to beginning
    localStorage.setItem(KEYS.DEPLOYED_WORKFLOWS, JSON.stringify(workflows));
    console.log('[DemoDataStore] Added workflow:', workflow.name);
  } catch (error) {
    console.error('[DemoDataStore] Failed to add workflow:', error);
    throw error;
  }
};

// CRUD - Evaluation Runs
export const getEvaluationRuns = (): EvaluationRun[] => {
  try {
    const data = localStorage.getItem(KEYS.EVALUATION_RUNS);
    return data ? JSON.parse(data) : SEED_EVALUATION_RUNS;
  } catch (error) {
    console.error('[DemoDataStore] Failed to parse runs:', error);
    return SEED_EVALUATION_RUNS;
  }
};

export const addEvaluationRun = (run: EvaluationRun): void => {
  try {
    const runs = getEvaluationRuns();
    runs.unshift(run); // Add to beginning (newest first)
    localStorage.setItem(KEYS.EVALUATION_RUNS, JSON.stringify(runs));
    console.log('[DemoDataStore] Added evaluation run:', run.id);
  } catch (error) {
    console.error('[DemoDataStore] Failed to add run:', error);
    throw error;
  }
};

// Helper - Get baseline for comparison (Test 3.3)
export const getBaselineRun = (datasetName: string): EvaluationRun | null => {
  const runs = getEvaluationRuns();
  return runs.find(r =>
    r.datasetName === datasetName &&
    r.workflowName.includes('v1.0') // ← Test 3.3: Find baseline by version
  ) || null;
};
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes (Phase 2 errors should be gone)
- [ ] Manual test in console:
  ```javascript
  import { initializeDemoData, getDeployedWorkflows } from './demoDataStore';
  initializeDemoData();
  console.log(getDeployedWorkflows()); // Should show v1.0.0 baseline
  ```

---

**Step 3.2**: Update RecentRunsTab to load from localStorage (Test 2.2 line 113-115)

File: `src/components/workflow/RecentRunsTab.tsx`

**Add import**:
```typescript
import { getEvaluationRuns, EvaluationRun } from '../../utils/demoDataStore';
```

**Replace hard-coded mockRuns**:
```typescript
export default function RecentRunsTab({ workflowId }: RecentRunsTabProps) {
  const [runs, setRuns] = useState<EvaluationRun[]>([]);

  useEffect(() => {
    setRuns(getEvaluationRuns());
  }, []);

  // Rest of component unchanged - table renders from `runs` state
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] In browser: Recent Runs tab shows baseline run

### Post-Phase Audit
- [ ] All verifications passed
- [ ] Manual: localStorage.clear() → reload → seed data appears
- [ ] Git commit: `git commit -m "feat: demoDataStore with seed data"`
- [ ] Git tag: `git tag phase-3-complete`

---

## Phase 4: Deployment Flow (~1.5 hours)

### Goal
Create deployment dialog with race condition prevention

### Pre-Phase Audit
- [ ] Phase 3 complete
- [ ] Read test requirements: Section 2 - Phase 4 (lines 900-1000)
- [ ] Run `npx tsc --noEmit` - 0 errors
- [ ] Git checkpoint: `git tag phase-4-start`

### Test Requirements Summary
- Test 4.1: Dialog pre-fills name and version
- Test 4.2: localStorage written before navigation (race condition test)

### Implementation Steps

**Step 4.1**: Create DeploymentDialog.tsx (Satisfies Test 4.1)

File: `src/components/workflow/DeploymentDialog.tsx` (NEW - ~140 lines)

```typescript
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Rocket, CheckCircle } from '@mui/icons-material';

interface DeploymentDialogProps {
  open: boolean;
  onClose: () => void;
  onDeploy: (name: string, version: string) => void;
  workflowName?: string;
}

export default function DeploymentDialog({
  open,
  onClose,
  onDeploy,
  workflowName = 'Claims Detection v2', // ← Test 4.1: Default pre-fill
}: DeploymentDialogProps) {
  const [name, setName] = useState(workflowName);
  const [version, setVersion] = useState('2.0.0'); // ← Test 4.1: Suggested version

  const handleSubmit = () => {
    onDeploy(name, version);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rocket sx={{ color: '#6366f1' }} />
          <Typography variant="h6">Deploy to Production</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name input (Test 4.1 line 30) */}
          <TextField
            name="workflow-name"
            label="Workflow Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {/* Version input (Test 4.1 line 33) */}
          <TextField
            name="version"
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            fullWidth
            helperText="Auto-suggested: 2.0.0"
          />

          {/* Checklist (Test 4.1 line 38-40) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Pre-Deployment Checklist
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip
                data-checklist-item // ← Test 4.1 line 39
                icon={<CheckCircle />}
                label="Evals passed (94% accuracy)"
                color="success"
              />
              <Chip
                data-checklist-item
                icon={<CheckCircle />}
                label="All nodes validated"
                color="success"
              />
              <Chip
                data-checklist-item
                icon={<CheckCircle />}
                label="Connections verified"
                color="success"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Rocket />}
          onClick={handleSubmit}
          sx={{ bgcolor: '#6366f1' }}
        >
          Deploy to Production
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] Dialog has all required elements (name input, version input, 3 checkmarks)

---

**Step 4.2**: Add Deploy button to PrototypeStation (Satisfies Test 4.2)

File: `src/pages/PrototypeStation.tsx`

**Add imports**:
```typescript
import { addDeployedWorkflow, DeployedWorkflow } from '../utils/demoDataStore';
import DeploymentDialog from '../components/workflow/DeploymentDialog';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
```

**Add state**:
```typescript
const [deployDialogOpen, setDeployDialogOpen] = useState(false);
const navigate = useNavigate();
const { enqueueSnackbar } = useSnackbar();
```

**Add handleDeploy** (with race condition prevention - Test 4.2):
```typescript
const handleDeploy = async (name: string, version: string) => {
  const newWorkflow: DeployedWorkflow = {
    id: `workflow-${Date.now()}`,
    name,
    version,
    status: 'active',
    lastRun: 'Just now',
    totalRuns: 0,
    successRate: 0,
    avgExecutionTime: '0s',
    nodes, // Current canvas nodes
    edges, // Current canvas edges
  };

  // 1. Write to localStorage (synchronous) (Test 4.2 line 88)
  addDeployedWorkflow(newWorkflow);

  // 2. Wait 100ms for flush (Test 4.2 line 91)
  await new Promise(resolve => setTimeout(resolve, 100));

  // 3. Navigate to production (Test 4.2 line 94)
  navigate('/production');

  // 4. Show success message
  enqueueSnackbar(`Deployed ${name} v${version}`, { variant: 'success' });
};
```

**Add button in toolbar JSX**:
```typescript
<Button
  variant="contained"
  startIcon={<Rocket />}
  onClick={() => setDeployDialogOpen(true)}
  sx={{ bgcolor: '#6366f1' }}
>
  Deploy to Production
</Button>
```

**Add dialog in JSX** (before closing </Box>):
```typescript
<DeploymentDialog
  open={deployDialogOpen}
  onClose={() => setDeployDialogOpen(false)}
  onDeploy={handleDeploy}
  workflowName="Claims Detection v2"
/>
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] In browser: "Deploy to Production" button visible
- [ ] Click button → Dialog opens with pre-filled data

### Post-Phase Audit
- [ ] Dialog shows correct pre-fills
- [ ] Deploy writes to localStorage within 50ms
- [ ] Navigation happens after 100ms delay
- [ ] Git commit: `git commit -m "feat: deployment dialog with race prevention"`
- [ ] Git tag: `git tag phase-4-complete`

---

## Phase 5: Production Integration (~1 hour)

### Goal
Load deployed workflows from localStorage in Production page

### Pre-Phase Audit
- [ ] Phase 4 complete
- [ ] Read test requirements: Section 2 - Phase 5 (lines 1050-1100)
- [ ] Git checkpoint: `git tag phase-5-start`

### Test Requirements Summary
- Test 5.1: v2.0.0 auto-selected after deployment
- Canvas shows 9 nodes (8 + Critic Agent)

### Implementation Steps

**Step 5.1**: Load workflows from localStorage (Satisfies Test 5.1)

File: `src/pages/ProductionEnvironment.tsx`

**Add import**:
```typescript
import { getDeployedWorkflows, DeployedWorkflow } from '../utils/demoDataStore';
```

**Replace hard-coded deployedWorkflows** (around line 40):
```typescript
// BEFORE:
// const deployedWorkflows = [ /* hard-coded array */ ];

// AFTER:
const [deployedWorkflows, setDeployedWorkflows] = useState<DeployedWorkflow[]>([]);

useEffect(() => {
  const workflows = getDeployedWorkflows();
  setDeployedWorkflows(workflows);

  // Auto-select first (most recent) workflow (Test 5.1 line 18)
  if (workflows.length > 0 && !selectedWorkflowId) {
    setSelectedWorkflowId(workflows[0].id);
  }
}, []);
```

**Update selectedWorkflow** to use state:
```typescript
const selectedWorkflow = deployedWorkflows.find(w => w.id === selectedWorkflowId);
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] In browser (Production page): Dropdown shows v1.0.0 baseline
- [ ] After deploying from Prototype: Dropdown shows v2.0.0 first

### Post-Phase Audit
- [ ] Deployed workflow appears in dropdown
- [ ] Canvas renders deployed workflow nodes
- [ ] Git commit: `git commit -m "feat: load workflows from localStorage in production"`
- [ ] Git tag: `git tag phase-5-complete`

---

## Phase 6: App Initialization (~15 minutes)

### Goal
Initialize seed data on app mount

### Implementation Steps

**Step 6.1**: Call initializeDemoData in App.tsx

File: `src/App.tsx`

**Add import**:
```typescript
import { useEffect } from 'react';
import { initializeDemoData } from './utils/demoDataStore';
```

**Add useEffect** (in App component):
```typescript
useEffect(() => {
  initializeDemoData();
}, []);
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] Clear localStorage → Reload app → localStorage has seed data

### Post-Phase Audit
- [ ] Git commit: `git commit -m "feat: initialize seed data on app mount"`
- [ ] Git tag: `git tag phase-6-complete`

---

## Phase 7: Unit Tests (~2 hours)

### Goal
Write comprehensive unit tests for demoDataStore

### Implementation Steps

**Step 7.1**: Create demoDataStore.test.ts

File: `src/utils/__tests__/demoDataStore.test.ts` (NEW - ~150 lines)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeDemoData,
  getDeployedWorkflows,
  addDeployedWorkflow,
  getEvaluationRuns,
  addEvaluationRun,
  getBaselineRun,
  DeployedWorkflow,
  EvaluationRun,
} from '../demoDataStore';

beforeEach(() => {
  localStorage.clear();
});

describe('initializeDemoData', () => {
  it('seeds baseline workflow on first load', () => {
    initializeDemoData();

    const workflows = getDeployedWorkflows();
    expect(workflows).toHaveLength(1);
    expect(workflows[0].name).toBe('Claims Detection v1.0.0');
    expect(workflows[0].version).toBe('1.0.0');
    expect(workflows[0].successRate).toBe(87.3);
  });

  it('does not overwrite existing data', () => {
    initializeDemoData();

    const customWorkflow: DeployedWorkflow = {
      id: 'custom',
      name: 'Custom',
      version: '1.0.0',
      status: 'active',
      lastRun: 'now',
      totalRuns: 0,
      successRate: 0,
      avgExecutionTime: '0s',
      nodes: [],
      edges: [],
    };
    addDeployedWorkflow(customWorkflow);

    initializeDemoData(); // Call again

    const workflows = getDeployedWorkflows();
    expect(workflows[0].name).toBe('Custom'); // Should keep custom data
  });
});

describe('addDeployedWorkflow', () => {
  it('adds workflow to beginning of array', () => {
    initializeDemoData();

    const newWorkflow: DeployedWorkflow = {
      id: 'workflow-v2',
      name: 'Claims Detection v2.0.0',
      version: '2.0.0',
      status: 'active',
      lastRun: 'now',
      totalRuns: 0,
      successRate: 94,
      avgExecutionTime: '2.0s',
      nodes: [],
      edges: [],
    };

    addDeployedWorkflow(newWorkflow);

    const workflows = getDeployedWorkflows();
    expect(workflows[0].id).toBe('workflow-v2'); // Newest first
    expect(workflows).toHaveLength(2); // v2.0 + v1.0
  });
});

describe('getBaselineRun', () => {
  it('returns v1.0 run for dataset', () => {
    initializeDemoData();

    const baseline = getBaselineRun('Financial Fraud Detection');

    expect(baseline).not.toBeNull();
    expect(baseline?.workflowName).toContain('v1.0');
    expect(baseline?.accuracy).toBe(87);
    expect(baseline?.datasetName).toBe('Financial Fraud Detection');
  });

  it('returns null when no baseline exists', () => {
    localStorage.clear();

    const baseline = getBaselineRun('Nonexistent Dataset');

    expect(baseline).toBeNull();
  });
});

describe('Error handling', () => {
  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('demo-deployed-workflows', 'invalid json{');

    const workflows = getDeployedWorkflows();

    // Should return fallback seed data, not crash
    expect(workflows).toBeDefined();
    expect(Array.isArray(workflows)).toBe(true);
    expect(workflows[0].name).toBe('Claims Detection v1.0.0');
  });
});
```

**Post-Step Verification**:
- [ ] `npx tsc --noEmit` passes
- [ ] Human runs: `npm test` → All tests pass

### Post-Phase Audit
- [ ] All unit tests pass
- [ ] Git commit: `git commit -m "test: add demoDataStore unit tests"`
- [ ] Git tag: `git tag phase-7-complete`

---

## Phase 8: E2E Playwright Tests (~4 hours)

### Goal
Write granular E2E tests for demo flow

### Implementation Steps

**Step 8.1**: Create chatbot-interactions.spec.ts

File: `e2e/granular/chatbot-interactions.spec.ts` (NEW - ~200 lines - compressed version)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Chatbot Interactions', () => {
  test('FAB button renders with correct styles', async ({ page }) => {
    await page.goto('http://localhost:5173/prototype');

    const fab = page.locator('button[aria-label="Open chat assistant"]');
    await expect(fab).toBeVisible();
    await expect(fab).toHaveCSS('width', '60px');
    await expect(fab).toHaveCSS('bottom', '24px');
    await expect(fab).toHaveCSS('right', '24px');
  });

  test('Returns workflow metadata on discovery query', async ({ page }) => {
    await page.goto('http://localhost:5173/prototype');
    await page.click('button[aria-label="Open chat assistant"]');

    const input = page.locator('input[placeholder="Type your message..."]');
    await input.fill('improve claims detection with false positives');
    await input.press('Enter');

    await page.waitForTimeout(1600);

    const aiMsg = page.locator('[data-message-role="assistant"]').last();
    await expect(aiMsg).toContainText('8 nodes');
    await expect(aiMsg).toContainText('OpenAI Chat Model');
    await expect(aiMsg).toContainText('87%');

    const loadBtn = page.locator('button:has-text("Load this template")');
    await expect(loadBtn).toBeVisible();
  });

  test('Shows confirmation after template loads', async ({ page }) => {
    await page.goto('http://localhost:5173/prototype');
    await page.click('button[aria-label="Open chat assistant"]');

    await page.locator('input').fill('improve claims');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1600);

    await page.locator('button:has-text("Load this template")').click();
    await page.waitForTimeout(500);

    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(8);

    const confirmMsg = page.locator('[data-message-role="assistant"]').last();
    await expect(confirmMsg).toContainText('✓ Loaded');
  });
});
```

**Step 8.2**: Create evaluation-execution.spec.ts (compressed)

---

### Post-Phase Audit
- [ ] All E2E tests written
- [ ] Human runs: `npm run test:e2e` → Tests pass
- [ ] Git commit: `git commit -m "test: add granular E2E tests"`
- [ ] Git tag: `git tag phase-8-complete`

---

# SECTION 5: E2E TEST SPECIFICATIONS

## Complete Test File: chatbot-interactions.spec.ts

(Full content compressed - see Phase 8 implementation)

## Complete Test File: evaluation-execution.spec.ts

(Full content compressed - see Phase 2 test requirements)

## Complete Test File: deployment-flow.spec.ts

(Full content compressed - see Phase 4 test requirements)

---

# SECTION 6: TESTING STRATEGY & TIMELINE

## Testing Approach

**Option B (Robust)**: Full testing with TypeScript checks + Unit tests + E2E Playwright tests

### What I Can Do Autonomously

1. **TypeScript Compilation Check**
   ```bash
   npx tsc --noEmit
   ```
   Run after each file

2. **Write Tests**
   Write comprehensive unit + E2E tests (but can't run them)

### What Requires Human

1. **Run Unit Tests**
   ```bash
   npm test
   ```

2. **Run E2E Tests**
   ```bash
   npm run test:e2e
   ```

3. **Manual Testing** - Follow checklist in SECTION 1

---

## Implementation Timeline

### Day 1 (5-6 hours):
1. Phase 0: Test infrastructure
2. Phase 3: demoDataStore (MUST come before Phase 2)
3. Phase 2: Evaluation engine (depends on Phase 3)
4. Phase 6: App init
5. Run: `npx tsc --noEmit` after each file

### Day 2 (5-6 hours):
6. Phase 1: Chatbot P0
7. Phase 4: Deployment flow
8. Phase 5: Production integration
9. Phase 7: Unit tests
10. Human runs: `npm test`

### Day 3 (3-4 hours):
11. Phase 8: E2E Playwright tests
12. Human runs: `npm run test:e2e`
13. Manual demo walkthrough
14. Fix bugs if found

**Total**: ~13-16 hours (implementation + testing)

---

# SECTION 7: SUCCESS CRITERIA

- [ ] All TypeScript checks pass (`npx tsc --noEmit`)
- [ ] All unit tests pass (`npm test`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] Manual demo walkthrough completes without errors
- [ ] Data persists across page reloads
- [ ] `localStorage.clear()` resets to baseline
- [ ] Demo duration: ~13 minutes
- [ ] No console errors during demo
- [ ] Comparison logic shows consistent 7% improvement
- [ ] All 5 critical risks mitigated
- [ ] Git tags created for each phase

---

## FILES SUMMARY - COMPLETE

**New Files (12)**:
- `vitest.config.ts`
- `playwright.config.ts`
- `src/test-utils/setup.ts`
- `src/utils/evaluationEngine.ts` (~100 lines)
- `src/utils/demoDataStore.ts` (~200 lines)
- `src/components/workflow/DeploymentDialog.tsx` (~140 lines)
- `src/utils/__tests__/demoDataStore.test.ts` (~150 lines)
- `e2e/granular/chatbot-interactions.spec.ts` (~200 lines)
- `e2e/granular/evaluation-execution.spec.ts` (~150 lines)
- `e2e/granular/deployment-flow.spec.ts` (~120 lines)
- `e2e/granular/production-execution.spec.ts` (~80 lines)
- `e2e/granular/demo-reset.spec.ts` (~50 lines)

**Modified Files (7)**:
- `package.json` (dependencies, scripts)
- `src/data/workflowTemplates.ts` (~50 lines added)
- `src/components/workflow/ChatbotWidget.tsx` (~100 lines modified)
- `src/pages/PrototypeStation.tsx` (~60 lines added)
- `src/components/workflow/RunEvaluationTab.tsx` (~80 lines modified)
- `src/components/workflow/RecentRunsTab.tsx` (~15 lines modified)
- `src/pages/ProductionEnvironment.tsx` (~25 lines modified)
- `src/App.tsx` (~5 lines added)

**Total New Lines**: ~1,500 lines (including tests)
**Total Modified Lines**: ~335 lines
**Estimated Implementation Time**: 13-16 hours
**Human Testing Time**: 2-3 hours

---

**END OF DOCUMENT**

---

## Quick Navigation Reminder

- Demo Script: Lines 30-250
- Granular Test Requirements: Lines 252-900
- Pre-Phase Audit Protocol: Lines 902-1100
- Implementation Phases: Lines 1102-2100
- E2E Test Specifications: Lines 2102-2350
- Testing Strategy & Timeline: Lines 2352-2450
- Success Criteria: Lines 2452-2500

**Always use Read tool with offset/limit to load specific sections only.**
