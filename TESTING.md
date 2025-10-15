# Testing and Quality Assurance

**Last updated:** 2025-10-15 17:30

This document provides a comprehensive guide to the testing strategy for the Compliance Workflow Platform.

---

## Test Status Summary

### Unit Tests
- **Location:** `src/**/__tests__/`
- **Current Status:** ✅ **103/103 passing**
- **Framework:** Vitest + React Testing Library
- **Latest:** Phase 4.2 complete - Added 26 deployment tests (handleDeploy logic, toolbar, dialog state, integration)

### E2E Tests
- **Location:** `e2e/` and `e2e/granular/`
- **Current Status:** ⚠️ **12/16 passing (75%)** - 4 tests still failing
- **Framework:** Playwright
- **Latest:** Phase 4.4 - Fixed demo-flow type signature (5/5 passing), chatbot tests still failing (input visibility)

---

## Test Locations

### Unit Test Files (103 tests total)
```
src/
├── components/workflow/__tests__/
│   ├── ChatbotWidget.test.tsx (35 tests) ✓
│   ├── DeploymentDialog.test.tsx (12 tests) ✓
│   ├── PrototypeToolbar.deploy.test.tsx (6 tests) ✓
│   └── RunEvaluationTab.test.tsx (15 tests) ✓
├── pages/__tests__/
│   ├── ProductionEnvironment.test.tsx (4 tests) ✓
│   ├── PrototypeStation.test.tsx (4 integration tests) ✓
│   ├── PrototypeStation.handleDeploy.test.tsx (12 unit tests) ✓
│   └── PrototypeStation.dialogState.test.tsx (8 unit tests) ✓
└── utils/__tests__/
    └── demoDataStore.test.ts (7 tests) ✓
```

### E2E Test Files (16 tests total)
```
e2e/
├── demo-flow.spec.ts (5/5 passing) ✓
└── granular/
    ├── chatbot-interactions.spec.ts (1/5 passing) ❌
    ├── deployment.spec.ts (3/3 passing) ✓
    └── run-evaluation.spec.ts (3/3 passing) ✓
```

---

## Running Tests

### All Unit Tests
```bash
npm test
```

### Specific Unit Test File
```bash
npm test -- path/to/test.tsx
```

### Single Unit Test
```bash
npm test -- path/to/test.tsx -t "test name pattern"
```

### All E2E Tests
```bash
npx playwright test
```

### Specific E2E Test File
```bash
npx playwright test e2e/granular/deployment.spec.ts
```

### E2E Tests in UI Mode (for debugging)
```bash
npx playwright test --ui
```

---

## Test Naming Conventions

### File Names
- Unit tests: `<ComponentName>.test.tsx` or `<feature>.test.tsx`
- E2E tests: `<feature>.spec.ts`

### Test Function Names
- Pattern: `test_<feature>_<scenario>`
- Example: `test_deployment_creates_workflow_with_active_status`
- Use descriptive names that explain what is being tested

---

## Debugging Failed Tests

### Step 1: Identify the Failing Test
- Check CI/CD pipeline output or local test run
- Note the test file path and test name

### Step 2: Run the Specific Test Locally
```bash
# Unit test
npm test -- src/pages/__tests__/PrototypeStation.test.tsx -t "Test 8"

# E2E test
npx playwright test e2e/granular/deployment.spec.ts --debug
```

### Step 3: Analyze the Error
- Read the error message and stack trace carefully
- Check if it's a selector issue, timing issue, or logic issue

### Step 4: Fix and Verify
- Make necessary code changes
- Re-run the specific test to verify fix
- Run full test suite to ensure no regressions

---

## Bug Reporting Template

When creating a bug report for a failed test, use this template:

