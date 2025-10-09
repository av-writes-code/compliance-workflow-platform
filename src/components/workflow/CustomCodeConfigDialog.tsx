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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, Code } from '@mui/icons-material';

interface CustomCodeConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export default function CustomCodeConfigDialog({
  open,
  onClose,
  initialConfig,
  onSave,
}: CustomCodeConfigDialogProps) {
  const [template, setTemplate] = useState(initialConfig?.template || 'gdpr-validator');
  const [code, setCode] = useState(
    initialConfig?.code ||
      `def evaluate(input, output, expected):
    """
    Custom evaluation function for compliance checking
    Returns: True if test passes, False otherwise
    """
    # Example: Check if output matches GDPR requirements
    if 'personal data' in input.lower():
        return output == 'requires-review'
    return output == expected`
  );

  const templates = [
    { id: 'gdpr-validator', name: 'GDPR Compliance Checker' },
    { id: 'regex-matcher', name: 'Regex Pattern Matcher' },
    { id: 'business-rules', name: 'Business Rule Validator' },
  ];

  const handleSave = () => {
    onSave({ template, code });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            <Code sx={{ color: '#818cf8' }} />
            <Typography variant="h6">Configure Custom Code Evaluator</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Template
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Python Code
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="numpy" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
          <Chip label="pandas" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
          <Chip label="jsonschema" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
          <Chip label="sklearn" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }} />
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 1 }}>
          Allowed libraries shown above
        </Typography>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!code.trim()}
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
