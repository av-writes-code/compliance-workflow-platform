import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Chip, Drawer, IconButton, Button, Select, MenuItem, FormControl, InputLabel, Menu } from '@mui/material';
import { SmartToy, Memory, Security, ChevronLeft, ChevronRight, History, Edit, BugReport, KeyboardArrowDown } from '@mui/icons-material';
import EvaluationsButton from '../components/workflow/EvaluationsButton';
import EvaluationsDrawer from '../components/workflow/EvaluationsDrawer';
import ExecutionControlBar from '../components/workflow/ExecutionControlBar';
import DeployedWorkflowCard from '../components/workflow/DeployedWorkflowCard';
import ExecutionTimeline from '../components/workflow/ExecutionTimeline';
import WorkflowInputDialog from '../components/workflow/WorkflowInputDialog';
import NodeInspectorDrawer from '../components/workflow/NodeInspectorDrawer';
import ExecutionHistoryDrawer from '../components/workflow/ExecutionHistoryDrawer';
import StateModificationPanel from '../components/workflow/StateModificationPanel';
import BreakpointsPanel from '../components/workflow/BreakpointsPanel';
import WorkflowCard from '../components/workflow/WorkflowCard';
import ComponentPalette from '../components/workflow/ComponentPalette';
import WorkflowPreviewPopup from '../components/workflow/WorkflowPreviewPopup';
import ChatbotWidget from '../components/workflow/ChatbotWidget';
import WorkflowCanvas from './WorkflowCanvas';
import { Node, Edge } from 'reactflow';
import { getDeployedWorkflows, DeployedWorkflow as StoredDeployedWorkflow } from '../utils/demoDataStore';

interface DeployedWorkflow {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'archived';
  lastRun: string;
  totalRuns: number;
  successRate: number;
  avgExecutionTime: string;
  nodes: Node[];
  edges: Edge[];
}

interface Breakpoint {
  nodeId: string;
  nodeName: string;
  position: 'before' | 'after';
  enabled: boolean;
  condition?: string;
}

// Mock deployed workflows (defined at module level to avoid hoisting issues)
const mockDeployedWorkflows: DeployedWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Claims Detection v2',
    version: '2.1.0',
    status: 'active',
    lastRun: '2 hours ago',
    totalRuns: 12847,
    successRate: 98.4,
    avgExecutionTime: '3.2s',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 100, y: 200 },
        data: {
          label: 'Data Ingestion',
          subtitle: 'Claims API',
          icon: 'Memory',
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 400, y: 200 },
        data: {
          label: 'AI Agent',
          subtitle: 'Claude Sonnet 4.5',
          icon: 'SmartToy',
        },
      },
      {
        id: '3',
        type: 'decision',
        position: { x: 700, y: 180 },
        data: {
          label: 'Compliance Check',
        },
      },
      {
        id: '4',
        type: 'standard',
        position: { x: 900, y: 100 },
        data: {
          label: 'Approve',
          subtitle: 'Compliant',
          icon: 'Security',
        },
      },
      {
        id: '5',
        type: 'standard',
        position: { x: 900, y: 280 },
        data: {
          label: 'Flag for Review',
          subtitle: 'Manual Check',
          icon: 'Security',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', data: {} },
      { id: 'e2-3', source: '2', target: '3', data: {} },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', data: { branchLabel: 'compliant' } },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', data: { branchLabel: 'violation' } },
    ],
  },
  {
    id: 'workflow-2',
    name: 'Fraud Detection',
    version: '1.5.2',
    status: 'active',
    lastRun: '15 minutes ago',
    totalRuns: 45231,
    successRate: 99.1,
    avgExecutionTime: '1.8s',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 150, y: 250 },
        data: { label: 'Transaction Data', subtitle: 'Payment Gateway', icon: 'Memory' },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 450, y: 250 },
        data: { label: 'Risk Scoring', subtitle: 'ML Model', icon: 'SmartToy' },
      },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2', data: {} }],
  },
  {
    id: 'workflow-3',
    name: 'Content Moderation',
    version: '3.0.0',
    status: 'inactive',
    lastRun: '3 days ago',
    totalRuns: 8924,
    successRate: 96.7,
    avgExecutionTime: '2.5s',
    nodes: [],
    edges: [],
  },
];

