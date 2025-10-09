import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  Close,
  History,
  CheckCircle,
  Error as ErrorIcon,
  Pause,
  Schedule,
  FilterList,
  CloudDownload,
  Refresh,
  PlayArrow,
  CompareArrows,
  ContentCopy,
} from '@mui/icons-material';

interface ExecutionRun {
  id: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'paused' | 'running';
  duration: number;
  stepsCompleted: number;
  totalSteps: number;
  inputData?: any;
  errorMessage?: string;
  cost?: number;
  tokensUsed?: number;
}

interface ExecutionHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  workflowName: string;
  executions?: ExecutionRun[];
  onLoadExecution?: (executionId: string) => void;
  onCompareExecutions?: (exec1Id: string, exec2Id: string) => void;
}

export default function ExecutionHistoryDrawer({
  open,
  onClose,
  workflowName,
  executions,
  onLoadExecution,
  onCompareExecutions,
}: ExecutionHistoryDrawerProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'paused'>('all');
  const [selectedExecutions, setSelectedExecutions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics'>('timeline');

  // Mock data if no executions provided
  const mockExecutions: ExecutionRun[] = [
    {
      id: 'exec-001',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'completed',
      duration: 2450,
      stepsCompleted: 5,
      totalSteps: 5,
      cost: 0.0234,
      tokensUsed: 3421,
    },
    {
      id: 'exec-002',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      status: 'failed',
      duration: 1560,
      stepsCompleted: 3,
      totalSteps: 5,
      errorMessage: 'API rate limit exceeded',
      cost: 0.0156,
      tokensUsed: 2134,
    },
    {
      id: 'exec-003',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
      duration: 2890,
      stepsCompleted: 5,
      totalSteps: 5,
      cost: 0.0267,
      tokensUsed: 3856,
    },
    {
      id: 'exec-004',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'paused',
      duration: 980,
      stepsCompleted: 2,
      totalSteps: 5,
      cost: 0.0089,
      tokensUsed: 1245,
    },
    {
      id: 'exec-005',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'completed',
      duration: 2120,
      stepsCompleted: 5,
      totalSteps: 5,
      cost: 0.0198,
      tokensUsed: 2987,
    },
  ];

  const displayExecutions = executions || mockExecutions;
  const filteredExecutions = displayExecutions.filter(exec =>
    filterStatus === 'all' || exec.status === filterStatus
  );

  const statusConfig = {
    completed: { color: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.2)', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    failed: { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.2)', icon: <ErrorIcon sx={{ fontSize: 16 }} /> },
    paused: { color: '#fbbf24', bgcolor: 'rgba(251, 191, 36, 0.2)', icon: <Pause sx={{ fontSize: 16 }} /> },
    running: { color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.2)', icon: <PlayArrow sx={{ fontSize: 16 }} /> },
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const toggleSelectExecution = (execId: string) => {
    setSelectedExecutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(execId)) {
        newSet.delete(execId);
      } else {
        newSet.add(execId);
      }
      return newSet;
    });
  };

  const successRate = displayExecutions.length > 0
    ? (displayExecutions.filter(e => e.status === 'completed').length / displayExecutions.length) * 100
    : 0;

  const avgDuration = displayExecutions.length > 0
    ? displayExecutions.reduce((sum, e) => sum + e.duration, 0) / displayExecutions.length
    : 0;

  const totalCost = displayExecutions.reduce((sum, e) => sum + (e.cost || 0), 0);
  const totalTokens = displayExecutions.reduce((sum, e) => sum + (e.tokensUsed || 0), 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          bgcolor: '#0a0f1e',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History sx={{ fontSize: 24, color: '#818cf8' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Execution History
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }}>
          {workflowName}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.6)', minHeight: 48, fontSize: 13 },
          '& .Mui-selected': { color: '#818cf8' },
          '& .MuiTabs-indicator': { bgcolor: '#818cf8' },
        }}
      >
        <Tab label="Timeline" value="timeline" />
        <Tab label="Analytics" value="analytics" />
      </Tabs>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 'timeline' && (
          <Box>
            {/* Filter Controls */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  label="Filter by Status"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#818cf8' },
                    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.6)' },
                  }}
                >
                  <MenuItem value="all">All Executions</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Timeline List */}
            <Box sx={{ p: 2 }}>
              {filteredExecutions.map((exec) => {
                const config = statusConfig[exec.status];
                const isSelected = selectedExecutions.has(exec.id);

                return (
                  <Box
                    key={exec.id}
                    onClick={() => toggleSelectExecution(exec.id)}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: isSelected ? 'rgba(129, 140, 248, 0.1)' : 'rgba(30, 30, 50, 0.5)',
                      border: isSelected ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(129, 140, 248, 0.08)',
                        borderColor: '#818cf8',
                      },
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Chip
                        icon={config.icon}
                        label={exec.status}
                        size="small"
                        sx={{
                          bgcolor: config.bgcolor,
                          color: config.color,
                          fontSize: 11,
                          height: 22,
                          fontWeight: 500,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        {new Date(exec.timestamp).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Metrics */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, display: 'block' }}>
                          Duration
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {formatDuration(exec.duration)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, display: 'block' }}>
                          Steps
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {exec.stepsCompleted} / {exec.totalSteps}
                        </Typography>
                      </Box>
                      {exec.cost !== undefined && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, display: 'block' }}>
                            Cost
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 500, fontSize: 13 }}>
                            ${exec.cost.toFixed(4)}
                          </Typography>
                        </Box>
                      )}
                      {exec.tokensUsed !== undefined && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, display: 'block' }}>
                            Tokens
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 500, fontSize: 13 }}>
                            {exec.tokensUsed.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Error Message */}
                    {exec.errorMessage && (
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: 1,
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#ef4444', fontSize: 11 }}>
                          Error: {exec.errorMessage}
                        </Typography>
                      </Box>
                    )}

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {exec.status === 'failed' && onLoadExecution && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Refresh />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadExecution(exec.id);
                          }}
                          sx={{
                            fontSize: 11,
                            py: 0.5,
                            borderColor: 'rgba(34, 197, 94, 0.5)',
                            color: '#22c55e',
                            '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' },
                          }}
                        >
                          Load & Debug
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopy />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(exec.id);
                        }}
                        sx={{
                          fontSize: 11,
                          py: 0.5,
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                      >
                        Copy ID
                      </Button>
                    </Box>
                  </Box>
                );
              })}

              {filteredExecutions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <History sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    No executions found
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {activeTab === 'analytics' && (
          <Box sx={{ p: 2 }}>
            {/* Summary Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                  TOTAL RUNS
                </Typography>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                  {displayExecutions.length}
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                  SUCCESS RATE
                </Typography>
                <Typography variant="h5" sx={{ color: '#22c55e', fontWeight: 600 }}>
                  {successRate.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                  AVG DURATION
                </Typography>
                <Typography variant="h5" sx={{ color: '#818cf8', fontWeight: 600 }}>
                  {formatDuration(avgDuration)}
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                  TOTAL COST
                </Typography>
                <Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                  ${totalCost.toFixed(4)}
                </Typography>
              </Box>
            </Box>

            {/* Status Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                Status Breakdown
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(statusConfig).map(([status, config]) => {
                  const count = displayExecutions.filter(e => e.status === status).length;
                  const percentage = displayExecutions.length > 0 ? (count / displayExecutions.length) * 100 : 0;

                  return (
                    <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ minWidth: 80 }}>
                        <Chip
                          label={status}
                          size="small"
                          sx={{ bgcolor: config.bgcolor, color: config.color, fontSize: 11 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            height: '100%',
                            bgcolor: config.color,
                            transition: 'width 0.3s',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'white', minWidth: 40, textAlign: 'right' }}>
                        {count} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Token & Cost Analysis */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                Resource Usage
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                    Total Tokens Used
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 500, fontSize: 12 }}>
                    {totalTokens.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                    Avg Tokens per Run
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 12 }}>
                    {displayExecutions.length > 0 ? Math.round(totalTokens / displayExecutions.length).toLocaleString() : 0}
                  </Typography>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                    Avg Cost per Run
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 500, fontSize: 12 }}>
                    ${displayExecutions.length > 0 ? (totalCost / displayExecutions.length).toFixed(4) : '0.0000'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {selectedExecutions.size === 2 && onCompareExecutions && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<CompareArrows />}
            onClick={() => {
              const [exec1, exec2] = Array.from(selectedExecutions);
              onCompareExecutions(exec1, exec2);
            }}
            sx={{
              bgcolor: '#818cf8',
              '&:hover': { bgcolor: '#6366f1' },
              mb: 1,
            }}
          >
            Compare Selected Executions
          </Button>
        )}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<CloudDownload />}
          sx={{
            borderColor: 'rgba(99, 102, 241, 0.5)',
            color: '#818cf8',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: '#818cf8' },
          }}
        >
          Export History
        </Button>
      </Box>
    </Drawer>
  );
}
