import { Box, Typography, Chip, Button, IconButton, Divider } from '@mui/material';
import { Close, PlayArrow, TrendingUp, Speed, AttachMoney } from '@mui/icons-material';

interface WorkflowPreviewPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: () => void;
  workflow: {
    id: string;
    name: string;
    version: string;
    status: 'active' | 'inactive' | 'archived';
    lastRun: string;
    totalRuns: number;
    successRate: number;
    avgExecutionTime: string;
    description?: string;
  };
}

export default function WorkflowPreviewPopup({
  open,
  onClose,
  onSelect,
  workflow,
}: WorkflowPreviewPopupProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1300,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Popup */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1301,
          width: 600,
          maxHeight: '80vh',
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 2,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              {workflow.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
              <Chip
                label={workflow.status}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  bgcolor: workflow.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: workflow.status === 'active' ? '#22c55e' : '#9ca3af',
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                v{workflow.version}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
          {/* Description */}
          {workflow.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                {workflow.description}
              </Typography>
            </Box>
          )}

          {/* Workflow Diagram Preview */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
              Workflow Diagram
              <br />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                (Visual preview will render here)
              </Typography>
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

          {/* Stats Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {/* Total Runs */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PlayArrow sx={{ fontSize: 18, color: '#818cf8' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>
                  TOTAL RUNS
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                {workflow.totalRuns.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Last run: {workflow.lastRun}
              </Typography>
            </Box>

            {/* Success Rate */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ fontSize: 18, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>
                  SUCCESS RATE
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#22c55e', fontWeight: 600 }}>
                {workflow.successRate}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {workflow.totalRuns > 0 ? `${Math.round(workflow.totalRuns * workflow.successRate / 100)} successful` : 'No runs yet'}
              </Typography>
            </Box>

            {/* Avg Execution Time */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(251, 191, 36, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Speed sx={{ fontSize: 18, color: '#fbbf24' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>
                  AVG TIME
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                {workflow.avgExecutionTime}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Per execution
              </Typography>
            </Box>

            {/* Estimated Cost */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(168, 85, 247, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney sx={{ fontSize: 18, color: '#a855f7' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>
                  EST. COST
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                $0.12
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Per execution
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onSelect();
              onClose();
            }}
            startIcon={<PlayArrow />}
            sx={{
              bgcolor: '#818cf8',
              '&:hover': { bgcolor: '#6366f1' },
            }}
          >
            Select Workflow
          </Button>
        </Box>
      </Box>
    </>
  );
}
