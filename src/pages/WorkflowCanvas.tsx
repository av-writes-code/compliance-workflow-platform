import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  addEdge,
  reconnectEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  ReactFlowInstance,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/reactflow-custom.css';
import { Box, Drawer, Typography, TextField, Button, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import WorkflowCard from '../components/workflow/WorkflowCard';
import ComponentPalette from '../components/workflow/ComponentPalette';
import { StandardNode, DecisionNode, CircularNode, GhostNode } from '../components/workflow/CustomNode';
import EditableEdge from '../components/workflow/EditableEdge';
import { SmartToy, Memory, IntegrationInstructions } from '@mui/icons-material';

// Define nodeTypes and edgeTypes outside component to prevent recreation
const nodeTypes: NodeTypes = {
  standard: StandardNode,
  decision: DecisionNode,
  circular: CircularNode,
  ghost: GhostNode,
};

const edgeTypes: EdgeTypes = {
  editable: EditableEdge,
};

const initialNodes: Node[] = [
  // Trigger
  {
    id: '1',
    type: 'standard',
    position: { x: 50, y: 150 },
    data: {
      label: 'Execute Workflow',
      subtitle: 'manual trigger',
      icon: 'SmartToy',
    },
  },
  // AI Agent
  {
    id: '2',
    type: 'standard',
    position: { x: 320, y: 150 },
    data: {
      label: 'AI Agent',
      subtitle: 'tools agent',
      icon: 'SmartToy',
    },
  },
  // Loop node
  {
    id: '3',
    type: 'standard',
    position: { x: 590, y: 150 },
    data: {
      label: 'Loop Over Items',
      subtitle: 'iteration',
      icon: 'Memory',
      showSubNodes: false,
    },
  },
  // Decision node
  {
    id: '4',
    type: 'decision',
    position: { x: 880, y: 120 },
    data: {
      label: 'If',
    },
  },
  // Integration
  {
    id: '5',
    type: 'standard',
    position: { x: 1100, y: 150 },
    data: {
      label: 'Slack',
      subtitle: 'integration',
      icon: 'IntegrationInstructions',
    },
  },
];

const initialEdges: Edge[] = [
  // Simple linear flow
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 }, zIndex: 1000 },
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 }, zIndex: 1000 },
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 }, zIndex: 1000 },
  { id: 'e4-5', source: '4', target: '5', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 }, zIndex: 1000 },
];

interface WorkflowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onLoadWorkflowCard?: (templateId: string) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  isReadOnly?: boolean;
  showComponentPalette?: boolean;
  showWorkflowCards?: boolean;
  externalDraggedItem?: any;
  onClearDraggedItem?: () => void;
}

