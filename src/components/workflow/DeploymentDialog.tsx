import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Rocket, Close } from '@mui/icons-material';

interface DeploymentDialogProps {
  open: boolean;
  onClose: () => void;
  onDeploy: (data: { version: string; workflowName: string }) => void;
  workflowName?: string;
}

export default function DeploymentDialog({
  open,
  onClose,
  onDeploy,
  workflowName = 'Current Workflow',
}: DeploymentDialogProps) {
  const [version, setVersion] = useState('');
  const [checklist, setChecklist] = useState({
    evaluationPassed: false,
    approvalObtained: false,
    nodesValidated: false,
  });

  const handleChecklistChange = (item: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const allChecked = Object.values(checklist).every((v) => v);
  const canDeploy = allChecked && version.trim().length > 0;

  const handleSubmit = () => {
    if (canDeploy) {
      onDeploy({ version, workflowName });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rocket sx={{ color: '#6366f1' }} />
            <Typography variant="h6">Deploy to Production</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Deploying: <strong>{workflowName}</strong>
          </Typography>

          <TextField
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            fullWidth
            placeholder="e.g., v2.0.0"
            helperText="Enter a version number for this deployment"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Pre-Deployment Checklist
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.evaluationPassed}
                    onChange={() => handleChecklistChange('evaluationPassed')}
                  />
                }
                label="Evaluation passed with acceptable accuracy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.approvalObtained}
                    onChange={() => handleChecklistChange('approvalObtained')}
                  />
                }
                label="Approval obtained from stakeholders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checklist.nodesValidated}
                    onChange={() => handleChecklistChange('nodesValidated')}
                  />
                }
                label="All workflow nodes validated"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Rocket />}
          onClick={handleSubmit}
          disabled={!canDeploy}
          sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#5558e3' } }}
        >
          Deploy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
