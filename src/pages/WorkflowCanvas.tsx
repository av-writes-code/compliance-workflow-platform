import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  ReactFlowInstance,
  EdgeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Drawer, Typography, TextField, Button, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import WorkflowCard from '../components/workflow/WorkflowCard';
import ComponentPalette from '../components/workflow/ComponentPalette';
import { StandardNode, DecisionNode, CircularNode } from '../components/workflow/CustomNode';
import { SmartToy, Memory, IntegrationInstructions } from '@mui/icons-material';

const nodeTypes: NodeTypes = {
  standard: StandardNode,
  decision: DecisionNode,
  circular: CircularNode,
};

const initialNodes: Node[] = [
  // Trigger
  {
    id: '1',
    type: 'standard',
    position: { x: 50, y: 100 },
    data: {
      label: 'Execute Workflow',
      subtitle: 'manual trigger',
      icon: <SmartToy />,
      showSubNodes: false,
    },
  },
  // AI Agent with sub-nodes
  {
    id: '2',
    type: 'standard',
    position: { x: 300, y: 100 },
    data: {
      label: 'AI Agent',
      subtitle: 'Tools Agent',
      icon: <SmartToy />,
      showSubNodes: true,
    },
  },
  {
    id: '2-sub-1',
    type: 'circular',
    position: { x: 250, y: 230 },
    data: {
      label: 'Chat Model',
      icon: <SmartToy fontSize="small" />,
    },
  },
  {
    id: '2-sub-2',
    type: 'circular',
    position: { x: 340, y: 230 },
    data: {
      label: 'Memory',
      icon: <Memory fontSize="small" />,
    },
  },
  // Loop node
  {
    id: '3',
    type: 'standard',
    position: { x: 550, y: 100 },
    data: {
      label: 'Loop Over Items',
      subtitle: 'iteration',
      icon: <Memory />,
      showSubNodes: false,
    },
  },
  // Edit Fields
  {
    id: '4',
    type: 'standard',
    position: { x: 800, y: 100 },
    data: {
      label: 'Edit Fields',
      subtitle: 'transform',
      icon: <Memory />,
      showSubNodes: false,
    },
  },
  // If condition
  {
    id: '5',
    type: 'standard',
    position: { x: 1050, y: 100 },
    data: {
      label: 'If',
      subtitle: 'conditional',
      icon: <Memory />,
      showSubNodes: false,
    },
  },
  // Critic Agent
  {
    id: '6',
    type: 'standard',
    position: { x: 150, y: 350 },
    data: {
      label: 'Critic Agent',
      subtitle: 'review',
      icon: <SmartToy />,
      showSubNodes: true,
    },
  },
  {
    id: '6-sub-1',
    type: 'circular',
    position: { x: 100, y: 480 },
    data: {
      label: 'Chat Model',
      icon: <SmartToy fontSize="small" />,
    },
  },
  {
    id: '6-sub-2',
    type: 'circular',
    position: { x: 190, y: 480 },
    data: {
      label: 'Memory',
      icon: <Memory fontSize="small" />,
    },
  },
  // Evaluation Agent
  {
    id: '7',
    type: 'standard',
    position: { x: 400, y: 350 },
    data: {
      label: 'Evaluation Agent',
      subtitle: 'assess',
      icon: <SmartToy />,
      showSubNodes: true,
    },
  },
  // Code node
  {
    id: '8',
    type: 'standard',
    position: { x: 650, y: 350 },
    data: {
      label: 'Code',
      subtitle: 'custom logic',
      icon: <Memory />,
      showSubNodes: false,
    },
  },
  // Structured Output Parser
  {
    id: '9',
    type: 'standard',
    position: { x: 900, y: 350 },
    data: {
      label: 'Structured Output Parser',
      subtitle: 'format output',
      icon: <Memory />,
      showSubNodes: false,
    },
  },
];

const initialEdges: Edge[] = [
  // Main flow
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },

  // AI Agent sub-connections
  { id: 'e2-sub1', source: '2', sourceHandle: 'sub-0', target: '2-sub-1', type: 'straight', style: { strokeDasharray: '5 5', stroke: 'rgba(255, 255, 255, 0.3)' } },
  { id: 'e2-sub2', source: '2', sourceHandle: 'sub-1', target: '2-sub-2', type: 'straight', style: { strokeDasharray: '5 5', stroke: 'rgba(255, 255, 255, 0.3)' } },

  // Loop connections to agents
  { id: 'e3-6', source: '3', target: '6', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e6-7', source: '6', target: '7', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e7-8', source: '7', target: '8', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },
  { id: 'e8-9', source: '8', target: '9', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' } },

  // Critic Agent sub-connections
  { id: 'e6-sub1', source: '6', sourceHandle: 'sub-0', target: '6-sub-1', type: 'straight', style: { strokeDasharray: '5 5', stroke: 'rgba(255, 255, 255, 0.3)' } },
  { id: 'e6-sub2', source: '6', sourceHandle: 'sub-1', target: '6-sub-2', type: 'straight', style: { strokeDasharray: '5 5', stroke: 'rgba(255, 255, 255, 0.3)' } },

  // Back loop
  { id: 'e9-1', source: '9', target: '1', animated: false, type: 'smoothstep', style: { stroke: 'rgba(255, 255, 255, 0.3)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255, 255, 255, 0.3)' } },
];

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        type: 'smoothstep',
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
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

      if (!reactFlowWrapper.current || !reactFlowInstance || !draggedItem) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeType = draggedItem.type === 'decision' ? 'decision' :
                       draggedItem.type === 'conditional' ? 'standard' : 'standard';

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: draggedItem.label,
          subtitle: draggedItem.type,
          icon: draggedItem.icon,
          showSubNodes: draggedItem.type === 'agent' || draggedItem.type === 'chat-model',
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setDraggedItem(null);
    },
    [reactFlowInstance, nodes, draggedItem, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setConfigDrawerOpen(true);
  }, []);

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
        <WorkflowCard title="Claims Detection" description="Detect misleading compliance claims" variant="primary" />
        <WorkflowCard title="Vendor Risk" description="Automated vendor risk assessment" />
        <WorkflowCard title="Access Review" description="Quarterly access review automation" />
        <WorkflowCard title="Policy Violation" description="Real-time policy violation detection" />
        <WorkflowCard title="Evidence Collection" description="Automated evidence gathering workflow" />
      </Box>

      {/* Main Canvas Area */}
      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        height: 'calc(100% - 120px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - Component Palette */}
        <Box sx={{ flexShrink: 0, height: '100%', zIndex: 1, position: 'relative' }}>
          <ComponentPalette onDragStart={onDragStart} />
        </Box>

        {/* React Flow Canvas */}
        <Box ref={reactFlowWrapper} sx={{
          flexGrow: 1,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]}
            selectionOnDrag={true}
            snapToGrid={true}
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' }
            }}
            style={{ background: '#0f0f1e' }}
            deleteKeyCode="Delete"
          >
            <Background
              color="rgba(255, 255, 255, 0.1)"
              gap={20}
              size={1}
              style={{ background: '#0f0f1e' }}
            />
            <Controls
              style={{
                button: {
                  backgroundColor: 'rgba(30, 30, 50, 0.9)',
                  color: 'white',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                },
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'decision') return '#6366f1';
                if (node.type === 'circular') return '#10b981';
                return '#6366f1';
              }}
              maskColor="rgba(15, 15, 30, 0.9)"
              style={{
                backgroundColor: 'rgba(30, 30, 50, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
