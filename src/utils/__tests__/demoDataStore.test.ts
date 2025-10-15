import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initializeDemoData, addDeployedWorkflow, getDeployedWorkflows } from '../demoDataStore';

const STORAGE_KEY = 'demo-deployed-workflows';
const EVAL_STORAGE_KEY = 'demo-evaluation-runs';

describe('demoDataStore', () => {
  beforeEach(() => {
    // Clear all localStorage keys before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Also clear after to ensure no state leaks
    localStorage.clear();
  });

  describe('initializeDemoData', () => {
    it('should initialize demo data with default workflows', () => {
      initializeDemoData();

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();

      const workflows = JSON.parse(stored!);
      expect(workflows).toBeInstanceOf(Array);
      expect(workflows.length).toBeGreaterThan(0);
      expect(workflows[0].id).toBe('workflow-baseline');
    });

    it('should not overwrite existing data', () => {
      // Pre-populate localStorage
      const existingData = [{ id: 'existing-workflow', name: 'Existing' }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

      initializeDemoData();

      const stored = localStorage.getItem(STORAGE_KEY);
      const workflows = JSON.parse(stored!);
      expect(workflows).toEqual(existingData);
    });
  });

  describe('addDeployedWorkflow', () => {
    it('should add a new workflow to localStorage', () => {
      // Initialize with seed data first
      initializeDemoData();

      const newWorkflow = {
        id: 'workflow-123',
        name: 'Test Workflow',
        version: '1.0.0',
        status: 'active' as const,
        lastRun: 'Just now',
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        nodes: [],
        edges: [],
      };

      addDeployedWorkflow(newWorkflow);

      const stored = localStorage.getItem(STORAGE_KEY);
      const workflows = JSON.parse(stored!);

      expect(workflows).toBeInstanceOf(Array);
      expect(workflows[0]).toMatchObject({
        id: 'workflow-123',
        name: 'Test Workflow',
        version: '1.0.0',
      });
    });

    it('should prepend new workflow to existing list', () => {
      // Add first workflow
      const workflow1 = {
        id: 'workflow-1',
        name: 'First',
        version: '1.0.0',
        status: 'active' as const,
        lastRun: 'Just now',
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        nodes: [],
        edges: [],
      };
      addDeployedWorkflow(workflow1);

      // Add second workflow
      const workflow2 = {
        id: 'workflow-2',
        name: 'Second',
        version: '1.0.0',
        status: 'active' as const,
        lastRun: 'Just now',
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        nodes: [],
        edges: [],
      };
      addDeployedWorkflow(workflow2);

      const workflows = getDeployedWorkflows();
      expect(workflows[0].id).toBe('workflow-2');
      expect(workflows[1].id).toBe('workflow-1');
    });
  });

  describe('getDeployedWorkflows - isolated', () => {
    beforeEach(() => {
      // Extra clear to ensure no state leakage
      localStorage.clear();
    });

    it('should return seed data when localStorage is empty', () => {
      const workflows = getDeployedWorkflows();

      // Should return seed data as fallback
      expect(workflows).toBeInstanceOf(Array);
      expect(workflows.length).toBeGreaterThan(0);
      expect(workflows[0].id).toBe('workflow-baseline');
    });
  });

  describe('getDeployedWorkflows - with data', () => {
    beforeEach(() => {
      // Extra clear to ensure no state leakage
      localStorage.clear();
    });

    it('should return all deployed workflows from localStorage', () => {
      const testWorkflows = [
        {
          id: 'workflow-1',
          name: 'Workflow 1',
          version: '1.0.0',
          status: 'active' as const,
          lastRun: 'Just now',
          totalRuns: 0,
          successRate: 0,
          avgExecutionTime: '0s',
          nodes: [],
          edges: [],
        },
        {
          id: 'workflow-2',
          name: 'Workflow 2',
          version: '2.0.0',
          status: 'active' as const,
          lastRun: 'Just now',
          totalRuns: 0,
          successRate: 0,
          avgExecutionTime: '0s',
          nodes: [],
          edges: [],
        },
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(testWorkflows));

      const workflows = getDeployedWorkflows();
      expect(workflows).toHaveLength(2);
      expect(workflows[0].name).toBe('Workflow 1');
      expect(workflows[1].name).toBe('Workflow 2');
    });
  });

  describe('getDeployedWorkflows - error handling', () => {
    beforeEach(() => {
      // Extra clear to ensure no state leakage
      localStorage.clear();
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const workflows = getDeployedWorkflows();

      // Should return seed data as fallback on error
      expect(workflows).toBeInstanceOf(Array);
      expect(workflows.length).toBeGreaterThan(0);
      expect(workflows[0].id).toBe('workflow-baseline');
    });
  });
});
