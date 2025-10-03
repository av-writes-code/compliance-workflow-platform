import { Handle, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import { SmartToy, CallSplit } from '@mui/icons-material';

export function StandardNode({ data }: { data: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minWidth: 200,
        bgcolor: 'rgba(30, 30, 50, 0.9)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#6366f1',
          width: 16,
          height: 16,
          border: '3px solid white',
          cursor: 'crosshair',
          zIndex: 10
        }}
        isConnectable={true}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1',
          }}
        >
          {data.icon || <SmartToy />}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
            {data.label}
          </Typography>
          {data.subtitle && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {data.subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Connection points for sub-nodes */}
      {data.showSubNodes && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
          {['Chat Model', 'Memory', 'Tool'].map((label, idx) => (
            <Handle
              key={idx}
              type="source"
              position={Position.Bottom}
              id={`sub-${idx}`}
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                width: 8,
                height: 8,
                bottom: -15,
                left: `${30 + idx * 30}%`,
              }}
            />
          ))}
        </Box>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#10b981',
          width: 16,
          height: 16,
          border: '3px solid white',
          cursor: 'crosshair',
          zIndex: 10
        }}
        isConnectable={true}
      />
    </Box>
  );
}

export function DecisionNode({ data }: { data: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 150,
        height: 150,
        transform: 'rotate(45deg)',
        bgcolor: 'rgba(30, 30, 50, 0.9)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6366f1',
          width: 12,
          height: 12,
          border: '2px solid white',
          left: '50%',
          top: -6,
          cursor: 'crosshair'
        }}
      />

      <Box sx={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
        <CallSplit sx={{ color: '#6366f1', fontSize: 28, mb: 0.5 }} />
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, display: 'block' }}>
          {data.label}
        </Typography>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{
          background: '#10b981',
          width: 12,
          height: 12,
          border: '2px solid white',
          right: -6,
          top: '30%',
          cursor: 'crosshair'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{
          background: '#ef4444',
          width: 12,
          height: 12,
          border: '2px solid white',
          right: -6,
          top: '70%',
          cursor: 'crosshair'
        }}
      />
    </Box>
  );
}

export function CircularNode({ data }: { data: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: '50%',
        bgcolor: 'rgba(30, 30, 50, 0.95)',
        border: '2px solid rgba(99, 102, 241, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6366f1',
          width: 10,
          height: 10,
          border: '2px solid white',
          cursor: 'crosshair'
        }}
      />

      {data.icon}
      <Typography variant="caption" sx={{ color: 'white', fontSize: 10, textAlign: 'center' }}>
        {data.label}
      </Typography>
      {data.subtitle && (
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 9 }}>
          {data.subtitle}
        </Typography>
      )}
    </Box>
  );
}
