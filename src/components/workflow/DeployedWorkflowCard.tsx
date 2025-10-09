import { Card, CardContent, Box, Typography, Chip, IconButton } from '@mui/material';
import { PlayArrow, Visibility, MoreVert, CheckCircle, Schedule } from '@mui/icons-material';

interface DeployedWorkflowCardProps {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'archived';
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  avgExecutionTime: string;
  onView: (id: string) => void;
  onRun: (id: string) => void;
}

export default function DeployedWorkflowCard({
  id,
  name,
  version,
  status,
  lastRun = 'Never',
  totalRuns,
  successRate,
  avgExecutionTime,
  onView,
  onRun,
}: DeployedWorkflowCardProps) {
  const statusConfig = {
    active: { label: 'Active', color: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.2)' },
    inactive: { label: 'Inactive', color: '#fbbf24', bgcolor: 'rgba(251, 191, 36, 0.2)' },
    archived: { label: 'Archived', color: '#9ca3af', bgcolor: 'rgba(156, 163, 175, 0.2)' },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card
      sx={{
        bgcolor: 'rgba(30, 30, 50, 0.6)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          border: '1px solid rgba(99, 102, 241, 0.6)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: 16 }}>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Version {version}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={currentStatus.label}
              size="small"
              sx={{
                bgcolor: currentStatus.bgcolor,
                color: currentStatus.color,
                fontWeight: 500,
                fontSize: 11,
              }}
            />
            <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <MoreVert sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
              TOTAL RUNS
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {totalRuns.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
              SUCCESS RATE
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {successRate}%
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
              AVG TIME
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {avgExecutionTime}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
              LAST RUN
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
              {lastRun}
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box
            onClick={() => onView(id)}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 1,
              borderRadius: 1,
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.3)',
              },
            }}
          >
            <Visibility sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              View
            </Typography>
          </Box>
          <Box
            onClick={() => onRun(id)}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 1,
              borderRadius: 1,
              bgcolor: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(34, 197, 94, 0.3)',
              },
            }}
          >
            <PlayArrow sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              Run
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
