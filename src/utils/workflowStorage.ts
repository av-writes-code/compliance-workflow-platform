import { Node, Edge } from 'reactflow';

const WORKFLOW_STORAGE_KEY = 'compliance-workflow-current';
const WORKFLOWS_LIST_KEY = 'compliance-workflows-list';

export interface SavedWorkflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  savedAt: string;
}

export const saveWorkflow = (nodes: Node[], edges: Edge[], name?: string): void => {
  const workflow: SavedWorkflow = {
    id: Date.now().toString(),
    name: name || `Workflow ${new Date().toLocaleString()}`,
    nodes,
    edges,
    savedAt: new Date().toISOString(),
  };

  // Save current workflow
  localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflow));

  // Add to workflows list
  const existingWorkflows = getWorkflowsList();
  existingWorkflows.unshift(workflow);
  localStorage.setItem(WORKFLOWS_LIST_KEY, JSON.stringify(existingWorkflows.slice(0, 10))); // Keep last 10
};

export const loadWorkflow = (): SavedWorkflow | null => {
  const saved = localStorage.getItem(WORKFLOW_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const getWorkflowsList = (): SavedWorkflow[] => {
  const saved = localStorage.getItem(WORKFLOWS_LIST_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const exportWorkflowJSON = (nodes: Node[], edges: Edge[]): void => {
  const workflow = {
    nodes,
    edges,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workflow-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
