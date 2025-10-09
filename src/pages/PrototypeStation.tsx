import { useState, useCallback, useEffect } from 'react';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Node, Edge } from 'reactflow';
import WorkflowCanvas from './WorkflowCanvas';
import WorkflowCard from '../components/workflow/WorkflowCard';
import PrototypeToolbar from '../components/workflow/PrototypeToolbar';
import ExecutionPanel from '../components/workflow/ExecutionPanel';
import EvaluationsDrawer from '../components/workflow/EvaluationsDrawer';
import { saveWorkflow, loadWorkflow, exportWorkflowJSON } from '../utils/workflowStorage';
import { workflowTemplates } from '../data/workflowTemplates';

interface ExecutionLog {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  message: string;
  status: 'running' | 'success' | 'error';
}

const PROTOTYPE_STORAGE_KEY = 'prototype-workflow-state';

export default function PrototypeStation() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [clearDialog, setClearDialog] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [evaluationsDrawerOpen, setEvaluationsDrawerOpen] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(PROTOTYPE_STORAGE_KEY);
    if (savedState) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedState);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    }
  }, []);

  // Persist state whenever nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges]);

  const handleSave = useCallback(() => {
    saveWorkflow(nodes, edges);
    setSnackbar({ open: true, message: 'Workflow saved successfully!', severity: 'success' });
  }, [nodes, edges]);

  const handleLoad = useCallback(() => {
    const loaded = loadWorkflow();
    if (loaded) {
      setNodes(loaded.nodes);
      setEdges(loaded.edges);
      setSnackbar({ open: true, message: `Loaded workflow: ${loaded.name}`, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'No saved workflow found', severity: 'error' });
    }
  }, []);

  const handleRun = useCallback(async () => {
    if (nodes.length === 0) {
      setSnackbar({ open: true, message: 'Add some nodes to execute', severity: 'error' });
      return;
    }

    setIsExecuting(true);
    setExecutionLogs([]);
    setExecutionProgress(0);

    // Simulate execution
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const timestamp = new Date().toLocaleTimeString();

      // Add running log
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp,
          nodeId: node.id,
          nodeName: node.data.label,
          message: `Executing ${node.data.label}...`,
          status: 'running',
        },
      ]);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add success log
      setExecutionLogs((prev) => [
        ...prev.slice(0, -1),
        {
          timestamp,
          nodeId: node.id,
          nodeName: node.data.label,
          message: `Completed successfully (42 items processed)`,
          status: 'success',
        },
      ]);

      setExecutionProgress(((i + 1) / nodes.length) * 100);
    }

    // Final summary
    setExecutionLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        nodeId: 'summary',
        nodeName: 'Workflow',
        message: `✓ Execution completed - ${nodes.length} nodes processed`,
        status: 'success',
      },
    ]);

    setIsExecuting(false);
    setSnackbar({ open: true, message: 'Test execution completed!', severity: 'success' });
  }, [nodes]);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setExecutionLogs([]);
    localStorage.removeItem(PROTOTYPE_STORAGE_KEY);
    setClearDialog(false);
    setSnackbar({ open: true, message: 'Canvas cleared', severity: 'success' });
  }, []);

  const handleExport = useCallback(() => {
    exportWorkflowJSON(nodes, edges);
    setSnackbar({ open: true, message: 'Workflow exported as JSON', severity: 'success' });
  }, [nodes, edges]);

  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = workflowTemplates[templateId];
    if (template) {
      setNodes(template.nodes);
      setEdges(template.edges);
      setExecutionLogs([]);
      setSnackbar({ open: true, message: `Loaded template: ${template.name}`, severity: 'success' });
    }
  }, []);

  const handleLoadWorkflowCard = useCallback((templateId: string) => {
    handleLoadTemplate(templateId);
  }, [handleLoadTemplate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PrototypeToolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onRun={handleRun}
        onClear={() => setClearDialog(true)}
        onExport={handleExport}
        onLoadTemplate={handleLoadTemplate}
        onOpenEvaluations={() => setEvaluationsDrawerOpen(true)}
      />

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
          onClick={() => handleLoadTemplate('claims-detection')}
        />
        <WorkflowCard
          title="Vendor Risk"
          description="Automated vendor risk assessment"
          onClick={() => handleLoadTemplate('vendor-risk')}
        />
        <WorkflowCard
          title="Access Review"
          description="Quarterly access review automation"
          onClick={() => handleLoadTemplate('access-review')}
        />
        <WorkflowCard
          title="Policy Violation"
          description="Real-time policy violation detection"
          onClick={() => handleLoadTemplate('policy-violation')}
        />
        <WorkflowCard
          title="Evidence Collection"
          description="Automated evidence gathering workflow"
          onClick={() => handleLoadTemplate('evidence-collection')}
        />
      </Box>

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <WorkflowCanvas
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={(newNodes) => setNodes(newNodes as Node[])}
          onEdgesChange={(newEdges) => setEdges(newEdges as Edge[])}
          onLoadWorkflowCard={handleLoadWorkflowCard}
        />
      </Box>

      <ExecutionPanel
        isExecuting={isExecuting}
        logs={executionLogs}
        progress={executionProgress}
      />

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialog} onClose={() => setClearDialog(false)}>
        <DialogTitle>Clear Canvas?</DialogTitle>
        <DialogContent>
          This will remove all nodes and edges from the canvas. This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClear} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Evaluations Drawer */}
      <EvaluationsDrawer
        open={evaluationsDrawerOpen}
        onClose={() => setEvaluationsDrawerOpen(false)}
        environment="prototype"
        workflowId="prototype-workflow"
        workflowName="Current Prototype Workflow"
      />
    </Box>
  );
}