```markdown
**Summary:** [Brief description of the bug]

**Test File:** [Path to failing test, e.g., src/pages/__tests__/PrototypeStation.test.tsx]

**Test Name:** [e.g., "Test 8: should call addDeployedWorkflow when deploying"]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Expected Result:** [What should happen]

**Actual Result:** [What actually happens]

**Error Message:**
```
[Paste error output here]
```

**Environment:**
- OS: [e.g., macOS 14.5]
- Browser (for E2E): [e.g., Chrome 129]
- Node version: [e.g., 20.11.0]

**Stack Trace:**
```
[Paste stack trace if available]
```
```

---

## Known Issues

### E2E Test Failures (4/16 failing)

**chatbot-interactions.spec.ts (4 failing):**
1. **Test 1.2**: "Chatbot returns workflow metadata on discovery query" - Input field not visible after FAB click
2. **Test 1.3**: "Chatbot shows confirmation after template loads" - Input field not visible after FAB click
3. **Test 1.4**: "Chatbot provides Critic Agent guidance with steps" - Input field not visible after FAB click
4. **Test 1.5**: "Quick action button triggers template loading" - Input field not visible after FAB click

**Root Cause:**
- Chatbot input inside Collapse component with Fade animation
- Takes >500ms to render, causing Playwright to timeout (10s) before finding input field
- Input placeholder selector is correct: `input[placeholder*="Ask me anything"]`
- FAB button click works, chatbot opens, but input not immediately visible

---

## Recent Updates

### Phase 4.4 (2025-10-15 17:30)
- ✅ Fixed PrototypeStation.handleDeploy type signature mismatch (demo-flow.spec.ts: 5/5 passing)
- ✅ Fixed deployment dialog React crash ("Objects are not valid as a React child")
- ⚠️ Attempted chatbot E2E fixes (placeholder + animation wait) - still failing (4/16)
- **E2E Status**: 12/16 passing (75%)

### Phase 4.3 Partial (2025-10-15 15:45)
- ✅ Fixed deployment E2E test selectors (3/3 passing in deployment.spec.ts)
- ⚠️ Partially fixed demo-flow.spec.ts (3/5 passing, 2 had type signature issue)
- ❌ chatbot-interactions.spec.ts investigation blocked by timeouts (1/5 passing)
- **E2E Status**: 10/16 passing (62.5%)

### Phase 4.2 Complete (2025-10-15 13:30)
- ✅ Added `PrototypeStation.handleDeploy.test.tsx` (12 unit tests for deployment logic)
- ✅ Added `PrototypeStation.dialogState.test.tsx` (8 unit tests for dialog state management)
- ✅ Fixed 2 failing integration tests in `PrototypeStation.test.tsx` (timeout + wrong button selector)
- ✅ All 103 unit tests passing

---

## Test Pyramid Strategy

- **70% Unit Tests:** Testing individual components and functions in isolation
- **20% Integration Tests:** Testing how components work together
- **10% E2E Tests:** Testing complete user workflows

**Current Distribution:** To be calculated after all tests stabilized

---

## Code Coverage

**How to generate coverage report:**
```bash
npm test -- --coverage
```

**Current coverage:** To be measured after all tests pass

**Coverage goals:**
- Line coverage: >80%
- Branch coverage: >75%
- Function coverage: >80%

---

## CI/CD Integration

**Status:** To be configured

**Planned integration:**
- Automated test runs on PR creation
- Coverage reports generated on every build
- E2E tests run on staging environment

---

## Contributing to Tests

### Before Committing
1. Run full test suite: `npm test`
2. Ensure all tests pass
3. Run E2E tests if UI changes made
4. Update this TESTING.md if test structure changes

### Test Review Checklist
- [ ] Test names are descriptive
- [ ] Tests follow AAA or GIVEN-WHEN-THEN pattern
- [ ] No hardcoded waits in E2E tests (use waitFor)
- [ ] Tests are independent (no shared state)
- [ ] Coverage hasn't decreased

---

**Maintenance Note:** Update this file when adding/removing tests or when pass rates change. Always include timestamp at top.
