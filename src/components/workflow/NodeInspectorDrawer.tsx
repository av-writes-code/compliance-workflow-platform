import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Close,
  DataObject,
  Schedule,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  PlayArrow,
  ExpandMore,
  ExpandLess,
  Memory as MemoryIcon,
  CloudDownload,
  ContentCopy,
  TrendingUp,
  Speed,
  NetworkCheck,
  Token as TokenIcon,
  Psychology,
  BugReport,
  History as HistoryIcon,
  InfoOutlined,
  Timeline,
  Restore,
  CompareArrows,
  Edit,
} from '@mui/icons-material';

interface ExecutionMetadata {
  startTime?: string;
  endTime?: string;
  duration?: number; // milliseconds
  queueTime?: number; // milliseconds
  workerId?: string;
  executionId?: string;
}

interface ResourceUsage {
  memoryUsage?: number; // bytes
  cpuTime?: number; // milliseconds
  networkCalls?: number;
  dataSize?: { input: number; output: number }; // bytes
}

interface LLMMetrics {
  model?: string;
  prompt?: string;
  temperature?: number;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
}

interface ErrorDetails {
  errorCode?: string;
  stackTrace?: string;
  suggestedFix?: string;
}

interface PreviousExecution {
  timestamp: string;
  status: 'completed' | 'failed';
  duration: number;
}

interface NodeInspectorDrawerProps {
  open: boolean;
  onClose: () => void;
  nodeData: {
    id: string;
    label: string;
    type: string;
    executionStatus?: 'idle' | 'running' | 'completed' | 'failed';
    executionTime?: string;
    inputData?: any;
    outputData?: any;
    errorMessage?: string;
    attempts?: number;
    metadata?: ExecutionMetadata;
    resources?: ResourceUsage;
    llmMetrics?: LLMMetrics;
    errorDetails?: ErrorDetails;
    previousExecutions?: PreviousExecution[];
    logs?: Array<{ timestamp: string; level: string; message: string }>;
    isPausedAtBreakpoint?: boolean;
  } | null;
  onRerun?: (nodeId: string) => void;
  onEditAndRerun?: (nodeId: string, newInput: any) => void;
  onContinue?: () => void;
  onStepOver?: () => void;
  onStepInto?: () => void;
}

