import { create } from 'zustand';
import { Framework, Control, Evidence, FrameworkReadiness, WorkflowNode } from '../types';

interface AppState {
  selectedFramework: Framework | 'all';
  setSelectedFramework: (framework: Framework | 'all') => void;

  controls: Control[];
  addControl: (control: Control) => void;
  updateControl: (id: string, updates: Partial<Control>) => void;

  evidence: Evidence[];
  addEvidence: (evidence: Evidence) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;

  workflowNodes: WorkflowNode[];
  setWorkflowNodes: (nodes: WorkflowNode[]) => void;

  frameworkReadiness: FrameworkReadiness[];
}

export const useAppStore = create<AppState>((set) => ({
  selectedFramework: 'all',
  setSelectedFramework: (framework) => set({ selectedFramework: framework }),

  controls: [],
  addControl: (control) => set((state) => ({ controls: [...state.controls, control] })),
  updateControl: (id, updates) => set((state) => ({
    controls: state.controls.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  evidence: [],
  addEvidence: (evidence) => set((state) => ({ evidence: [...state.evidence, evidence] })),
  updateEvidence: (id, updates) => set((state) => ({
    evidence: state.evidence.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  workflowNodes: [],
  setWorkflowNodes: (nodes) => set({ workflowNodes: nodes }),

  frameworkReadiness: [
    { framework: 'SOC2', percentageReady: 78, controlsPassing: 45, controlsFailing: 8, controlsPending: 5, controlsNotTested: 2 },
    { framework: 'ISO27001', percentageReady: 65, controlsPassing: 32, controlsFailing: 12, controlsPending: 8, controlsNotTested: 3 },
    { framework: 'HIPAA', percentageReady: 92, controlsPassing: 28, controlsFailing: 2, controlsPending: 1, controlsNotTested: 0 },
    { framework: 'GDPR', percentageReady: 55, controlsPassing: 18, controlsFailing: 10, controlsPending: 5, controlsNotTested: 4 },
  ],
}));
