import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import {
  SmartToy,
  CallSplit,
  Memory,
  IntegrationInstructions,
  Security,
  Loop as LoopIcon,
  Webhook,
  AccessTime,
  Description,
  Psychology,
  Calculate,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
} from '@mui/icons-material';

// Icon mapping for serializable icon names
const iconMap: Record<string, any> = {
  SmartToy,
  Memory,
  IntegrationInstructions,
  Security,
  LoopIcon,
  Webhook,
  AccessTime,
  Description,
  Psychology,
  Calculate,
};

function getIcon(iconName: string | any) {
  // Only accept strings, convert to icon component
  if (typeof iconName === 'string' && iconMap[iconName]) {
    const IconComponent = iconMap[iconName];
    return <IconComponent />;
  }
  // Default fallback
  return <SmartToy />;
}

export function StandardNode({ data }: { data: any }) {
  const executionStatus = data.executionStatus || 'idle'; // 'idle' | 'running' | 'completed' | 'failed'
  const errorMessage = data.errorMessage; // Optional error message for failed state
  const [showError, setShowError] = useState(false);

  // Step-through debugger states
  const isCurrentStep = data.isCurrentStep || false;
  const stepNumber = data.stepNumber;
  const isStepCompleted = data.isStepCompleted || false;
  const isStepPending = data.isStepPending || false;
  const hasBreakpoint = data.hasBreakpoint || false;
  const isPausedAtBreakpoint = data.isPausedAtBreakpoint || false;

  const statusColors = {
    idle: { border: 'rgba(99, 102, 241, 0.3)', bg: 'rgba(30, 30, 50, 0.95)' },
    running: { border: 'rgba(34, 197, 94, 0.6)', bg: 'rgba(34, 197, 94, 0.05)' },
    completed: { border: 'rgba(99, 102, 241, 0.6)', bg: 'rgba(99, 102, 241, 0.05)' },
    failed: { border: 'rgba(239, 68, 68, 0.8)', bg: 'rgba(239, 68, 68, 0.1)' },
  };

  // Override with step-through styling
  let currentStatus = statusColors[executionStatus as keyof typeof statusColors] || statusColors.idle;

  // Paused at breakpoint takes highest priority
  if (isPausedAtBreakpoint) {
    currentStatus = {
      border: 'rgba(251, 191, 36, 0.9)',
      bg: 'rgba(251, 191, 36, 0.15)',
    };
  } else if (isCurrentStep) {
    currentStatus = {
      border: 'rgba(129, 140, 248, 0.9)',
      bg: 'rgba(129, 140, 248, 0.15)',
    };
  } else if (isStepCompleted) {
    currentStatus = {
      border: 'rgba(34, 197, 94, 0.6)',
      bg: 'rgba(34, 197, 94, 0.08)',
    };
  } else if (isStepPending) {
    currentStatus = {
      border: 'rgba(99, 102, 241, 0.2)',
      bg: 'rgba(30, 30, 50, 0.6)',
    };
  }

  const handleClick = () => {
    if (data.onInspect) {
      data.onInspect();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data.onToggleBreakpoint) {
      data.onToggleBreakpoint();
    }
  };

  return (
    <Box
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      sx={{
        position: 'relative',
        minWidth: 200,
        bgcolor: currentStatus.bg,
        border: `2px solid ${currentStatus.border}`,
        borderRadius: 2,
        p: 2,
        transition: 'all 0.3s',
        cursor: data.onInspect ? 'pointer' : 'default',
        boxShadow: isPausedAtBreakpoint
          ? '0 0 25px rgba(251, 191, 36, 0.5)'
          : isCurrentStep
            ? '0 0 20px rgba(129, 140, 248, 0.4)'
            : 'none',
        animation: isPausedAtBreakpoint
          ? 'pulse-glow-yellow 2s infinite'
          : isCurrentStep
            ? 'pulse-glow 2s infinite'
            : 'none',
        opacity: isStepPending ? 0.5 : 1,
        '@keyframes pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(129, 140, 248, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(129, 140, 248, 0.7)' },
        },
        '@keyframes pulse-glow-yellow': {
          '0%, 100%': { boxShadow: '0 0 25px rgba(251, 191, 36, 0.5)' },
          '50%': { boxShadow: '0 0 35px rgba(251, 191, 36, 0.8)' },
        },
        '&:hover': {
          border: `2px solid rgba(99, 102, 241, 0.6)`,
          transform: data.onInspect ? 'translateY(-1px)' : 'none',
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#6366f1',
          width: 12,
          height: 12,
          border: 'none',
          cursor: 'pointer',
          opacity: 0.6,
        }}
        isConnectable={true}
      />

      {/* Breakpoint Indicator */}
      {hasBreakpoint && (
        <Box
          sx={{
            position: 'absolute',
            top: -6,
            left: -6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: '#ef4444',
            border: '2px solid rgba(30, 30, 50, 0.95)',
            zIndex: 10,
          }}
        />
      )}

      {/* Step Number Badge or Breakpoint Pause Badge */}
      {isPausedAtBreakpoint ? (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            px: 1,
            height: 24,
            borderRadius: 3,
            bgcolor: '#fbbf24',
            border: '2px solid rgba(30, 30, 50, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            zIndex: 10,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(30, 30, 50, 0.95)', fontWeight: 700, fontSize: 10 }}>
            ⏸ BP
          </Typography>
        </Box>
      ) : stepNumber !== undefined && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            minWidth: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: isCurrentStep ? '#818cf8' : '#22c55e',
            border: '2px solid rgba(30, 30, 50, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: 10 }}>
            {stepNumber}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: isCurrentStep ? 'rgba(129, 140, 248, 0.25)' : 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCurrentStep ? '#818cf8' : '#6366f1',
          }}
        >
          {getIcon(data.icon)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 14 }}>
            {data.label}
          </Typography>
          {data.subtitle && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }}>
              {data.subtitle}
            </Typography>
          )}
        </Box>
        {/* Execution Status Indicator - Show checkmark for completed steps */}
        {isStepCompleted && (
          <CheckCircle sx={{ fontSize: 20, color: '#22c55e' }} />
        )}
        {executionStatus === 'running' && !isCurrentStep && (
          <CircularProgress size={20} sx={{ color: '#22c55e' }} />
        )}
        {executionStatus === 'completed' && !isStepCompleted && (
          <CheckCircle sx={{ fontSize: 20, color: '#6366f1' }} />
        )}
        {executionStatus === 'failed' && (
          <Tooltip title={errorMessage || 'Execution failed'} arrow placement="top">
            <ErrorIcon
              sx={{
                fontSize: 20,
                color: '#ef4444',
                cursor: 'pointer',
                animation: 'pulse 2s infinite'
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Error Banner */}
      {executionStatus === 'failed' && errorMessage && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Warning sx={{ fontSize: 14, color: '#ef4444' }} />
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, fontSize: 10 }}>
              ERROR
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10, display: 'block' }}>
            {errorMessage.length > 60 ? `${errorMessage.substring(0, 60)}...` : errorMessage}
          </Typography>
        </Box>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#10b981',
          width: 12,
          height: 12,
          border: 'none',
          cursor: 'pointer',
          opacity: 0.6,
        }}
        isConnectable={true}
      />
    </Box>
  );
}

