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
    return data ? JSON.parse(data) : [...SEED_DEPLOYED_WORKFLOWS]; // ← Return copy to prevent mutation
  } catch (error) {
    console.error('[DemoDataStore] Failed to parse workflows:', error);
    return [...SEED_DEPLOYED_WORKFLOWS]; // ← Return copy to prevent mutation
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
    return data ? JSON.parse(data) : [...SEED_EVALUATION_RUNS]; // ← Return copy to prevent mutation
  } catch (error) {
    console.error('[DemoDataStore] Failed to parse runs:', error);
    return [...SEED_EVALUATION_RUNS]; // ← Return copy to prevent mutation
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
