import { Box, Typography, LinearProgress, Chip, IconButton, Collapse, Paper } from '@mui/material';
import { ExpandLess, ExpandMore, CheckCircle, Error, PlayArrow } from '@mui/icons-material';
import { useState } from 'react';

interface ExecutionLog {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  message: string;
  status: 'running' | 'success' | 'error';
}

interface ExecutionPanelProps {
  isExecuting: boolean;
  logs: ExecutionLog[];
  progress: number;
  onToggle?: () => void;
}

export default function ExecutionPanel({ isExecuting, logs, progress, onToggle }: ExecutionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayArrow sx={{ fontSize: 16, color: '#6366f1' }} />;
      case 'success':
        return <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'error':
        return <Error sx={{ fontSize: 16, color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'rgba(17, 24, 39, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="subtitle2" sx={{ color: 'white', flexGrow: 1 }}>
          Execution Logs
          {isExecuting && (
            <Chip
              label="Running"
              size="small"
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <IconButton size="small" sx={{ color: 'white' }}>
          {isExpanded ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>

      {/* Progress Bar */}
      {isExecuting && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 2,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#6366f1',
            },
          }}
        />
      )}

      {/* Logs */}
      <Collapse in={isExpanded}>
        <Box
          sx={{
            maxHeight: 250,
            overflowY: 'auto',
            p: 2,
            bgcolor: '#0f0f1e',
          }}
        >
          {logs.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
              No execution logs yet. Click "Run Test" to execute the workflow.
            </Typography>
          ) : (
            logs.map((log, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
              >
                {getStatusIcon(log.status)}
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255, 255, 255, 0.5)', minWidth: 80 }}
                >
                  {log.timestamp}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#6366f1', minWidth: 120 }}
                >
                  [{log.nodeName}]
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'white', flexGrow: 1 }}
                >
                  {log.message}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
