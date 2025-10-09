import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, Speed } from '@mui/icons-material';

interface BuiltInEvalsConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export default function BuiltInEvalsConfigDialog({
  open,
  onClose,
  initialConfig,
  onSave,
}: BuiltInEvalsConfigDialogProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    initialConfig?.metrics || ['accuracy', 'precision', 'recall', 'f1Score']
  );
  const [thresholds, setThresholds] = useState(
    initialConfig?.thresholds || {
      accuracy: 85,
      precision: 80,
      recall: 80,
      f1Score: 80,
    }
  );
  const [comparisonType, setComparisonType] = useState(
    initialConfig?.comparisonType || 'exact-match'
  );

  const metrics = [
    { id: 'accuracy', label: 'Accuracy', description: 'Overall correctness' },
    { id: 'precision', label: 'Precision', description: 'True positives / All positives' },
    { id: 'recall', label: 'Recall', description: 'True positives / Actual positives' },
    { id: 'f1Score', label: 'F1 Score', description: 'Harmonic mean of precision & recall' },
    { id: 'coverage', label: 'Coverage', description: 'Percentage of test cases labeled' },
  ];

  const handleMetricToggle = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const handleThresholdChange = (metric: string, value: number) => {
    setThresholds({ ...thresholds, [metric]: value });
  };

  const handleSave = () => {
    onSave({
      metrics: selectedMetrics,
      thresholds,
      comparisonType,
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
            <Speed sx={{ color: '#818cf8' }} />
            <Typography variant="h6">Configure Built-in Evaluations</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Metrics Selection */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5 }}>
          Select Metrics
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {metrics.map((metric) => (
            <Box
              key={metric.id}
              sx={{
                p: 1.5,
                bgcolor: selectedMetrics.includes(metric.id)
                  ? 'rgba(99, 102, 241, 0.15)'
                  : 'rgba(30, 30, 50, 0.4)',
                border: selectedMetrics.includes(metric.id)
                  ? '1px solid #818cf8'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleMetricToggle(metric.id)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': { color: '#818cf8' },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {metric.description}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          ))}
        </Box>

        {/* Threshold Settings */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5 }}>
          Pass/Fail Thresholds (%)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
          {selectedMetrics.map((metricId) => {
            const metric = metrics.find((m) => m.id === metricId);
            if (!metric) return null;
            return (
              <Box key={metricId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {metric.label}
                  </Typography>
                  <Chip
                    label={`${thresholds[metricId]}%`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <Slider
                  value={thresholds[metricId] || 50}
                  onChange={(_, value) => handleThresholdChange(metricId, value as number)}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                  ]}
                  sx={{
                    color: '#818cf8',
                    '& .MuiSlider-markLabel': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.7rem',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Comparison Type */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5 }}>
          Comparison Method
        </Typography>
        <FormControl fullWidth>
          <Select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <MenuItem value="exact-match">Exact Match</MenuItem>
            <MenuItem value="fuzzy-match">Fuzzy Match (90% similarity)</MenuItem>
            <MenuItem value="semantic">Semantic Similarity (embedding-based)</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 0.5 }}>
          {comparisonType === 'exact-match' && 'Outputs must match expected values exactly'}
          {comparisonType === 'fuzzy-match' && 'Allows minor variations in outputs'}
          {comparisonType === 'semantic' && 'Uses AI to compare meaning rather than exact wording'}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={selectedMetrics.length === 0}
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