export default function WorkflowCanvas({
  initialNodes: propInitialNodes,
  initialEdges: propInitialEdges,
  onNodesChange: propOnNodesChange,
  onEdgesChange: propOnEdgesChange,
  onLoadWorkflowCard,
  onNodeClick: propOnNodeClick,
  isReadOnly = false,
  showComponentPalette = true,
  showWorkflowCards = true,
  externalDraggedItem,
  onClearDraggedItem,
}: WorkflowCanvasProps = {}) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(propInitialNodes || initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(propInitialEdges || initialEdges);

  // Sync with prop changes when parent updates nodes/edges
  // Also inject isReadOnly into node data
  useEffect(() => {
    if (propInitialNodes) {
      const nodesWithReadOnly = propInitialNodes.map(node => ({
        ...node,
        data: { ...node.data, isReadOnly },
      }));
      setNodes(nodesWithReadOnly);
    }
  }, [propInitialNodes, setNodes, isReadOnly]);

  useEffect(() => {
    if (propInitialEdges) {
      setEdges(propInitialEdges);
    }
  }, [propInitialEdges, setEdges]);

  // Notify parent whenever nodes change (but only call when nodes actually change)
  const prevNodesRef = useRef<Node[]>([]);
  useEffect(() => {
    // Only notify if nodes array actually changed (not just reference)
    const nodesChanged = nodes.length !== prevNodesRef.current.length ||
      nodes.some((node, i) => node.id !== prevNodesRef.current[i]?.id);

    if (nodesChanged && propOnNodesChange) {
      propOnNodesChange(nodes);
      prevNodesRef.current = nodes;
    }
  }, [nodes, propOnNodesChange]);

  const onEdgesChange = propOnEdgesChange
    ? (changes: any) => {
        onEdgesChangeInternal(changes);
        propOnEdgesChange(edges);
      }
    : onEdgesChangeInternal;
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<{ nodeId: string; handleType: string } | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      // Check if connecting to a ghost node - if so, replace ghost with this connection
      const targetNode = nodes.find(n => n.id === params.target);
      if (targetNode?.type === 'ghost') {
        // Remove the ghost node and its temporary edge
        setNodes((nds) => nds.filter(n => n.id !== params.target));
        setEdges((eds) => eds.filter(e => e.target !== params.target));
      }

      const newEdge = {
        ...params,
        animated: true,
        type: 'editable',
        style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 },
        zIndex: 1000,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes, setNodes]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const onConnectStart = useCallback((_: React.MouseEvent | React.TouchEvent, { nodeId, handleType }: any) => {
    setConnectingNodeId({ nodeId, handleType });
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId || !reactFlowInstance || !reactFlowWrapper.current) return;

      const target = event.target as Element;

      // Check if target is NOT a node (more robust than checking for pane)
      const isNode = target.closest('.react-flow__node');
      const isHandle = target.closest('.react-flow__handle');

      // Debug logging - remove after verification
      console.log('Connection ended:', {
        target: target.className,
        isNode: !!isNode,
        isHandle: !!isHandle,
        handleType: connectingNodeId.handleType
      });

      // Create ghost node if: source handle + not connecting to node/handle
      if (!isNode && !isHandle && connectingNodeId.handleType === 'source') {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : (event as MouseEvent).clientX;
        const clientY = 'changedTouches' in event ? event.changedTouches[0].clientY : (event as MouseEvent).clientY;

        const position = reactFlowInstance.project({
          x: clientX - reactFlowBounds.left,
          y: clientY - reactFlowBounds.top,
        });

        const ghostNodeId = `ghost-${Date.now()}`;
        const ghostNode: Node = {
          id: ghostNodeId,
          type: 'ghost',
          position,
          data: { label: 'Connect me' },
        };

        const temporaryEdge: Edge = {
          id: `temp-${connectingNodeId.nodeId}-${ghostNodeId}`,
          source: connectingNodeId.nodeId,
          target: ghostNodeId,
          type: 'editable',
          animated: false,
          style: {
            stroke: 'rgba(99, 102, 241, 0.5)',
            strokeWidth: 1.5,
            strokeDasharray: '5,5',
            zIndex: 1000
          },
          zIndex: 1000,
          data: { isTemporary: true },
        };

        console.log('Creating ghost node at:', position);
        setNodes((nds) => [...nds, ghostNode]);
        setEdges((eds) => [...eds, temporaryEdge]);
      }

      setConnectingNodeId(null);
    },
    [connectingNodeId, reactFlowInstance, setNodes, setEdges, reactFlowWrapper]
  );

  const onDragStart = (item: any) => {
    setDraggedItem(item);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const currentDraggedItem = externalDraggedItem || draggedItem;
      if (!reactFlowWrapper.current || !reactFlowInstance || !currentDraggedItem) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeType = currentDraggedItem.type === 'decision' ? 'decision' :
                       currentDraggedItem.type === 'conditional' ? 'standard' : 'standard';

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: currentDraggedItem.label,
          subtitle: currentDraggedItem.type,
          icon: currentDraggedItem.icon,
          showSubNodes: currentDraggedItem.type === 'agent' || currentDraggedItem.type === 'chat-model',
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setDraggedItem(null);
      if (onClearDraggedItem) {
        onClearDraggedItem();
      }
    },
    [reactFlowInstance, nodes, draggedItem, externalDraggedItem, onClearDraggedItem, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // If parent provides custom handler, use it
    if (propOnNodeClick) {
      propOnNodeClick(event, node);
      return;
    }

    // Otherwise, default behavior (config drawer)
    if (!isReadOnly) {
      setSelectedNode(node);
      setSelectedEdge(null);
      setConfigDrawerOpen(true);
    }
  }, [propOnNodeClick, isReadOnly]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setConfigDrawerOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleUpdateNode = useCallback((field: string, value: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, [field]: value } }
            : node
        )
      );
      setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, [field]: value } } : null);
    }
  }, [selectedNode, setNodes]);

  // Delete selected nodes/edges with Delete/Backspace key
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedNode && !configDrawerOpen) {
        handleDeleteNode();
      } else if (selectedEdge) {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
        setSelectedEdge(null);
      }
    }
  }, [selectedNode, selectedEdge, configDrawerOpen, handleDeleteNode, setEdges]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <Box sx={{
      width: '100%',
      height: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0f0f1e',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Section - Reusable Workflows */}
      {showWorkflowCards && (
        <Box
          sx={{
            width: '100%',
            py: 2,
            px: 3,
            bgcolor: 'rgba(17, 24, 39, 0.98)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'visible',
            position: 'relative',
            zIndex: 1000,
            flexShrink: 0,
            minHeight: '120px',
            alignItems: 'center',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.4)',
              },
            },
          }}
        >
        <WorkflowCard
          title="Claims Detection"
          description="Detect misleading compliance claims"
          variant="primary"
          onClick={() => onLoadWorkflowCard?.('claims-detection')}
        />
        <WorkflowCard
          title="Vendor Risk"
          description="Automated vendor risk assessment"
          onClick={() => onLoadWorkflowCard?.('vendor-risk')}
        />
        <WorkflowCard
          title="Access Review"
          description="Quarterly access review automation"
          onClick={() => onLoadWorkflowCard?.('access-review')}
        />
        <WorkflowCard
          title="Policy Violation"
          description="Real-time policy violation detection"
          onClick={() => onLoadWorkflowCard?.('policy-violation')}
        />
        <WorkflowCard
          title="Evidence Collection"
          description="Automated evidence gathering workflow"
          onClick={() => onLoadWorkflowCard?.('evidence-collection')}
        />
      </Box>
      )}

      {/* Main Canvas Area */}
      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        height: showWorkflowCards ? 'calc(100% - 120px)' : '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - Component Palette */}
        {showComponentPalette && (
          <Box sx={{ flexShrink: 0, height: '100%', zIndex: 1, position: 'relative' }}>
            <ComponentPalette onDragStart={onDragStart} />
          </Box>
        )}

        {/* React Flow Canvas */}
        <Box ref={reactFlowWrapper} sx={{
          flexGrow: 1,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}
        data-testid="workflow-canvas"
      >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeInternal}
            onEdgesChange={onEdgesChange}
            onConnect={isReadOnly ? undefined : onConnect}
            onReconnect={isReadOnly ? undefined : onReconnect}
            onConnectStart={isReadOnly ? undefined : onConnectStart}
            onConnectEnd={isReadOnly ? undefined : onConnectEnd}
            onNodeClick={onNodeClick}
            onEdgeClick={isReadOnly ? undefined : onEdgeClick}
            onInit={setReactFlowInstance}
            onDragOver={isReadOnly ? undefined : onDragOver}
            onDrop={isReadOnly ? undefined : onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            nodesDraggable={!isReadOnly}
            nodesConnectable={!isReadOnly}
            elementsSelectable={!isReadOnly}
            selectNodesOnDrag={false}
            deleteKeyCode="Delete"
            panOnDrag={true}
            selectionOnDrag={false}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnScrollMode="free"
            panOnScrollSpeed={0.5}
            snapToGrid={true}
            snapGrid={[15, 15]}
            connectionRadius={20}
            connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, opacity: 0.8 }}
            defaultEdgeOptions={{
              type: 'editable',
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 1.5, zIndex: 1000 },
              zIndex: 1000,
            }}
            elevateEdgesOnSelect={true}
            edgesUpdatable={true}
            edgesFocusable={true}
            style={{ background: '#0f0f1e' }}
            selectionKeyCode="Shift"
          >
            <Background
              color="rgba(255, 255, 255, 0.05)"
              gap={30}
              size={1}
              style={{ background: '#0f0f1e' }}
            />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'decisionNode') return '#fbbf24';
                if (node.type === 'circularNode') return '#22c55e';
                return '#818cf8';
              }}
              maskColor="rgba(0, 0, 0, 0.6)"
              style={{
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            />
          </ReactFlow>
        </Box>
      </Box>

      {/* Configuration Drawer */}
      <Drawer
        anchor="right"
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 400, bgcolor: 'rgba(17, 24, 39, 0.98)', color: 'white' } }}
      >
        {selectedNode && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Configure Node</Typography>
              <IconButton onClick={() => setConfigDrawerOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Label"
                value={selectedNode.data.label || ''}
                onChange={(e) => handleUpdateNode('label', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />

              <TextField
                label="Subtitle"
                value={selectedNode.data.subtitle || ''}
                onChange={(e) => handleUpdateNode('subtitle', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                placeholder="Enter node description..."
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Node Type</InputLabel>
                <Select
                  value={selectedNode.type || 'standard'}
                  label="Node Type"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="decision">Decision</MenuItem>
                  <MenuItem value="circular">Circular</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setConfigDrawerOpen(false)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<Delete />}
                  onClick={handleDeleteNode}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
