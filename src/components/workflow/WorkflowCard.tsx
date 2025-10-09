import { Box, Typography, Paper } from '@mui/material';
import { Bolt } from '@mui/icons-material';

interface WorkflowCardProps {
  title: string;
  description: string;
  variant?: 'primary' | 'default';
  onClick?: () => void;
}

export default function WorkflowCard({ title, description, variant = 'default', onClick }: WorkflowCardProps) {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        p: 3,
        minWidth: 280,
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: variant === 'primary' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: '1px solid',
        borderColor: variant === 'primary' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        zIndex: 1000,
        '&:hover': {
          bgcolor: variant === 'primary' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ color: 'white', mb: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Bolt sx={{ fontSize: 16, color: '#fbbf24' }} />
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}
