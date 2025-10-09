import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore,
  DataObject,
  CallSplit,
  Memory as MemoryIcon,
  Queue as QueueIcon,
  Error as ErrorIcon,
  Timeline,
} from '@mui/icons-material';

interface WorkflowVariable {
  name: string;
  value: any;
  type: string;
}

interface CallStackEntry {
  nodeId: string;
  nodeName: string;
  status: 'running' | 'completed' | 'waiting';
  depth: number;
}

interface QueuedNode {
  nodeId: string;
  nodeName: string;
  status: 'queued' | 'blocked';
  blockedBy?: string;
}

interface ExecutionError {
  nodeId: string;
  nodeName: string;
  errorType: 'error' | 'warning';
  message: string;
  timestamp: string;
}

interface ExecutionStatePanelProps {
  open: boolean;
  onToggle: () => void;
  variables?: WorkflowVariable[];
  callStack?: CallStackEntry[];
  queuedNodes?: QueuedNode[];
  errors?: ExecutionError[];
  memoryUsage?: {
    current: number;
    max: number;
    unit: 'MB' | 'GB';
  };
  cpuUsage?: number; // percentage
}

export default function ExecutionStatePanel({
  open,
  onToggle,
  variables = [],
  callStack = [],
  queuedNodes = [],
  errors = [],
  memoryUsage = { current: 43.5, max: 512, unit: 'MB' },
  cpuUsage = 12.5,
}: ExecutionStatePanelProps) {
  const formatValue = (value: any, type: string) => {
    if (type === 'object' || type === 'array') {
      return JSON.stringify(value, null, 2);
    }
    if (type === 'string') {
      return `"${value}"`;
    }
    return String(value);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'rgba(17, 24, 39, 0.98)',
        borderTop: '1px solid rgba(99, 102, 241, 0.3)',
        transform: open ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '60vh',
      }}
    >
      {/* Header - Always Visible */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          cursor: 'pointer',
          borderBottom: open ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
        }}
        onClick={onToggle}
      >
        <Timeline sx={{ fontSize: 20, color: '#818cf8', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, flexGrow: 1 }}>
          Execution State
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 2 }}>
          Live runtime inspector
        </Typography>
        <IconButton size="small" sx={{ color: '#818cf8' }}>
          <ExpandMore
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Box>

      {/* Content - Scrollable (Only shown when expanded) */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: open ? 'grid' : 'none',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 2,
          bgcolor: '#0f0f1e',
        }}
      >
        {/* Variables Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DataObject sx={{ fontSize: 18, color: '#818cf8' }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              Variables
            </Typography>
            <Chip
              label={variables.length}
              size="small"
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: 10, height: 20 }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 300 }}>
            {variables.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {variables.map((variable, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      bgcolor: 'rgba(17, 24, 39, 0.5)',
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 500, fontFamily: 'monospace' }}>
                        {variable.name}
                      </Typography>
                      <Chip
                        label={variable.type}
                        size="small"
                        sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontSize: 9, height: 18 }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'monospace',
                        fontSize: 11,
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {formatValue(variable.value, variable.type)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                No variables in context
              </Typography>
            )}
          </Box>
        </Box>

        {/* Call Stack Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CallSplit sx={{ fontSize: 18, color: '#818cf8' }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              Call Stack
            </Typography>
            <Chip
              label={callStack.length}
              size="small"
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: 10, height: 20 }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 300 }}>
            {callStack.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {callStack.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      pl: entry.depth * 2,
                      py: 0.75,
                      px: 1,
                      bgcolor: entry.status === 'running' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(17, 24, 39, 0.5)',
                      borderLeft: entry.status === 'running' ? '2px solid #22c55e' : '2px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 0.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, fontSize: 11 }}>
                      {entry.nodeName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 10, display: 'block' }}>
                      {entry.nodeId} • {entry.status}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                No active execution
              </Typography>
            )}
          </Box>
        </Box>

        {/* Resources Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <MemoryIcon sx={{ fontSize: 18, color: '#818cf8' }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              Resources
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Memory Usage */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>
                  MEMORY
                </Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, fontSize: 11 }}>
                  {memoryUsage.current} / {memoryUsage.max} {memoryUsage.unit}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(memoryUsage.current / memoryUsage.max) * 100}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: (memoryUsage.current / memoryUsage.max) > 0.8 ? '#ef4444' : '#22c55e',
                  },
                }}
              />
            </Box>

            {/* CPU Usage */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>
                  CPU
                </Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, fontSize: 11 }}>
                  {cpuUsage.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={cpuUsage}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: cpuUsage > 80 ? '#ef4444' : '#818cf8',
                  },
                }}
              />
            </Box>

            {/* Queue & Errors inline */}
            {(queuedNodes.length > 0 || errors.length > 0) && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {queuedNodes.length > 0 && (
                  <Chip
                    icon={<QueueIcon sx={{ fontSize: 14 }} />}
                    label={`${queuedNodes.length} queued`}
                    size="small"
                    sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontSize: 10 }}
                  />
                )}
                {errors.length > 0 && (
                  <Chip
                    icon={<ErrorIcon sx={{ fontSize: 14 }} />}
                    label={`${errors.length} errors`}
                    size="small"
                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: 10 }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