export default function ProductionEnvironment() {
  const location = useLocation();
  const [evaluationsDrawerOpen, setEvaluationsDrawerOpen] = useState(false);
  const [workflowSidebarOpen, setWorkflowSidebarOpen] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'paused' | 'completed' | 'failed'>('idle');
  const [executionTime, setExecutionTime] = useState('0s');
  const [completedSteps, setCompletedSteps] = useState(0);
  const [executionEvents, setExecutionEvents] = useState<any[]>([]);
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  const [workflowInputData, setWorkflowInputData] = useState<any>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [breakpointsEnabled, setBreakpointsEnabled] = useState(false);
  const [executionSpeed, setExecutionSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [breakpointsPanelOpen, setBreakpointsPanelOpen] = useState(false);
  const [pausedAtBreakpoint, setPausedAtBreakpoint] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [stateModificationOpen, setStateModificationOpen] = useState(false);
  const [previewPopupOpen, setPreviewPopupOpen] = useState(false);
  const [previewWorkflowId, setPreviewWorkflowId] = useState<string | null>(null);
  const [workflowMenuAnchor, setWorkflowMenuAnchor] = useState<null | HTMLElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [userAddedNodes, setUserAddedNodes] = useState<Node[]>([]);
  const [deployedWorkflows, setDeployedWorkflows] = useState<DeployedWorkflow[]>([]);

  // Load deployed workflows from localStorage on mount and when location changes
  useEffect(() => {
    console.log('[ProductionEnvironment] Loading workflows from localStorage');
    const workflows = getDeployedWorkflows();
    console.log('[ProductionEnvironment] Loaded workflows:', workflows.length);

    // Merge with mock data (existing hard-coded workflows)
    const mergedWorkflows = [...workflows, ...mockDeployedWorkflows];
    console.log('[ProductionEnvironment] Total workflows after merge:', mergedWorkflows.length);
    setDeployedWorkflows(mergedWorkflows);

    // Auto-select first (most recent) workflow if none selected
    if (mergedWorkflows.length > 0 && !selectedWorkflowId) {
      console.log('[ProductionEnvironment] Auto-selecting first workflow:', mergedWorkflows[0].name);
      setSelectedWorkflowId(mergedWorkflows[0].id);
    }
  }, [location.key]); // Re-run on every navigation (location.key changes with each navigation)

  // Runtime state for nodes (separate from workflow definitions)
  interface NodeRuntimeState {
    hasBreakpoint?: boolean;
    isCurrentStep?: boolean;
    isPausedAtBreakpoint?: boolean;
    stepNumber?: number;
    isStepCompleted?: boolean;
    isStepPending?: boolean;
  }
  const [nodeRuntimeState, setNodeRuntimeState] = useState<Record<string, NodeRuntimeState>>({});

  // Helper to check if node has an enabled breakpoint
  const hasEnabledBreakpoint = (nodeId: string): boolean => {
    return breakpoints.some(bp => bp.nodeId === nodeId && bp.enabled);
  };

  // Drag-drop handler for ComponentPalette
  const handleComponentDragStart = (item: any) => {
    setDraggedComponent(item);
  };

  // Handler to sync user-added nodes from WorkflowCanvas
  const handleNodesChange = (nodes: Node[]) => {
    // Filter out template nodes to get only user-added nodes
    const templateNodeIds = new Set(selectedWorkflow.nodes.map(n => n.id));
    const addedNodes = nodes.filter(n => !templateNodeIds.has(n.id));
    setUserAddedNodes(addedNodes);
  };

  // Capture state snapshot when breakpoint is hit
  const captureStateSnapshot = (node: Node, stepIndex: number, workflow: DeployedWorkflow) => {
    // Generate mock data based on node type and position in workflow
    const generateMockData = (nodeType: string, step: number) => {
      const baseData = {
        claimId: 'CLM-2025-001',
        submittedAt: new Date().toISOString(),
        claimant: { name: 'John Doe', policyId: 'POL-12345' },
      };

      if (step === 0) {
        return baseData;
      } else if (step === 1) {
        return {
          ...baseData,
          extractedData: {
            amount: 15000,
            category: 'medical',
            description: 'Surgery procedure',
            documents: ['receipt.pdf', 'medical_report.pdf'],
          },
        };
      } else if (step === 2) {
        return {
          ...baseData,
          fraudScore: 0.23,
          riskLevel: 'low',
          flaggedPatterns: [],
        };
      } else if (step === 3) {
        return {
          ...baseData,
          policyStatus: 'active',
          coverageAmount: 50000,
          deductible: 1000,
          isEligible: true,
        };
      }
      return baseData;
    };

    const inputData = generateMockData(node.data.label, stepIndex - 1);
    const outputData = generateMockData(node.data.label, stepIndex);

    return {
      id: node.id,
      label: node.data.label,
      type: node.type || 'standard',
      executionStatus: 'completed' as const,
      executionTime: `${Math.random() * 1000 + 200}ms`,
      inputData,
      outputData,
      metadata: {
        startTime: new Date(Date.now() - 1500).toISOString(),
        endTime: new Date().toISOString(),
        duration: Math.floor(Math.random() * 1000) + 200,
        queueTime: Math.floor(Math.random() * 50) + 10,
        workerId: `worker-${Math.floor(Math.random() * 5) + 1}`,
        executionId: `exec-${Date.now()}`,
      },
      resources: {
        memoryUsage: Math.floor(Math.random() * 50000000) + 10000000,
        cpuTime: Math.floor(Math.random() * 500) + 100,
        networkCalls: Math.floor(Math.random() * 5) + 1,
        dataSize: {
          input: JSON.stringify(inputData).length,
          output: JSON.stringify(outputData).length,
        },
      },
      llmMetrics: node.data.label.includes('AI') || node.data.label.includes('Agent') ? {
        model: 'claude-sonnet-4',
        temperature: 0.7,
        inputTokens: Math.floor(Math.random() * 1000) + 500,
        outputTokens: Math.floor(Math.random() * 500) + 200,
        cost: (Math.random() * 0.05 + 0.01).toFixed(4),
      } : undefined,
      previousExecutions: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'completed' as const, duration: 450 },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'completed' as const, duration: 380 },
        { timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'failed' as const, duration: 250 },
      ],
      logs: [
        { timestamp: new Date(Date.now() - 1000).toISOString(), level: 'info', message: 'Node execution started' },
        { timestamp: new Date(Date.now() - 500).toISOString(), level: 'debug', message: 'Processing input data' },
        { timestamp: new Date().toISOString(), level: 'info', message: 'Node execution completed successfully' },
      ],
      isPausedAtBreakpoint: true,
    };
  };

  // Stepping control handlers
  const handleContinueExecution = () => {
    console.log('Continue execution from breakpoint');
    setPausedAtBreakpoint(false);
    setInspectorOpen(false);
    // Continue to next breakpoint or end of workflow
    handleContinueToBreakpoint();
  };

  const handleStepOver = () => {
    console.log('Step over to next node');
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    // Move to next step
    if (currentStep < workflow.nodes.length) {
      handleStep();
      // Capture state of next node
      const nextNode = workflow.nodes[currentStep];
      if (nextNode) {
        const stateSnapshot = captureStateSnapshot(nextNode, currentStep + 1, workflow);
        setInspectedNode(stateSnapshot);
      }
    }
  };

  const handleStepInto = () => {
    console.log('Step into next node (same as step over for now)');
    // In a real implementation, this would step into sub-workflows or functions
    // For now, same behavior as step over
    handleStepOver();
  };

  const handleShowInputDialog = () => {
    setInputDialogOpen(true);
  };

  const handleRunWithInput = (inputData: any) => {
    setWorkflowInputData(inputData);
    setExecutionStatus('running');
    setCompletedSteps(0);
    setExecutionEvents([]);
    setTimelineVisible(true);

    // Update selected workflow with execution status
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    // Simulate node-by-node execution
    workflow.nodes.forEach((node, index) => {
      setTimeout(() => {
        setCompletedSteps(index + 1);
        const currentTime = ((index + 1) * 0.8).toFixed(1);
        setExecutionTime(`${currentTime}s`);

        // Find incoming edge to this node and mark as active
        const incomingEdge = workflow.edges.find(e => e.target === node.id);
        if (incomingEdge && incomingEdge.data) {
          incomingEdge.data.executionState = 'active';
        }

        // Update node execution status to running
        workflow.nodes[index].data = {
          ...workflow.nodes[index].data,
          executionStatus: 'running'
        };

        // Add running event
        setExecutionEvents(prev => [...prev, {
          id: `${node.id}-running-${Date.now()}`,
          nodeId: node.id,
          nodeName: node.data.label,
          status: 'running',
          timestamp: `${currentTime}s`,
        }]);

        // Mark as completed after a brief delay
        setTimeout(() => {
          workflow.nodes[index].data = {
            ...workflow.nodes[index].data,
            executionStatus: 'completed'
          };

          // Mark incoming edge as completed
          if (incomingEdge && incomingEdge.data) {
            incomingEdge.data.executionState = 'completed';
          }

          // For decision nodes, randomly select a branch and mark that edge as active
          if (node.type === 'decisionNode') {
            const outgoingEdges = workflow.edges.filter(e => e.source === node.id);
            // Randomly pick compliant path (80% of time) or violation path
            const selectedEdge = Math.random() > 0.2 ? outgoingEdges[0] : outgoingEdges[1];
            if (selectedEdge && selectedEdge.data) {
              setTimeout(() => {
                selectedEdge.data!.executionState = 'active';
              }, 100);
            }
          } else {
            // Mark outgoing edge as active for next node
            const outgoingEdge = workflow.edges.find(e => e.source === node.id);
            if (outgoingEdge && outgoingEdge.data) {
              setTimeout(() => {
                outgoingEdge.data!.executionState = 'active';
              }, 100);
            }
          }

          // Add completed event
          setExecutionEvents(prev => [...prev, {
            id: `${node.id}-completed-${Date.now()}`,
            nodeId: node.id,
            nodeName: node.data.label,
            status: 'completed',
            timestamp: `${(parseFloat(currentTime) + 0.7).toFixed(1)}s`,
            duration: '0.7s',
            details: 'Execution successful'
          }]);

          // Complete execution on last node
          if (index === workflow.nodes.length - 1) {
            setExecutionStatus('completed');
          }
        }, 700);
      }, index * 800);
    });
  };

  const handlePause = () => setExecutionStatus('paused');
  const handleStop = () => {
    setExecutionStatus('idle');
    setCompletedSteps(0);
    setExecutionTime('0s');

    // Reset all node and edge statuses
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (workflow) {
      workflow.nodes.forEach(node => {
        node.data = { ...node.data, executionStatus: 'idle' };
      });
      workflow.edges.forEach(edge => {
        if (edge.data) {
          edge.data.executionState = 'idle';
        }
      });
    }
  };

  const handleViewWorkflow = (id: string) => {
    setSelectedWorkflowId(id);
  };

  const handleShowPreview = (id: string) => {
    setPreviewWorkflowId(id);
    setPreviewPopupOpen(true);
  };

  const handleShowTemplatePreview = (templateKey: string) => {
    const template = workflowTemplates[templateKey];
    if (template) {
      setPreviewWorkflowId(template.id);
      setPreviewPopupOpen(true);
    }
  };

  const handleSelectFromPreview = () => {
    if (previewWorkflowId) {
      setSelectedWorkflowId(previewWorkflowId);
      setExecutionStatus('idle');
      setCompletedSteps(0);
      setExecutionTime('0s');
      setNodeRuntimeState({});
    }
  };

  const handleInspectNode = (nodeId: string) => {
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    const allNodes = [...workflow.nodes, ...userAddedNodes];
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;

    const isAINode = node.data.label === 'AI Agent';
    const isCompleted = node.data.executionStatus === 'completed';

    // Production-grade mock data
    const mockData = {
      id: node.id,
      label: node.data.label,
      type: node.type || 'standard',
      executionStatus: node.data.executionStatus,
      executionTime: node.data.executionTime || '0.7s',
      attempts: node.data.executionStatus === 'failed' ? 2 : 1,
      inputData: {
        claimId: 'CLM-2025-001',
        amount: 15000,
        category: 'health',
        timestamp: new Date().toISOString(),
      },
      outputData: isCompleted ? {
        result: node.id === '3' ? 'compliant' : 'processed',
        confidence: 0.95,
        details: {
          checks: ['policy_validation', 'fraud_detection', 'amount_verification'],
          passed: true,
        },
      } : null,
      metadata: {
        startTime: new Date(Date.now() - 2300).toISOString(),
        endTime: isCompleted ? new Date().toISOString() : undefined,
        duration: 734, // milliseconds
        queueTime: 42, // milliseconds
        workerId: 'worker-a1b2c3d4-e5f6-7890',
        executionId: `exec-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
      resources: {
        memoryUsage: 45678912, // bytes (~43.5 MB)
        cpuTime: 680, // milliseconds
        networkCalls: isAINode ? 3 : 1,
        dataSize: {
          input: 2341, // bytes
          output: 15234, // bytes
        },
      },
      llmMetrics: isAINode ? {
        model: 'Claude Sonnet 4.5',
        temperature: 0.7,
        inputTokens: 1234,
        outputTokens: 567,
        cost: 0.0234,
        prompt: 'Analyze this insurance claim for compliance violations...',
      } : undefined,
      errorMessage: node.data.errorMessage,
      errorDetails: node.data.executionStatus === 'failed' ? {
        errorCode: 'RATE_LIMIT_EXCEEDED',
        stackTrace: 'Error: Rate limit exceeded\n  at APIClient.request (client.js:123)\n  at Agent.process (agent.js:456)',
        suggestedFix: 'Reduce request rate or increase API quota. Consider implementing exponential backoff.',
      } : undefined,
      logs: [
        { timestamp: '0.00s', level: 'INFO', message: 'Node execution started' },
        { timestamp: '0.04s', level: 'INFO', message: 'Loading input data' },
        { timestamp: '0.12s', level: 'INFO', message: 'Processing claim validation' },
        isAINode ? { timestamp: '0.45s', level: 'INFO', message: 'Calling Claude API' } : null,
        isCompleted ? { timestamp: '0.73s', level: 'SUCCESS', message: 'Node execution completed successfully' } : null,
      ].filter(Boolean) as Array<{ timestamp: string; level: string; message: string }>,
      previousExecutions: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'completed' as const, duration: 720 },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'completed' as const, duration: 698 },
        { timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'failed' as const, duration: 1200 },
        { timestamp: new Date(Date.now() - 14400000).toISOString(), status: 'completed' as const, duration: 745 },
        { timestamp: new Date(Date.now() - 18000000).toISOString(), status: 'completed' as const, duration: 710 },
      ],
    };

    setInspectedNode(mockData);
    setInspectorOpen(true);
  };

  const handleRerunFromNode = (nodeId: string) => {
    console.log('Rerunning from node:', nodeId);
    // TODO: Implement rerun from specific node
    setInspectorOpen(false);
  };

  const handleCanvasNodeClick = (event: React.MouseEvent, node: any) => {
    // Call the node's onInspect callback if it exists
    if (node.data && node.data.onInspect) {
      node.data.onInspect();
    }
  };

  const handleStepForward = () => {
    console.log('Step forward');
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    const nextStep = Math.min(currentStep + 1, workflow.nodes.length);
    setCurrentStep(nextStep);
    setPausedAtBreakpoint(false);

    // Update runtime state for all nodes
    const newRuntimeState: Record<string, NodeRuntimeState> = {};
    workflow.nodes.forEach((node, index) => {
      newRuntimeState[node.id] = {
        ...nodeRuntimeState[node.id],
        isCurrentStep: index === nextStep - 1,
        isPausedAtBreakpoint: false,
        stepNumber: index < nextStep ? index + 1 : undefined,
        isStepCompleted: index < nextStep - 1,
        isStepPending: index >= nextStep,
        hasBreakpoint: hasEnabledBreakpoint(node.id),
      };
    });
    setNodeRuntimeState(newRuntimeState);

    // Update edges to show execution path
    workflow.edges.forEach((edge) => {
      const sourceIndex = workflow.nodes.findIndex(n => n.id === edge.source);
      const targetIndex = workflow.nodes.findIndex(n => n.id === edge.target);

      if (edge.data) {
        edge.data.isInExecutionPath = sourceIndex < nextStep && targetIndex <= nextStep;
        edge.data.isCompletedPath = targetIndex < nextStep;
      }
    });
  };

  const handleStepBackward = () => {
    console.log('Step backward - time travel');
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    setPausedAtBreakpoint(false);

    // Update runtime state for all nodes
    const newRuntimeState: Record<string, NodeRuntimeState> = {};
    workflow.nodes.forEach((node, index) => {
      newRuntimeState[node.id] = {
        ...nodeRuntimeState[node.id],
        isCurrentStep: index === prevStep - 1,
        isPausedAtBreakpoint: false,
        stepNumber: index < prevStep ? index + 1 : undefined,
        isStepCompleted: index < prevStep - 1,
        isStepPending: index >= prevStep,
        hasBreakpoint: hasEnabledBreakpoint(node.id),
      };
    });
    setNodeRuntimeState(newRuntimeState);

    // Update edges to show execution path
    workflow.edges.forEach((edge) => {
      const sourceIndex = workflow.nodes.findIndex(n => n.id === edge.source);
      const targetIndex = workflow.nodes.findIndex(n => n.id === edge.target);

      if (edge.data) {
        edge.data.isInExecutionPath = sourceIndex < prevStep && targetIndex <= prevStep;
        edge.data.isCompletedPath = targetIndex < prevStep;
      }
    });
  };

  const handleContinueToBreakpoint = () => {
    console.log('Continue to next breakpoint');
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow || !breakpointsEnabled) return;

    // Find next breakpoint from current position
    let foundBreakpoint = false;
    for (let i = currentStep; i < workflow.nodes.length; i++) {
      const node = workflow.nodes[i];
      if (hasEnabledBreakpoint(node.id)) {
        // Found breakpoint - step to it
        setCurrentStep(i + 1);
        setPausedAtBreakpoint(true);

        // Update runtime state
        const newRuntimeState: Record<string, NodeRuntimeState> = {};
        workflow.nodes.forEach((n, index) => {
          newRuntimeState[n.id] = {
            ...nodeRuntimeState[n.id],
            isCurrentStep: index === i,
            isPausedAtBreakpoint: breakpointsEnabled && index === i,
            stepNumber: index <= i ? index + 1 : undefined,
            isStepCompleted: index < i,
            isStepPending: index > i,
            hasBreakpoint: hasEnabledBreakpoint(n.id),
          };
        });
        setNodeRuntimeState(newRuntimeState);

        // Update edges
        workflow.edges.forEach((edge) => {
          const sourceIndex = workflow.nodes.findIndex(n => n.id === edge.source);
          const targetIndex = workflow.nodes.findIndex(n => n.id === edge.target);
          if (edge.data) {
            edge.data.isInExecutionPath = sourceIndex <= i && targetIndex <= i + 1;
            edge.data.isCompletedPath = targetIndex <= i;
          }
        });

        // Capture state snapshot and open Node Inspector
        const stateSnapshot = captureStateSnapshot(node, i, workflow);
        setInspectedNode(stateSnapshot);

        foundBreakpoint = true;
        break;
      }
    }

    if (!foundBreakpoint) {
      console.log('No more breakpoints found');
    }
  };

  const handleToggleBreakpoints = (enabled: boolean) => {
    setBreakpointsEnabled(enabled);

    // When disabling breakpoints, clear ALL debug state (reset debugger)
    if (!enabled) {
      setPausedAtBreakpoint(false);

      // Clear all breakpoints
      setBreakpoints([]);

      // Reset current step
      setCurrentStep(0);

      // Clear ALL runtime state (step numbers, highlighting, checkmarks, etc.)
      setNodeRuntimeState({});
    }
  };

  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    setExecutionSpeed(speed);
  };

  const handleToggleNodeBreakpoint = (nodeId: string) => {
    // Allow setting breakpoints even when toggle is OFF
    // The toggle only controls whether execution pauses at them

    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    const allNodes = [...workflow.nodes, ...userAddedNodes];
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;

    setBreakpoints(prev => {
      const existing = prev.find(bp => bp.nodeId === nodeId);

      if (existing) {
        // Remove breakpoint
        console.log(`Removed breakpoint from node ${nodeId}`);
        return prev.filter(bp => bp.nodeId !== nodeId);
      } else {
        // Add breakpoint (default: before node, enabled)
        console.log(`Added breakpoint to node ${nodeId}`);
        return [...prev, {
          nodeId,
          nodeName: node.data.label,
          position: 'before' as const,
          enabled: true,
        }];
      }
    });

    // Update runtime state (shallow update for hasBreakpoint visual)
    setNodeRuntimeState(prevState => ({
      ...prevState,
      [nodeId]: {
        ...prevState[nodeId],
        hasBreakpoint: !breakpoints.some(bp => bp.nodeId === nodeId),
      }
    }));
  };

  // Breakpoint Panel Handlers

  // Toggle individual breakpoint enabled/disabled
  const handleToggleBreakpointEnabled = (nodeId: string, enabled: boolean) => {
    setBreakpoints(prev => prev.map(bp =>
      bp.nodeId === nodeId ? { ...bp, enabled } : bp
    ));

    // Update visual indicator
    setNodeRuntimeState(prevState => ({
      ...prevState,
      [nodeId]: {
        ...prevState[nodeId],
        hasBreakpoint: enabled,
      }
    }));
  };

  // Remove specific breakpoint
  const handleRemoveBreakpoint = (nodeId: string) => {
    setBreakpoints(prev => prev.filter(bp => bp.nodeId !== nodeId));

    setNodeRuntimeState(prevState => ({
      ...prevState,
      [nodeId]: {
        ...prevState[nodeId],
        hasBreakpoint: false,
      }
    }));
  };

  // Navigate to node when breakpoint clicked in panel
  const handleNavigateToNode = (nodeId: string) => {
    const workflow =
      deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
      Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId);
    if (!workflow) return;

    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node && node.data.onInspect) {
      node.data.onInspect();
    }
  };

  // Bulk enable all breakpoints
  const handleEnableAllBreakpoints = () => {
    setBreakpoints(prev => prev.map(bp => ({ ...bp, enabled: true })));

    // Update all visual indicators
    setNodeRuntimeState(prevState => {
      const newState = { ...prevState };
      breakpoints.forEach(bp => {
        newState[bp.nodeId] = {
          ...newState[bp.nodeId],
          hasBreakpoint: true,
        };
      });
      return newState;
    });
  };

  // Bulk disable all breakpoints
  const handleDisableAllBreakpoints = () => {
    setBreakpoints(prev => prev.map(bp => ({ ...bp, enabled: false })));

    // Update all visual indicators
    setNodeRuntimeState(prevState => {
      const newState = { ...prevState };
      breakpoints.forEach(bp => {
        newState[bp.nodeId] = {
          ...newState[bp.nodeId],
          hasBreakpoint: false,
        };
      });
      return newState;
    });
  };

  // Bulk remove all breakpoints
  const handleRemoveAllBreakpoints = () => {
    const nodeIds = breakpoints.map(bp => bp.nodeId);
    setBreakpoints([]);

    // Clear all visual indicators
    setNodeRuntimeState(prevState => {
      const newState = { ...prevState };
      nodeIds.forEach(nodeId => {
        newState[nodeId] = {
          ...newState[nodeId],
          hasBreakpoint: false,
        };
      });
      return newState;
    });
  };

  // Template workflow definitions
  const workflowTemplates: Record<string, Omit<DeployedWorkflow, 'lastRun' | 'totalRuns' | 'successRate' | 'avgExecutionTime'>> = {
    'claims-detection': {
      id: 'template-claims-detection',
      name: 'Claims Detection',
      version: '1.0.0',
      status: 'active',
      nodes: [
        {
          id: '1',
          type: 'standard',
          position: { x: 50, y: 200 },
          data: {
            label: 'Claim Input',
            subtitle: 'Claims API',
            icon: 'Memory',
            onInspect: () => handleInspectNode('1'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('1'),
          },
        },
        {
          id: '1b',
          type: 'standard',
          position: { x: 200, y: 200 },
          data: {
            label: 'Batch Claims',
            subtitle: 'Loop Items',
            icon: 'Loop',
            onInspect: () => handleInspectNode('1b'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('1b'),
          },
        },
        {
          id: '2',
          type: 'standard',
          position: { x: 350, y: 200 },
          data: {
            label: 'Extract Data',
            subtitle: 'OCR + NLP',
            icon: 'SmartToy',
            onInspect: () => handleInspectNode('2'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('2'),
          },
        },
        {
          id: '2b',
          type: 'standard',
          position: { x: 500, y: 200 },
          data: {
            label: 'AI Confidence',
            subtitle: 'Score: 0-100',
            icon: 'Psychology',
            onInspect: () => handleInspectNode('2b'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('2b'),
          },
        },
        {
          id: '3',
          type: 'decision',
          position: { x: 650, y: 180 },
          data: {
            label: 'Detect Misleading',
            onInspect: () => handleInspectNode('3'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('3'),
          },
        },
        {
          id: '4',
          type: 'standard',
          position: { x: 800, y: 60 },
          data: {
            label: 'Approve',
            subtitle: 'Auto-approve',
            icon: 'Security',
            onInspect: () => handleInspectNode('4'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('4'),
          },
        },
        {
          id: '5',
          type: 'standard',
          position: { x: 800, y: 340 },
          data: {
            label: 'Flag for Review',
            subtitle: 'Manual Check',
            icon: 'Security',
            onInspect: () => handleInspectNode('5'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('5'),
          },
        },
        {
          id: '6',
          type: 'standard',
          position: { x: 950, y: 200 },
          data: {
            label: 'Send Notifications',
            subtitle: 'Email + Slack',
            icon: 'Notifications',
            onInspect: () => handleInspectNode('6'),
            onToggleBreakpoint: () => handleToggleNodeBreakpoint('6'),
          },
        },
      ],
      edges: [
        { id: 'e1-1b', source: '1', target: '1b', data: {} },
        { id: 'e1b-2', source: '1b', target: '2', data: {} },
        { id: 'e2-2b', source: '2', target: '2b', data: {} },
        { id: 'e2b-3', source: '2b', target: '3', data: {} },
        { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', data: { branchLabel: 'valid' } },
        { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', data: { branchLabel: 'misleading' } },
        { id: 'e4-6', source: '4', target: '6', data: {} },
        { id: 'e5-6', source: '5', target: '6', data: {} },
      ],
    },
    'vendor-risk': {
      id: 'template-vendor-risk',
      name: 'Vendor Risk Assessment',
      version: '1.0.0',
      status: 'active',
      nodes: [
        {
          id: '1',
          type: 'standard',
          position: { x: 50, y: 200 },
          data: { label: 'Vendor Data', subtitle: 'CRM Integration', icon: 'Memory', onInspect: () => handleInspectNode('1'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1') },
        },
        {
          id: '1b',
          type: 'standard',
          position: { x: 200, y: 250 },
          data: { label: 'Financial Check', subtitle: 'Credit API', icon: 'IntegrationInstructions', onInspect: () => handleInspectNode('1b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1b') },
        },
        {
          id: '1c',
          type: 'standard',
          position: { x: 200, y: 100 },
          data: { label: 'Batch Vendors', subtitle: 'Loop Items', icon: 'Loop', onInspect: () => handleInspectNode('1c'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1c') },
        },
        {
          id: '2',
          type: 'standard',
          position: { x: 350, y: 200 },
          data: { label: 'Risk Scoring', subtitle: 'ML Model', icon: 'SmartToy', onInspect: () => handleInspectNode('2'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2') },
        },
        {
          id: '3',
          type: 'decision',
          position: { x: 500, y: 180 },
          data: { label: 'Risk Level', onInspect: () => handleInspectNode('3'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('3') },
        },
        {
          id: '4',
          type: 'standard',
          position: { x: 650, y: 60 },
          data: { label: 'Low Risk', subtitle: 'Auto-approve', icon: 'Security', onInspect: () => handleInspectNode('4'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('4') },
        },
        {
          id: '5',
          type: 'standard',
          position: { x: 650, y: 200 },
          data: { label: 'Medium Risk', subtitle: 'Manager Review', icon: 'Security', onInspect: () => handleInspectNode('5'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5') },
        },
        {
          id: '5b',
          type: 'standard',
          position: { x: 650, y: 340 },
          data: { label: 'High Risk', subtitle: 'Full Audit', icon: 'Security', onInspect: () => handleInspectNode('5b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5b') },
        },
        {
          id: '6',
          type: 'standard',
          position: { x: 850, y: 200 },
          data: { label: 'Audit Trail', subtitle: 'Log Decision', icon: 'Settings', onInspect: () => handleInspectNode('6'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('6') },
        },
      ],
      edges: [
        { id: 'e1-1b', source: '1', target: '1b', data: {} },
        { id: 'e1-1c', source: '1', target: '1c', data: {} },
        { id: 'e1b-2', source: '1b', target: '2', data: {} },
        { id: 'e1c-2', source: '1c', target: '2', data: {} },
        { id: 'e2-3', source: '2', target: '3', data: {} },
        { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', data: { branchLabel: 'low' } },
        { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', data: { branchLabel: 'medium' } },
        { id: 'e3-5b', source: '3', target: '5b', sourceHandle: 'false', data: { branchLabel: 'high' } },
        { id: 'e4-6', source: '4', target: '6', data: {} },
        { id: 'e5-6', source: '5', target: '6', data: {} },
        { id: 'e5b-6', source: '5b', target: '6', data: {} },
      ],
    },
    'access-review': {
      id: 'template-access-review',
      name: 'Access Review Automation',
      version: '1.0.0',
      status: 'active',
      nodes: [
        {
          id: '1',
          type: 'standard',
          position: { x: 50, y: 200 },
          data: { label: 'User Access', subtitle: 'IAM System', icon: 'Memory', onInspect: () => handleInspectNode('1'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1') },
        },
        {
          id: '1b',
          type: 'standard',
          position: { x: 180, y: 200 },
          data: { label: 'Batch Users', subtitle: 'Loop Items', icon: 'Loop', onInspect: () => handleInspectNode('1b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1b') },
        },
        {
          id: '2',
          type: 'standard',
          position: { x: 310, y: 200 },
          data: { label: 'Policy Check', subtitle: 'RBAC Validation', icon: 'SmartToy', onInspect: () => handleInspectNode('2'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2') },
        },
        {
          id: '3',
          type: 'decision',
          position: { x: 440, y: 180 },
          data: { label: 'Access Valid', onInspect: () => handleInspectNode('3'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('3') },
        },
        {
          id: '4',
          type: 'standard',
          position: { x: 580, y: 80 },
          data: { label: 'Maintain', subtitle: 'Keep Access', icon: 'Security', onInspect: () => handleInspectNode('4'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('4') },
        },
        {
          id: '5',
          type: 'standard',
          position: { x: 580, y: 300 },
          data: { label: 'Revoke', subtitle: 'Remove Access', icon: 'Security', onInspect: () => handleInspectNode('5'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5') },
        },
        {
          id: '5b',
          type: 'standard',
          position: { x: 700, y: 300 },
          data: { label: 'Request Approval', subtitle: 'Manager Sign-off', icon: 'CheckCircle', onInspect: () => handleInspectNode('5b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5b') },
        },
        {
          id: '6',
          type: 'standard',
          position: { x: 720, y: 190 },
          data: { label: 'Send Notification', subtitle: 'Email Users', icon: 'Notifications', onInspect: () => handleInspectNode('6'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('6') },
        },
        {
          id: '7',
          type: 'standard',
          position: { x: 850, y: 190 },
          data: { label: 'Generate Report', subtitle: 'Compliance Log', icon: 'Settings', onInspect: () => handleInspectNode('7'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('7') },
        },
        {
          id: '8',
          type: 'standard',
          position: { x: 980, y: 190 },
          data: { label: 'Archive Results', subtitle: 'Database Store', icon: 'Memory', onInspect: () => handleInspectNode('8'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('8') },
        },
      ],
      edges: [
        { id: 'e1-1b', source: '1', target: '1b', data: {} },
        { id: 'e1b-2', source: '1b', target: '2', data: {} },
        { id: 'e2-3', source: '2', target: '3', data: {} },
        { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', data: { branchLabel: 'valid' } },
        { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', data: { branchLabel: 'invalid' } },
        { id: 'e5-5b', source: '5', target: '5b', data: {} },
        { id: 'e4-6', source: '4', target: '6', data: {} },
        { id: 'e5b-6', source: '5b', target: '6', data: {} },
        { id: 'e6-7', source: '6', target: '7', data: {} },
        { id: 'e7-8', source: '7', target: '8', data: {} },
      ],
    },
    'policy-violation': {
      id: 'template-policy-violation',
      name: 'Policy Violation Detection',
      version: '1.0.0',
      status: 'active',
      nodes: [
        {
          id: '1',
          type: 'standard',
          position: { x: 50, y: 200 },
          data: { label: 'Activity Log', subtitle: 'SIEM Feed', icon: 'Memory', onInspect: () => handleInspectNode('1'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1') },
        },
        {
          id: '2',
          type: 'standard',
          position: { x: 200, y: 200 },
          data: { label: 'Pattern Match', subtitle: 'Rule Engine', icon: 'SmartToy', onInspect: () => handleInspectNode('2'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2') },
        },
        {
          id: '2b',
          type: 'standard',
          position: { x: 350, y: 200 },
          data: { label: 'Classify Severity', subtitle: 'Low/Med/High', icon: 'Psychology', onInspect: () => handleInspectNode('2b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2b') },
        },
        {
          id: '3',
          type: 'decision',
          position: { x: 500, y: 180 },
          data: { label: 'Violation', onInspect: () => handleInspectNode('3'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('3') },
        },
        {
          id: '4',
          type: 'standard',
          position: { x: 650, y: 60 },
          data: { label: 'Clear', subtitle: 'No Action', icon: 'Security', onInspect: () => handleInspectNode('4'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('4') },
        },
        {
          id: '5',
          type: 'standard',
          position: { x: 650, y: 200 },
          data: { label: 'Alert', subtitle: 'Send Notification', icon: 'Notifications', onInspect: () => handleInspectNode('5'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5') },
        },
        {
          id: '5b',
          type: 'standard',
          position: { x: 650, y: 340 },
          data: { label: 'Auto-Remediate', subtitle: 'Fix Policy', icon: 'Settings', onInspect: () => handleInspectNode('5b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5b') },
        },
        {
          id: '6',
          type: 'standard',
          position: { x: 850, y: 200 },
          data: { label: 'Log Incident', subtitle: 'Audit Trail', icon: 'Memory', onInspect: () => handleInspectNode('6'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('6') },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: {} },
        { id: 'e2-2b', source: '2', target: '2b', data: {} },
        { id: 'e2b-3', source: '2b', target: '3', data: {} },
        { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', data: { branchLabel: 'compliant' } },
        { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', data: { branchLabel: 'minor' } },
        { id: 'e3-5b', source: '3', target: '5b', sourceHandle: 'false', data: { branchLabel: 'critical' } },
        { id: 'e4-6', source: '4', target: '6', data: {} },
        { id: 'e5-6', source: '5', target: '6', data: {} },
        { id: 'e5b-6', source: '5b', target: '6', data: {} },
      ],
    },
    'evidence-collection': {
      id: 'template-evidence-collection',
      name: 'Evidence Collection',
      version: '1.0.0',
      status: 'active',
      nodes: [
        {
          id: '1',
          type: 'standard',
          position: { x: 50, y: 200 },
          data: { label: 'Audit Request', subtitle: 'Trigger Event', icon: 'Memory', onInspect: () => handleInspectNode('1'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('1') },
        },
        {
          id: '2',
          type: 'standard',
          position: { x: 200, y: 200 },
          data: { label: 'Gather Logs', subtitle: 'Multi-source', icon: 'IntegrationInstructions', onInspect: () => handleInspectNode('2'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2') },
        },
        {
          id: '2b',
          type: 'standard',
          position: { x: 350, y: 200 },
          data: { label: 'Validate Data', subtitle: 'Integrity Check', icon: 'CheckCircle', onInspect: () => handleInspectNode('2b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('2b') },
        },
        {
          id: '3',
          type: 'standard',
          position: { x: 500, y: 200 },
          data: { label: 'Package', subtitle: 'Archive & Sign', icon: 'Security', onInspect: () => handleInspectNode('3'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('3') },
        },
        {
          id: '3b',
          type: 'standard',
          position: { x: 650, y: 200 },
          data: { label: 'Compliance Check', subtitle: 'SOC2/ISO27001', icon: 'Security', onInspect: () => handleInspectNode('3b'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('3b') },
        },
        {
          id: '4',
          type: 'standard',
          position: { x: 800, y: 200 },
          data: { label: 'Store', subtitle: 'Secure Storage', icon: 'Memory', onInspect: () => handleInspectNode('4'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('4') },
        },
        {
          id: '5',
          type: 'standard',
          position: { x: 950, y: 200 },
          data: { label: 'Generate Receipt', subtitle: 'Audit Trail', icon: 'Settings', onInspect: () => handleInspectNode('5'), onToggleBreakpoint: () => handleToggleNodeBreakpoint('5') },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', data: {} },
        { id: 'e2-2b', source: '2', target: '2b', data: {} },
        { id: 'e2b-3', source: '2b', target: '3', data: {} },
        { id: 'e3-3b', source: '3', target: '3b', data: {} },
        { id: 'e3b-4', source: '3b', target: '4', data: {} },
        { id: 'e4-5', source: '4', target: '5', data: {} },
      ],
    },
  };

  // Handler to load template workflow
  const handleLoadTemplate = (templateKey: string) => {
    const template = workflowTemplates[templateKey];
    if (!template) return;

    // Select the template workflow
    setSelectedWorkflowId(template.id);

    // Reset execution state
    setExecutionStatus('idle');
    setCompletedSteps(0);
    setExecutionTime('0s');
    setNodeRuntimeState({});
  };

  const selectedWorkflow =
    deployedWorkflows.find(w => w.id === selectedWorkflowId) ||
    Object.values(workflowTemplates).find(t => t.id === selectedWorkflowId) ||
    deployedWorkflows[0];

  // Enrich nodes with runtime state (memoized to prevent React Flow warnings)
  // Merge template nodes + user-added nodes, then enrich all with runtime state
  const enrichedNodes = useMemo(
    () => {
      if (!selectedWorkflow) return [];
      const allNodes = [...selectedWorkflow.nodes, ...userAddedNodes];
      return allNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          ...nodeRuntimeState[node.id], // Merge runtime state
          onInspect: () => handleInspectNode(node.id),
          onToggleBreakpoint: () => handleToggleNodeBreakpoint(node.id),
        },
      }));
    },
    [selectedWorkflowId, userAddedNodes, JSON.stringify(nodeRuntimeState)] // Use stable stringified comparison
  );

  // Early return if no workflow selected (prevents crashes)
  if (!selectedWorkflow) {
    return (
      <Box data-testid="production-environment" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f0f1e' }}>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          No workflows available. Deploy a workflow from Prototype Station.
        </Typography>
      </Box>
    );
  }

  return (
    <Box data-testid="production-environment" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f0f1e' }}>
      {/* Header with Auth Banner and Evaluations Button */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Logged in as:
        </Typography>
        <Chip label="Demo User" size="small" color="primary" />
        <Chip label="Data Scientist" size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          size="small"
          startIcon={<History />}
          onClick={() => setHistoryDrawerOpen(true)}
          sx={{
            borderColor: 'rgba(129, 140, 248, 0.5)',
            color: '#818cf8',
            mr: 1,
            '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)', borderColor: '#818cf8' },
          }}
        >
          History
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<BugReport />}
          onClick={() => setBreakpointsPanelOpen(true)}
          sx={{
            borderColor: 'rgba(239, 68, 68, 0.5)',
            color: '#ef4444',
            mr: 1,
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
          }}
        >
          Breakpoints ({breakpoints.length})
        </Button>
        <EvaluationsButton onClick={() => setEvaluationsDrawerOpen(true)} />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
        {/* Workflow Selector Sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={workflowSidebarOpen}
          sx={{
            width: workflowSidebarOpen ? 320 : 0,
            flexShrink: 0,
            display: workflowSidebarOpen ? 'block' : 'none',
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
              bgcolor: '#0f0f1e',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              top: 'auto',
              position: 'relative',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              Workflows
            </Typography>

            {/* Workflow Selector Button */}
            <Button
              fullWidth
              variant="outlined"
              endIcon={<KeyboardArrowDown />}
              onClick={(e) => setWorkflowMenuAnchor(e.currentTarget)}
              sx={{
                justifyContent: 'space-between',
                textAlign: 'left',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': { borderColor: 'rgba(99, 102, 241, 0.5)', bgcolor: 'rgba(99, 102, 241, 0.05)' },
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedWorkflow.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  v{selectedWorkflow.version}
                </Typography>
              </Box>
            </Button>

            {/* Workflow Cards Menu */}
            <Menu
              anchorEl={workflowMenuAnchor}
              open={Boolean(workflowMenuAnchor)}
              onClose={() => setWorkflowMenuAnchor(null)}
              PaperProps={{
                sx: {
                  bgcolor: 'rgba(17, 24, 39, 0.98)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  maxHeight: 500,
                  width: 320,
                  backdropFilter: 'blur(8px)',
                },
              }}
            >
              {deployedWorkflows.map((workflow) => (
                <MenuItem
                  key={workflow.id}
                  onClick={() => {
                    setWorkflowMenuAnchor(null);
                    handleShowPreview(workflow.id);
                  }}
                  sx={{
                    p: 0,
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                >
                  <Box sx={{ width: '100%', p: 1.5 }}>
                    <WorkflowCard
                      title={workflow.name}
                      description={`v${workflow.version} • ${workflow.totalRuns > 0 ? `${workflow.successRate}% success` : 'Template'}`}
                      variant={workflow.status === 'active' ? 'primary' : 'default'}
                      onClick={() => {}}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            {/* Selected Workflow Stats */}
            {selectedWorkflow && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                  SELECTED WORKFLOW
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {selectedWorkflow.name}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}>
                      RUNS
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: 13 }}>
                      {selectedWorkflow.totalRuns.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}>
                      SUCCESS
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#22c55e', fontSize: 13 }}>
                      {selectedWorkflow.successRate}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}>
                      AVG TIME
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: 13 }}>
                      {selectedWorkflow.avgExecutionTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}>
                      VERSION
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontSize: 13 }}>
                      {selectedWorkflow.version}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Component Palette Section */}
            <Box sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="subtitle2" sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2,
                px: 1,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Workflow Components
              </Typography>
              <ComponentPalette onDragStart={handleComponentDragStart} />
            </Box>
          </Box>
        </Drawer>

        {/* Toggle Sidebar Button */}
        <IconButton
          onClick={() => setWorkflowSidebarOpen(!workflowSidebarOpen)}
          sx={{
            position: 'absolute',
            left: workflowSidebarOpen ? 320 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1300,
            bgcolor: 'rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.3)' },
            transition: 'left 0.3s',
          }}
        >
          {workflowSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>

        {/* Workflow Canvas - Read-Only Mode */}
        <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: '#0f0f1e', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Workflow Templates Bar */}
          <Box
            sx={{
              width: '100%',
              pt: 1.5,
              pb: 1.5,
              px: 3,
              bgcolor: 'rgba(17, 24, 39, 0.98)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 3,
              overflowX: 'auto',
              flexShrink: 0,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(99, 102, 241, 0.3)',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.5)',
                },
              },
            }}
          >
            <WorkflowCard
              title="Claims Detection"
              description="Detect misleading compliance claims"
              variant="primary"
              onClick={() => handleShowTemplatePreview('claims-detection')}
            />
            <WorkflowCard
              title="Vendor Risk"
              description="Automated vendor risk assessment"
              onClick={() => handleShowTemplatePreview('vendor-risk')}
            />
            <WorkflowCard
              title="Access Review"
              description="Quarterly access review automation"
              onClick={() => handleShowTemplatePreview('access-review')}
            />
            <WorkflowCard
              title="Policy Violation"
              description="Real-time policy violation detection"
              onClick={() => handleShowTemplatePreview('policy-violation')}
            />
            <WorkflowCard
              title="Evidence Collection"
              description="Automated evidence gathering workflow"
              onClick={() => handleShowTemplatePreview('evidence-collection')}
            />
          </Box>

          {/* Canvas Container - fills remaining space */}
          <Box sx={{ position: 'relative', flexGrow: 1, overflow: 'hidden' }}>
            <ExecutionControlBar
              workflowName={selectedWorkflow.name}
              status={executionStatus}
              onRun={handleShowInputDialog}
              onPause={handlePause}
              onStop={handleStop}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onContinueToBreakpoint={handleContinueToBreakpoint}
              executionTime={executionTime}
              completedSteps={completedSteps}
              totalSteps={selectedWorkflow.nodes.length}
              currentStep={currentStep}
              breakpointsEnabled={breakpointsEnabled}
              onToggleBreakpoints={handleToggleBreakpoints}
              executionSpeed={executionSpeed}
              onSpeedChange={handleSpeedChange}
            />
            <WorkflowCanvas
            key={selectedWorkflowId}
            isReadOnly={false}
            showComponentPalette={false}
            showWorkflowCards={false}
            initialNodes={enrichedNodes}
            initialEdges={selectedWorkflow.edges}
            onNodeClick={handleCanvasNodeClick}
            onNodesChange={handleNodesChange}
            externalDraggedItem={draggedComponent}
            onClearDraggedItem={() => setDraggedComponent(null)}
          />
            {/* Execution Timeline */}
            {timelineVisible && (executionStatus === 'running' || executionStatus === 'completed' || executionEvents.length > 0) && (
              <ExecutionTimeline
                events={executionEvents}
                onClose={() => setTimelineVisible(false)}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Evaluations Drawer */}
      <EvaluationsDrawer
        open={evaluationsDrawerOpen}
        onClose={() => setEvaluationsDrawerOpen(false)}
        environment="production"
        workflowId={selectedWorkflowId}
        workflowName={selectedWorkflow.name}
      />

      {/* Workflow Input Dialog */}
      <WorkflowInputDialog
        open={inputDialogOpen}
        onClose={() => setInputDialogOpen(false)}
        onRun={handleRunWithInput}
        workflowName={selectedWorkflow.name}
      />

      {/* Node Inspector Drawer */}
      <NodeInspectorDrawer
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        nodeData={inspectedNode}
        onRerun={handleRerunFromNode}
        onContinue={handleContinueExecution}
        onStepOver={handleStepOver}
        onStepInto={handleStepInto}
      />

      {/* Execution History Drawer */}
      <ExecutionHistoryDrawer
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        workflowName={selectedWorkflow.name}
      />

      <BreakpointsPanel
        open={breakpointsPanelOpen}
        onClose={() => setBreakpointsPanelOpen(false)}
        breakpoints={breakpoints}
        onToggleBreakpoint={handleToggleBreakpointEnabled}
        onRemoveBreakpoint={handleRemoveBreakpoint}
        onNavigateToNode={handleNavigateToNode}
        onEnableAll={handleEnableAllBreakpoints}
        onDisableAll={handleDisableAllBreakpoints}
        onRemoveAll={handleRemoveAllBreakpoints}
      />

      {/* Workflow Preview Popup */}
      <WorkflowPreviewPopup
        open={previewPopupOpen}
        onClose={() => setPreviewPopupOpen(false)}
        onSelect={handleSelectFromPreview}
        workflow={previewWorkflowId ? (
          deployedWorkflows.find(w => w.id === previewWorkflowId) ||
          Object.values(workflowTemplates).find(t => t.id === previewWorkflowId)
            ? {
                ...Object.values(workflowTemplates).find(t => t.id === previewWorkflowId)!,
                lastRun: 'Never',
                totalRuns: 0,
                successRate: 0,
                avgExecutionTime: 'N/A',
              }
            : undefined
        ) : undefined}
      />

      {/* Chatbot Widget */}
      <ChatbotWidget
        onWorkflowPreview={handleShowPreview}
        onComponentInfo={(componentId) => console.log('Component info:', componentId)}
      />

    </Box>
  );
}
