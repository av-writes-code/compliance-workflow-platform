import { Box, Button, Typography, Chip, IconButton, Tooltip, Divider, Switch, FormControlLabel } from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  SkipNext,
  SkipPrevious,
  FastForward,
  Adjust,
  Speed,
} from '@mui/icons-material';

interface ExecutionControlBarProps {
  workflowName: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onContinueToBreakpoint?: () => void;
  executionTime?: string;
  completedSteps?: number;
  totalSteps?: number;
  currentStep?: number;
  breakpointsEnabled?: boolean;
  onToggleBreakpoints?: (enabled: boolean) => void;
  executionSpeed?: 'slow' | 'normal' | 'fast';
  onSpeedChange?: (speed: 'slow' | 'normal' | 'fast') => void;
}

export default function ExecutionControlBar({
  workflowName,
  status,
  onRun,
  onPause,
  onStop,
  onStepForward,
  onStepBackward,
  onContinueToBreakpoint,
  executionTime = '0s',
  completedSteps = 0,
  totalSteps = 0,
  currentStep = 0,
  breakpointsEnabled = false,
  onToggleBreakpoints,
  executionSpeed = 'normal',
  onSpeedChange,
}: ExecutionControlBarProps) {
  const statusConfig = {
    idle: { label: 'Ready', color: 'rgba(156, 163, 175, 0.2)', textColor: '#9ca3af', icon: null },
    running: { label: 'Running', color: 'rgba(34, 197, 94, 0.2)', textColor: '#22c55e', icon: <PlayArrow sx={{ fontSize: 16 }} /> },
    paused: { label: 'Paused', color: 'rgba(251, 191, 36, 0.2)', textColor: '#fbbf24', icon: <Pause sx={{ fontSize: 16 }} /> },
    completed: { label: 'Completed', color: 'rgba(99, 102, 241, 0.2)', textColor: '#6366f1', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    failed: { label: 'Failed', color: 'rgba(239, 68, 68, 0.2)', textColor: '#ef4444', icon: <ErrorIcon sx={{ fontSize: 16 }} /> },
  };

  const currentStatus = statusConfig[status];

  const speedIcons = {
    slow: '0.5x',
    normal: '1x',
    fast: '2x',
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        bgcolor: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 2,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        backdropFilter: 'blur(8px)',
        maxWidth: '95vw',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 1,
        },
      }}
    >
      {/* Workflow Name */}
      <Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
          WORKFLOW
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
          {workflowName}
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Status */}
      <Chip
        icon={currentStatus.icon || undefined}
        label={currentStatus.label}
        size="small"
        sx={{
          bgcolor: currentStatus.color,
          color: currentStatus.textColor,
          fontWeight: 500,
          '& .MuiChip-icon': { color: currentStatus.textColor },
        }}
      />

      {/* Progress */}
      {totalSteps > 0 && (
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
            PROGRESS
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
            {completedSteps} / {totalSteps} steps
          </Typography>
        </Box>
      )}

      {/* Execution Time */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Schedule sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {executionTime}
        </Typography>
      </Box>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Step-Through Debugger Controls */}
      {(onStepForward || onStepBackward || onContinueToBreakpoint) && (
        <>
          <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9, mb: 0.5, display: 'block' }}>
              DEBUGGER
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onStepBackward && (
              <Tooltip title="Step Backward (Time Travel)" arrow>
                <span>
                  <IconButton
                    size="small"
                    disabled={status === 'running' || currentStep === 0}
                    onClick={onStepBackward}
                    sx={{
                      color: '#818cf8',
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                      '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)', borderColor: '#818cf8' },
                      '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    <SkipPrevious sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {onStepForward && (
              <Tooltip title="Step Forward (Execute Next Node)" arrow>
                <span>
                  <IconButton
                    size="small"
                    disabled={status === 'running' || status === 'completed'}
                    onClick={onStepForward}
                    sx={{
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' },
                      '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    <SkipNext sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {onContinueToBreakpoint && breakpointsEnabled && (
              <Tooltip title="Continue to Next Breakpoint" arrow>
                <span>
                  <IconButton
                    size="small"
                    disabled={status === 'completed' || status === 'failed'}
                    onClick={onContinueToBreakpoint}
                    sx={{
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      '&:hover': { bgcolor: 'rgba(251, 191, 36, 0.1)', borderColor: '#fbbf24' },
                      '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    <FastForward sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            </Box>
          </Box>
        </>
      )}

      {/* Breakpoint Mode Toggle */}
      {onToggleBreakpoints && (
        <>
          <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

          <Tooltip title="Enable/Disable Breakpoints" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Adjust sx={{ fontSize: 16, color: breakpointsEnabled ? '#ef4444' : 'rgba(255, 255, 255, 0.3)' }} />
              <Switch
                size="small"
                checked={breakpointsEnabled}
                onChange={(e) => onToggleBreakpoints(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#ef4444' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#ef4444' },
                }}
              />
            </Box>
          </Tooltip>
        </>
      )}

      {/* Execution Speed Control */}
      {onSpeedChange && (
        <>
          <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

          <Tooltip title="Execution Speed" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Speed sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <Chip
                    key={speed}
                    label={speedIcons[speed]}
                    size="small"
                    onClick={() => onSpeedChange(speed)}
                    sx={{
                      fontSize: 10,
                      height: 22,
                      bgcolor: executionSpeed === speed ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      color: executionSpeed === speed ? '#818cf8' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: executionSpeed === speed ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Tooltip>
        </>
      )}

      <Box sx={{ width: 1, height: 40, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Standard Control Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          disabled={status === 'running'}
          onClick={onRun}
          startIcon={<PlayArrow />}
          sx={{
            bgcolor: status === 'running' ? 'rgba(34, 197, 94, 0.3)' : '#22c55e',
            '&:hover': { bgcolor: '#16a34a' },
            '&.Mui-disabled': { bgcolor: 'rgba(34, 197, 94, 0.2)', color: 'rgba(255, 255, 255, 0.3)' },
            px: 2,
          }}
        >
          {status === 'paused' ? 'Resume' : 'Run'}
        </Button>

        <Button
          variant="outlined"
          size="small"
          disabled={status !== 'running'}
          onClick={onPause}
          startIcon={<Pause />}
          sx={{
            borderColor: 'rgba(251, 191, 36, 0.5)',
            color: '#fbbf24',
            px: 1.5,
            '&:hover': {
              bgcolor: 'rgba(251, 191, 36, 0.1)',
              borderColor: '#fbbf24',
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(156, 163, 175, 0.2)',
              color: 'rgba(255, 255, 255, 0.2)'
            },
          }}
        >
          Pause
        </Button>

        <Button
          variant="outlined"
          size="small"
          disabled={status !== 'running' && status !== 'paused'}
          onClick={onStop}
          startIcon={<Stop />}
          sx={{
            borderColor: 'rgba(239, 68, 68, 0.5)',
            color: '#ef4444',
            px: 1.5,
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#ef4444',
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(156, 163, 175, 0.2)',
              color: 'rgba(255, 255, 255, 0.2)'
            },
          }}
        >
          Stop
        </Button>
      </Box>
    </Box>
  );
}