export default function NodeInspectorDrawer({
  open,
  onClose,
  nodeData,
  onRerun,
  onEditAndRerun,
  onContinue,
  onStepOver,
  onStepInto,
}: NodeInspectorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'input' | 'output' | 'logs' | 'history' | 'execution' | 'checkpoints'>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (!nodeData) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const renderJSON = (data: any, depth = 0) => {
    if (!data) {
      return (
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic', p: 2 }}>
          No data available
        </Typography>
      );
    }

    if (typeof data !== 'object') {
      return (
        <Typography
          variant="body2"
          sx={{
            color: '#22c55e',
            fontFamily: 'monospace',
            fontSize: 13,
            p: 2,
          }}
        >
          {String(data)}
        </Typography>
      );
    }

    return (
      <Box sx={{ pl: depth * 2 }}>
        {Object.entries(data).map(([key, value]) => {
          const sectionKey = `${depth}-${key}`;
          const isExpanded = expandedSections[sectionKey] !== false;
          const isObject = typeof value === 'object' && value !== null;

          return (
            <Box key={key} sx={{ mb: 0.5 }}>
              <Box
                onClick={() => isObject && toggleSection(sectionKey)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: isObject ? 'pointer' : 'default',
                  p: 0.5,
                  '&:hover': isObject ? { bgcolor: 'rgba(99, 102, 241, 0.1)' } : {},
                  borderRadius: 1,
                }}
              >
                {isObject && (
                  isExpanded ? <ExpandLess sx={{ fontSize: 16, color: '#818cf8' }} /> : <ExpandMore sx={{ fontSize: 16, color: '#818cf8' }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#818cf8',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {key}:
                </Typography>
                {!isObject && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: typeof value === 'string' ? '#22c55e' : typeof value === 'number' ? '#fbbf24' : '#ef4444',
                      fontFamily: 'monospace',
                      fontSize: 13,
                    }}
                  >
                    {typeof value === 'string' ? `"${value}"` : String(value)}
                  </Typography>
                )}
              </Box>
              {isObject && isExpanded && (
                <Box sx={{ ml: 2 }}>
                  {renderJSON(value, depth + 1)}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  const statusConfig = {
    idle: { label: 'Idle', color: '#9ca3af', icon: null },
    running: { label: 'Running', color: '#22c55e', icon: <PlayArrow sx={{ fontSize: 16 }} /> },
    completed: { label: 'Completed', color: '#6366f1', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    failed: { label: 'Failed', color: '#ef4444', icon: <ErrorIcon sx={{ fontSize: 16 }} /> },
  };

  const currentStatus = nodeData.executionStatus ? statusConfig[nodeData.executionStatus] : statusConfig.idle;

  const handleDownloadData = () => {
    const data = {
      nodeId: nodeData.id,
      label: nodeData.label,
      inputData: nodeData.inputData,
      outputData: nodeData.outputData,
      metadata: nodeData.metadata,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `node-${nodeData.id}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 500,
          bgcolor: '#0f0f1e',
          borderLeft: '1px solid rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Node Inspector
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
          {nodeData.label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {nodeData.type} • ID: {nodeData.id}
        </Typography>
      </Box>

      {/* Breakpoint Hit Banner */}
      {nodeData.isPausedAtBreakpoint && (
        <Box
          sx={{
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            borderBottom: '2px solid #ef4444',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <BugReport sx={{ color: '#ef4444', fontSize: 20 }} />
            <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 600, fontSize: 14 }}>
              ⏸ PAUSED AT BREAKPOINT
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, mb: 2 }}>
            Execution stopped at this node. Inspect the current state below or use stepping controls to continue.
          </Typography>

          {/* Stepping Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={onContinue}
              sx={{
                bgcolor: '#22c55e',
                fontSize: 11,
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: '#16a34a' },
              }}
            >
              Continue
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onStepOver}
              sx={{
                borderColor: 'rgba(129, 140, 248, 0.5)',
                color: '#818cf8',
                fontSize: 11,
                px: 1.5,
                py: 0.5,
                '&:hover': { borderColor: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)' },
              }}
            >
              Step Over
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onStepInto}
              sx={{
                borderColor: 'rgba(129, 140, 248, 0.5)',
                color: '#818cf8',
                fontSize: 11,
                px: 1.5,
                py: 0.5,
                '&:hover': { borderColor: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)' },
              }}
            >
              Step Into
            </Button>
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.6)', minHeight: 48, fontSize: 11, minWidth: 90, px: 1 },
          '& .Mui-selected': { color: '#818cf8' },
          '& .MuiTabs-indicator': { bgcolor: '#818cf8' },
          '& .MuiTabScrollButton-root': { color: 'rgba(255, 255, 255, 0.6)' },
        }}
      >
        <Tab label="Overview" value="overview" icon={<InfoOutlined sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Input" value="input" icon={<DataObject sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Output" value="output" icon={<DataObject sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Execution" value="execution" icon={<Timeline sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Checkpoints" value="checkpoints" icon={<Restore sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Logs" value="logs" icon={<BugReport sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="History" value="history" icon={<HistoryIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
      </Tabs>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <Box>
            {/* Status & Timing */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                Execution Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  icon={currentStatus.icon || undefined}
                  label={currentStatus.label}
                  size="small"
                  sx={{
                    bgcolor: `${currentStatus.color}33`,
                    color: currentStatus.color,
                    '& .MuiChip-icon': { color: currentStatus.color },
                  }}
                />
                {nodeData.attempts && nodeData.attempts > 1 && (
                  <Chip
                    label={`${nodeData.attempts} attempts`}
                    size="small"
                    sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontSize: 11 }}
                  />
                )}
              </Box>

              {/* Timing Metrics */}
              {nodeData.metadata && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  {nodeData.metadata.duration && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        DURATION
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: '#818cf8' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {formatDuration(nodeData.metadata.duration)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {nodeData.metadata.queueTime && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        QUEUE TIME
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {formatDuration(nodeData.metadata.queueTime)}
                      </Typography>
                    </Box>
                  )}
                  {nodeData.metadata.startTime && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        STARTED
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {new Date(nodeData.metadata.startTime).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  )}
                  {nodeData.metadata.workerId && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        WORKER ID
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {nodeData.metadata.workerId.substring(0, 8)}...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

            {/* Resource Usage */}
            {nodeData.resources && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                  Resource Usage
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {nodeData.resources.memoryUsage && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        MEMORY
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MemoryIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {formatBytes(nodeData.resources.memoryUsage)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {nodeData.resources.cpuTime && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        CPU TIME
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Speed sx={{ fontSize: 14, color: '#fbbf24' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {formatDuration(nodeData.resources.cpuTime)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {nodeData.resources.networkCalls !== undefined && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                        API CALLS
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <NetworkCheck sx={{ fontSize: 14, color: '#818cf8' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {nodeData.resources.networkCalls}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {nodeData.resources.dataSize && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          DATA SIZE
                        </Typography>
                        <Tooltip title="Input → Output data size (useful for performance optimization)" arrow>
                          <InfoOutlined sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.3)', cursor: 'help' }} />
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {formatBytes(nodeData.resources.dataSize.input)} → {formatBytes(nodeData.resources.dataSize.output)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* LLM Metrics (if applicable) */}
            {nodeData.llmMetrics && (
              <>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Psychology sx={{ fontSize: 18, color: '#818cf8' }} />
                      AI Model Metrics
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {nodeData.llmMetrics.model && (
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          MODEL
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {nodeData.llmMetrics.model}
                        </Typography>
                      </Box>
                    )}
                    {nodeData.llmMetrics.inputTokens && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          INPUT TOKENS
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TokenIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                            {nodeData.llmMetrics.inputTokens.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {nodeData.llmMetrics.outputTokens && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          OUTPUT TOKENS
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TokenIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                            {nodeData.llmMetrics.outputTokens.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {nodeData.llmMetrics.cost && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          COST
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          ${typeof nodeData.llmMetrics.cost === 'number' ? nodeData.llmMetrics.cost.toFixed(4) : nodeData.llmMetrics.cost}
                        </Typography>
                      </Box>
                    )}
                    {nodeData.llmMetrics.temperature !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                          TEMPERATURE
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                          {nodeData.llmMetrics.temperature}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            )}

            {/* Error Details */}
            {nodeData.executionStatus === 'failed' && nodeData.errorDetails && (
              <>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <ErrorIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                      ERROR DETAILS
                    </Typography>
                  </Box>
                  {nodeData.errorDetails.errorCode && (
                    <Typography variant="body2" sx={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 12, mb: 1 }}>
                      {nodeData.errorDetails.errorCode}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, mb: 1 }}>
                    {nodeData.errorMessage}
                  </Typography>
                  {nodeData.errorDetails.suggestedFix && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(34, 197, 94, 0.1)', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>
                        💡 SUGGESTED FIX
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 }}>
                        {nodeData.errorDetails.suggestedFix}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* INPUT TAB */}
        {activeTab === 'input' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                Input Data
              </Typography>
              {nodeData.resources?.dataSize?.input && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label={formatBytes(nodeData.resources.dataSize.input)}
                    size="small"
                    sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: 11 }}
                  />
                  <Tooltip title="Size of data received by this node (useful for performance optimization)" arrow>
                    <InfoOutlined sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', cursor: 'help' }} />
                  </Tooltip>
                </Box>
              )}
            </Box>
            {renderJSON(nodeData.inputData)}
          </Box>
        )}

        {/* OUTPUT TAB */}
        {activeTab === 'output' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                Output Data
              </Typography>
              {nodeData.resources?.dataSize?.output && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label={formatBytes(nodeData.resources.dataSize.output)}
                    size="small"
                    sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontSize: 11 }}
                  />
                  <Tooltip title="Size of data produced by this node (useful for performance optimization)" arrow>
                    <InfoOutlined sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', cursor: 'help' }} />
                  </Tooltip>
                </Box>
              )}
            </Box>
            {renderJSON(nodeData.outputData)}
          </Box>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Execution Logs
            </Typography>
            <Box sx={{ fontFamily: 'monospace', fontSize: 12 }}>
              {nodeData.logs && nodeData.logs.length > 0 ? (
                nodeData.logs.map((log, index) => (
                  <Box key={index} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: log.level === 'ERROR' ? '#ef4444' : log.level === 'WARN' ? '#fbbf24' : '#22c55e',
                        fontWeight: 600,
                        minWidth: 50,
                      }}
                    >
                      [{log.level}]
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', minWidth: 80 }}>
                      {log.timestamp}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {log.message}
                    </Typography>
                  </Box>
                ))
              ) : (
                <>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    [INFO] Node execution started
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    [INFO] Processing input data...
                  </Typography>
                  {nodeData.executionStatus === 'failed' && (
                    <Typography variant="body2" sx={{ color: '#ef4444', mb: 0.5 }}>
                      [ERROR] {nodeData.errorMessage}
                    </Typography>
                  )}
                  {nodeData.executionStatus === 'completed' && (
                    <Typography variant="body2" sx={{ color: '#22c55e', mb: 0.5 }}>
                      [SUCCESS] Node execution completed in {nodeData.executionTime}
                    </Typography>
                  )}
                </>
              )}
            </Box>
            {nodeData.errorDetails?.stackTrace && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, mb: 1, display: 'block' }}>
                  STACK TRACE
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'monospace',
                    fontSize: 10,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {nodeData.errorDetails.stackTrace}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Previous Executions
            </Typography>
            {nodeData.previousExecutions && nodeData.previousExecutions.length > 0 ? (
              <Box>
                {nodeData.previousExecutions.map((exec, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      mb: 1,
                      bgcolor: 'rgba(30, 30, 50, 0.5)',
                      borderRadius: 1,
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: 12, mb: 0.5 }}>
                        {new Date(exec.timestamp).toLocaleString()}
                      </Typography>
                      <Chip
                        label={exec.status}
                        size="small"
                        sx={{
                          bgcolor: exec.status === 'completed' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: exec.status === 'completed' ? '#6366f1' : '#ef4444',
                          fontSize: 10,
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {formatDuration(exec.duration)}
                    </Typography>
                  </Box>
                ))}
                {/* Success Rate */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 1, display: 'block' }}>
                    SUCCESS RATE
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (nodeData.previousExecutions.filter(e => e.status === 'completed').length /
                          nodeData.previousExecutions.length) *
                        100
                      }
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'rgba(99, 102, 241, 0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                      {Math.round(
                        (nodeData.previousExecutions.filter(e => e.status === 'completed').length /
                          nodeData.previousExecutions.length) *
                          100
                      )}
                      %
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                No previous executions available
              </Typography>
            )}
          </Box>
        )}

        {/* EXECUTION TAB */}
        {activeTab === 'execution' && (
          <Box>
            {/* LLM Call Trace */}
            {nodeData.llmMetrics && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                  LLM Call Trace
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  {/* Model */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                      MODEL
                    </Typography>
                    <Chip
                      label={nodeData.llmMetrics.model || 'Claude Sonnet 4.5'}
                      size="small"
                      icon={<Psychology sx={{ fontSize: 14 }} />}
                      sx={{ bgcolor: 'rgba(129, 140, 248, 0.2)', color: '#818cf8', fontSize: 11 }}
                    />
                  </Box>

                  {/* Prompt */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                      PROMPT
                    </Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: 'rgba(255, 255, 255, 0.8)',
                        maxHeight: 150,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {nodeData.llmMetrics.prompt || 'Analyze the following compliance data and identify potential violations...'}
                    </Box>
                  </Box>

                  {/* Temperature & Parameters */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 0.5, display: 'block' }}>
                        TEMPERATURE
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {nodeData.llmMetrics.temperature || 0.7}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Token Usage */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, mb: 1, display: 'block' }}>
                      TOKEN USAGE
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: '#22c55e', fontSize: 10, mb: 0.5, display: 'block' }}>
                          Input
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {nodeData.llmMetrics.inputTokens?.toLocaleString() || '1,245'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: '#818cf8', fontSize: 10, mb: 0.5, display: 'block' }}>
                          Output
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {nodeData.llmMetrics.outputTokens?.toLocaleString() || '892'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: '#fbbf24', fontSize: 10, mb: 0.5, display: 'block' }}>
                          Total
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {((nodeData.llmMetrics.inputTokens || 1245) + (nodeData.llmMetrics.outputTokens || 892)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Cost */}
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(251, 191, 36, 0.1)', borderRadius: 1, border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#fbbf24', fontSize: 10 }}>
                        ESTIMATED COST
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                        ${(nodeData.llmMetrics.cost || 0.0156).toFixed(4)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Input/Output Diff Viewer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                Data Flow (Input → Output)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Input */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#22c55e', fontSize: 10, fontWeight: 600 }}>
                      INPUT
                    </Typography>
                    <Chip
                      label={nodeData.resources?.dataSize?.input ? formatBytes(nodeData.resources.dataSize.input) : '2.4 KB'}
                      size="small"
                      sx={{ height: 18, fontSize: 9, bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(34, 197, 94, 0.05)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#22c55e',
                      maxHeight: 200,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {JSON.stringify(nodeData.inputData || { claimId: 'CLM-2024-001', amount: 15000 }, null, 2)}
                  </Box>
                </Box>

                {/* Arrow */}
                <Box sx={{ display: 'flex', alignItems: 'center', pt: 4 }}>
                  <CompareArrows sx={{ fontSize: 24, color: '#818cf8' }} />
                </Box>

                {/* Output */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#818cf8', fontSize: 10, fontWeight: 600 }}>
                      OUTPUT
                    </Typography>
                    <Chip
                      label={nodeData.resources?.dataSize?.output ? formatBytes(nodeData.resources.dataSize.output) : '3.1 KB'}
                      size="small"
                      sx={{ height: 18, fontSize: 9, bgcolor: 'rgba(129, 140, 248, 0.2)', color: '#818cf8' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(129, 140, 248, 0.05)',
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#818cf8',
                      maxHeight: 200,
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {JSON.stringify(nodeData.outputData || { status: 'approved', confidence: 0.89 }, null, 2)}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Execution Time Breakdown */}
            {nodeData.metadata && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
                  Timing Breakdown
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'rgba(30, 30, 50, 0.5)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                      Queue Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 12 }}>
                      {formatDuration(nodeData.metadata.queueTime || 45)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                      Execution Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 12 }}>
                      {formatDuration(nodeData.metadata.duration || 1240)}
                    </Typography>
                  </Box>
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#818cf8', fontSize: 12, fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 600, fontSize: 12 }}>
                      {formatDuration((nodeData.metadata.queueTime || 45) + (nodeData.metadata.duration || 1240))}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* CHECKPOINTS TAB */}
        {activeTab === 'checkpoints' && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
              State Snapshots (Checkpoints)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3, fontSize: 13 }}>
              Checkpoints are automatic state snapshots taken before node execution. Restore to any checkpoint for time-travel debugging.
            </Typography>

            {/* Mock Checkpoints */}
            {[
              { id: 'ckpt-3', timestamp: new Date(Date.now() - 1000).toISOString(), step: 3, state: { approved: true, score: 0.89 } },
              { id: 'ckpt-2', timestamp: new Date(Date.now() - 45000).toISOString(), step: 2, state: { analyzing: true, progress: 0.67 } },
              { id: 'ckpt-1', timestamp: new Date(Date.now() - 120000).toISOString(), step: 1, state: { initialized: true, claimId: 'CLM-001' } },
            ].map((checkpoint, index) => (
              <Box
                key={checkpoint.id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: index === 0 ? 'rgba(129, 140, 248, 0.1)' : 'rgba(30, 30, 50, 0.5)',
                  border: index === 0 ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 1,
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`Step ${checkpoint.step}`}
                      size="small"
                      sx={{ bgcolor: index === 0 ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontSize: 10, height: 20 }}
                    />
                    {index === 0 && (
                      <Chip
                        label="Current"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: 12 }} />}
                        sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', fontSize: 10, height: 20 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
                    {new Date(checkpoint.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>

                {/* State Preview */}
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 1.5,
                    maxHeight: 100,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(checkpoint.state, null, 2)}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Restore />}
                    disabled={index === 0}
                    sx={{
                      fontSize: 11,
                      py: 0.5,
                      borderColor: 'rgba(129, 140, 248, 0.5)',
                      color: '#818cf8',
                      '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)', borderColor: '#818cf8' },
                      '&.Mui-disabled': { borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  >
                    Restore
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CompareArrows />}
                    disabled={index === 0}
                    sx={{
                      fontSize: 11,
                      py: 0.5,
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      color: '#6366f1',
                      '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: '#6366f1' },
                      '&.Mui-disabled': { borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  >
                    Compare
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloudDownload />}
                    sx={{
                      fontSize: 11,
                      py: 0.5,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.5)' },
                    }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            ))}

            {/* Info Box */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Typography variant="caption" sx={{ color: '#818cf8', fontSize: 11, display: 'block', mb: 0.5 }}>
                💡 Pro Tip
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                Use "Compare" to see the diff between checkpoints, or "Restore" to revert to a previous state and fork execution from that point.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {onRerun && (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<Refresh />}
              onClick={() => onRerun(nodeData.id)}
              disabled={nodeData.executionStatus === 'running'}
              sx={{
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: '#818cf8',
                '&:hover': { borderColor: '#818cf8', bgcolor: 'rgba(99, 102, 241, 0.1)' },
              }}
            >
              Re-run
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<CloudDownload />}
            onClick={handleDownloadData}
            sx={{
              borderColor: 'rgba(34, 197, 94, 0.5)',
              color: '#22c55e',
              '&:hover': { borderColor: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.1)' },
            }}
          >
            Export
          </Button>
        </Box>
        {nodeData.metadata?.executionId && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, flex: 1 }}>
              Execution ID: {nodeData.metadata.executionId.substring(0, 12)}...
            </Typography>
            <Tooltip title="Copy execution ID">
              <IconButton
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                onClick={() => navigator.clipboard.writeText(nodeData.metadata?.executionId || '')}
              >
                <ContentCopy sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
