import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, Person } from '@mui/icons-material';

interface HITLConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export default function HITLConfigDialog({
  open,
  onClose,
  initialConfig,
  onSave,
}: HITLConfigDialogProps) {
  const [reviewers, setReviewers] = useState(initialConfig?.reviewers || ['compliance-team@company.com']);
  const [criteria, setCriteria] = useState<string[]>(
    initialConfig?.criteria || ['Legal accuracy', 'Risk assessment', 'Policy alignment']
  );
  const [priorityRules, setPriorityRules] = useState<string[]>(
    initialConfig?.priorityRules || ['mismatch', 'low-confidence']
  );
  const [sla, setSla] = useState(initialConfig?.sla || '24-hours');

  const handleSave = () => {
    onSave({
      reviewers,
      criteria,
      priorityRules,
      sla,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ color: '#818cf8' }} />
            <Typography variant="h6">Configure Human-in-the-Loop Review</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Reviewers */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Assign Reviewers
        </Typography>
        <TextField
          fullWidth
          value={reviewers.join(', ')}
          onChange={(e) => setReviewers(e.target.value.split(',').map((r) => r.trim()))}
          placeholder="Enter email addresses separated by commas"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        />

        {/* Review Criteria */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Review Criteria
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {['Legal accuracy', 'Risk assessment', 'Policy alignment', 'Regulatory compliance'].map((criterion) => (
            <FormControlLabel
              key={criterion}
              control={
                <Checkbox
                  checked={criteria.includes(criterion)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCriteria([...criteria, criterion]);
                    } else {
                      setCriteria(criteria.filter((c) => c !== criterion));
                    }
                  }}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    '&.Mui-checked': { color: '#818cf8' },
                  }}
                />
              }
              label={<Typography sx={{ color: 'white' }}>{criterion}</Typography>}
            />
          ))}
        </Box>

        {/* Priority Rules */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          When to Request Human Review
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {['All test cases', 'Mismatches only', 'Low confidence (<70%)', 'Specific labels (violation)'].map((rule, idx) => {
            const ruleId = ['all', 'mismatch', 'low-confidence', 'specific-labels'][idx];
            return (
              <FormControlLabel
                key={ruleId}
                control={
                  <Checkbox
                    checked={priorityRules.includes(ruleId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPriorityRules([...priorityRules, ruleId]);
                      } else {
                        setPriorityRules(priorityRules.filter((r) => r !== ruleId));
                      }
                    }}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': { color: '#818cf8' },
                    }}
                  />
                }
                label={<Typography sx={{ color: 'white' }}>{rule}</Typography>}
              />
            );
          })}
        </Box>

        {/* SLA */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Review Deadline (SLA)
        </Typography>
        <FormControl fullWidth>
          <Select
            value={sla}
            onChange={(e) => setSla(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <MenuItem value="1-hour">1 Hour</MenuItem>
            <MenuItem value="4-hours">4 Hours</MenuItem>
            <MenuItem value="24-hours">24 Hours</MenuItem>
            <MenuItem value="3-days">3 Days</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={reviewers.length === 0 || criteria.length === 0}
          sx={{
            bgcolor: '#6366f1',
            '&:hover': { bgcolor: '#4f46e5' },
          }}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}
