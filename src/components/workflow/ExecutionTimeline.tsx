import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Schedule, PlayArrow } from '@mui/icons-material';

interface ExecutionEvent {
  id: string;
  nodeId: string;
  nodeName: string;
  status: 'completed' | 'failed' | 'running';
  timestamp: string;
  duration?: string;
  details?: string;
}

interface ExecutionTimelineProps {
  events: ExecutionEvent[];
}

export default function ExecutionTimeline({ events }: ExecutionTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayArrow sx={{ fontSize: 16, color: '#22c55e' }} />;
      case 'completed':
        return <CheckCircle sx={{ fontSize: 16, color: '#6366f1' }} />;
      case 'failed':
        return <ErrorIcon sx={{ fontSize: 16, color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' };
      case 'completed':
        return { bg: 'rgba(99, 102, 241, 0.2)', text: '#6366f1' };
      case 'failed':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' };
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 320,
        maxHeight: 400,
        bgcolor: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 2,
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule sx={{ fontSize: 18, color: '#818cf8' }} />
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            Execution Timeline
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {events.length} events
        </Typography>
      </Box>

      {/* Timeline Events */}
      <Box sx={{ p: 2, maxHeight: 320, overflowY: 'auto' }}>
        {events.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', py: 4 }}>
            No execution events yet
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {events.map((event) => {
              const statusColor = getStatusColor(event.status);
              return (
                <Box
                  key={event.id}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:last-child': { borderBottom: 'none', pb: 0 },
                  }}
                >
                  {/* Timeline Marker */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: statusColor.text,
                        boxShadow: `0 0 8px ${statusColor.text}`,
                      }}
                    />
                    <Box
                      sx={{
                        width: 2,
                        flexGrow: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        mt: 0.5,
                      }}
                    />
                  </Box>

                  {/* Event Details */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {event.nodeName}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(event.status)}
                        label={event.status}
                        size="small"
                        sx={{
                          height: 20,
                          bgcolor: statusColor.bg,
                          color: statusColor.text,
                          fontSize: 10,
                          '& .MuiChip-icon': { color: statusColor.text },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}>
                        {event.timestamp}
                      </Typography>
                      {event.duration && (
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}>
                          {event.duration}
                        </Typography>
                      )}
                    </Box>
                    {event.details && (
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, mt: 0.5, display: 'block' }}>
                        {event.details}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
