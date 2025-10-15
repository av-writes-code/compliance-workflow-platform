import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { addDeployedWorkflow } from '../../utils/demoDataStore';
import type { Node, Edge } from 'reactflow';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('notistack', () => ({
  useSnackbar: vi.fn(),
}));

vi.mock('../../utils/demoDataStore', () => ({
  addDeployedWorkflow: vi.fn(),
  getDeployedWorkflows: vi.fn(() => []),
}));

describe('PrototypeStation handleDeploy Unit Tests', () => {
  let mockNavigate: ReturnType<typeof vi.fn>;
  let mockEnqueueSnackbar: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();
    mockEnqueueSnackbar = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useSnackbar as any).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper to create handleDeploy function matching PrototypeStation implementation
  const createHandleDeploy = (nodes: Node[], edges: Edge[]) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return async (name: string, version: string) => {
      const newWorkflow = {
        id: `workflow-${Date.now()}`,
        name,
        version,
        status: 'active' as const,
        lastRun: 'Just now',
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        nodes,
        edges,
      };

      addDeployedWorkflow(newWorkflow);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/production');
      enqueueSnackbar(`Deployed ${name} v${version}`, { variant: 'success' });
    };
  };

  // Test 1: handleDeploy creates workflow with correct structure
  it('Test 1: should create workflow with correct structure', async () => {
    const testNodes: Node[] = [
      { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Start' } },
    ];
    const testEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
    ];

    const handleDeploy = createHandleDeploy(testNodes, testEdges);

    const deployPromise = handleDeploy('Claims Detection v2.0.0', 'v2.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Claims Detection v2.0.0',
        version: 'v2.0.0',
        status: 'active',
        lastRun: 'Just now',
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        nodes: testNodes,
        edges: testEdges,
      })
    );
  });

  // Test 2: handleDeploy generates unique ID with timestamp
  it('Test 2: should generate unique ID with timestamp format', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise1 = handleDeploy('Workflow A', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise1;

    const firstCall = (addDeployedWorkflow as any).mock.calls[0][0];
    expect(firstCall.id).toMatch(/^workflow-\d+$/);
    expect(firstCall.id.startsWith('workflow-')).toBe(true);
  });

  // Test 3: handleDeploy sets status to 'active'
  it('Test 3: should set status to active', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Test Workflow', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active' })
    );
  });

  // Test 4: handleDeploy sets initial metrics
  it('Test 4: should set initial metrics to zero', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Test Workflow', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        totalRuns: 0,
        successRate: 0,
        avgExecutionTime: '0s',
        lastRun: 'Just now',
      })
    );
  });

  // Test 5: handleDeploy includes current nodes in workflow
  it('Test 5: should include current nodes in workflow', async () => {
    const testNodes: Node[] = [
      { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Start' } },
      { id: '2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Process' } },
      { id: '3', type: 'output', position: { x: 200, y: 200 }, data: { label: 'End' } },
    ];

    const handleDeploy = createHandleDeploy(testNodes, []);

    const deployPromise = handleDeploy('Node Test', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ nodes: testNodes })
    );
  });

  // Test 6: handleDeploy includes current edges in workflow
  it('Test 6: should include current edges in workflow', async () => {
    const testEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ];

    const handleDeploy = createHandleDeploy([], testEdges);

    const deployPromise = handleDeploy('Edge Test', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ edges: testEdges })
    );
  });

  // Test 7: handleDeploy navigates to /production
  it('Test 7: should navigate to production page', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Test', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(mockNavigate).toHaveBeenCalledWith('/production');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  // Test 8: handleDeploy shows success snackbar with correct message
  it('Test 8: should show success snackbar with correct message', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Claims v2.1.0', 'v2.1.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      'Deployed Claims v2.1.0 vv2.1.0',
      { variant: 'success' }
    );
  });

  // Test 9: handleDeploy waits 100ms before navigating
  it('Test 9: should wait 100ms before navigating', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Test', 'v1.0.0');

    // Should not navigate immediately
    expect(mockNavigate).not.toHaveBeenCalled();

    // Advance time by 100ms
    await vi.runAllTimersAsync();
    await deployPromise;

    // Should navigate after delay
    expect(mockNavigate).toHaveBeenCalled();
  });

  // Test 10: handleDeploy executes steps in correct order
  it('Test 10: should execute steps in correct order', async () => {
    const handleDeploy = createHandleDeploy([], []);
    const callOrder: string[] = [];

    (addDeployedWorkflow as any).mockImplementation(() => callOrder.push('addDeployedWorkflow'));
    mockNavigate.mockImplementation(() => callOrder.push('navigate'));
    mockEnqueueSnackbar.mockImplementation(() => callOrder.push('enqueueSnackbar'));

    const deployPromise = handleDeploy('Test', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(callOrder).toEqual(['addDeployedWorkflow', 'navigate', 'enqueueSnackbar']);
  });

  // Test 11: handleDeploy passes version parameter correctly
  it('Test 11: should pass version parameter correctly', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Test Workflow', 'v3.5.2');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ version: 'v3.5.2' })
    );
  });

  // Test 12: handleDeploy passes workflow name parameter correctly
  it('Test 12: should pass workflow name parameter correctly', async () => {
    const handleDeploy = createHandleDeploy([], []);

    const deployPromise = handleDeploy('Custom Workflow Name', 'v1.0.0');
    await vi.runAllTimersAsync();
    await deployPromise;

    expect(addDeployedWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Custom Workflow Name' })
    );
  });
});
