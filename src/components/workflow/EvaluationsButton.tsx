import { Button } from '@mui/material';
import { Assessment } from '@mui/icons-material';

interface EvaluationsButtonProps {
  onClick: () => void;
}

export default function EvaluationsButton({ onClick }: EvaluationsButtonProps) {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<Assessment />}
      onClick={onClick}
      sx={{
        borderColor: 'rgba(99, 102, 241, 0.5)',
        color: '#818cf8',
        '&:hover': {
          borderColor: '#818cf8',
          bgcolor: 'rgba(99, 102, 241, 0.1)',
        },
      }}
    >
      Evaluations
    </Button>
  );
}