export function DecisionNode({ data }: { data: any }) {
  const size = 100; // Diamond size (corner to corner)
  const isReadOnly = data.isReadOnly || false;

  // Decision nodes should hide handles in read-only mode (production)
  // Standard nodes keep handles visible for design consistency

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data.onToggleBreakpoint) {
      data.onToggleBreakpoint();
    }
  };

  return (
    <Box
      onContextMenu={handleContextMenu}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG Diamond Shape */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
        }}
      >
        <path
          d={`M ${size/2} 0 L ${size} ${size/2} L ${size/2} ${size} L 0 ${size/2} Z`}
          fill="rgba(30, 30, 50, 0.95)"
          stroke={
            data.isPausedAtBreakpoint
              ? '#fbbf24'
              : data.isCurrentStep
              ? '#22c55e'
              : data.isStepCompleted
              ? '#22c55e'
              : 'rgba(99, 102, 241, 0.3)'
          }
          strokeWidth={data.isPausedAtBreakpoint || data.isCurrentStep ? '3' : '1'}
          style={{
            transition: 'stroke 0.2s, stroke-width 0.2s',
            filter: data.isPausedAtBreakpoint ? 'drop-shadow(0 0 8px #fbbf24)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (!data.isPausedAtBreakpoint && !data.isCurrentStep) {
              e.currentTarget.setAttribute('stroke', 'rgba(99, 102, 241, 0.6)');
            }
          }}
          onMouseLeave={(e) => {
            if (!data.isPausedAtBreakpoint && !data.isCurrentStep) {
              e.currentTarget.setAttribute('stroke', data.isStepCompleted ? '#22c55e' : 'rgba(99, 102, 241, 0.3)');
            }
          }}
        />
      </svg>

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <CallSplit sx={{ color: '#6366f1', fontSize: 20, mb: 0.5 }} />
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, display: 'block', fontSize: 11 }}>
          {data.label}
        </Typography>
      </Box>

      {/* Target handle - Left corner */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#6366f1',
          width: 10,
          height: 10,
          border: 'none',
          left: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          opacity: isReadOnly ? 0 : 0.6,
        }}
        isConnectable={!isReadOnly}
      />

      {/* Source handle - Top corner (true branch) */}
      <Handle
        type="source"
        id="true"
        position={Position.Top}
        style={{
          background: '#10b981',
          width: 10,
          height: 10,
          border: 'none',
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          opacity: isReadOnly ? 0 : 0.6,
        }}
        isConnectable={!isReadOnly}
      />

      {/* Source handle - Bottom corner (false branch) */}
      <Handle
        type="source"
        id="false"
        position={Position.Bottom}
        style={{
          background: '#ef4444',
          width: 10,
          height: 10,
          border: 'none',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          opacity: isReadOnly ? 0 : 0.6,
        }}
        isConnectable={!isReadOnly}
      />

      {/* Source handle - Right corner (alternate/third path) */}
      <Handle
        type="source"
        id="alternate"
        position={Position.Right}
        style={{
          background: '#f59e0b',
          width: 10,
          height: 10,
          border: 'none',
          right: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          opacity: isReadOnly ? 0 : 0.6,
        }}
        isConnectable={!isReadOnly}
      />

      {/* Breakpoint Indicator */}
      {data.hasBreakpoint && (
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '42%',
            width: 14,
            height: 14,
            borderRadius: '50%',
            bgcolor: '#ef4444',
            border: '2px solid #0f0f1e',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: 'white',
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export function CircularNode({ data }: { data: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 90,
        height: 90,
        borderRadius: '50%',
        bgcolor: 'rgba(30, 30, 50, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        '&:hover': {
          border: '1px solid rgba(99, 102, 241, 0.6)',
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6366f1',
          width: 8,
          height: 8,
          border: 'none',
          cursor: 'pointer',
          opacity: 0.6,
        }}
        isConnectable={true}
      />

      {data.icon}
      <Typography variant="caption" sx={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 500 }}>
        {data.label}
      </Typography>
      {data.subtitle && (
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 9 }}>
          {data.subtitle}
        </Typography>
      )}
    </Box>
  );
}

export function GhostNode({ data }: { data: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 24,
        height: 24,
        borderRadius: '50%',
        bgcolor: 'rgba(99, 102, 241, 0.1)',
        border: '2px dashed rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'rgba(99, 102, 241, 0.2)',
          border: '2px dashed rgba(99, 102, 241, 0.6)',
          transform: 'scale(1.2)',
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#6366f1',
          width: 10,
          height: 10,
          border: '2px solid rgba(30, 30, 50, 0.95)',
          left: -5,
          cursor: 'crosshair',
          opacity: 0.8,
        }}
        isConnectable={true}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'rgba(99, 102, 241, 0.5)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#10b981',
          width: 10,
          height: 10,
          border: '2px solid rgba(30, 30, 50, 0.95)',
          right: -5,
          cursor: 'crosshair',
          opacity: 0.8,
        }}
        isConnectable={true}
      />
    </Box>
  );
}
