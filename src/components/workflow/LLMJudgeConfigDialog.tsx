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
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, Gavel } from '@mui/icons-material';

interface LLMJudgeConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
}

export default function LLMJudgeConfigDialog({
  open,
  onClose,
  initialConfig,
  onSave,
}: LLMJudgeConfigDialogProps) {
  const [model, setModel] = useState(initialConfig?.model || 'claude-sonnet-4.5');
  const [prompt, setPrompt] = useState(
    initialConfig?.prompt ||
      'Evaluate if the output correctly identifies compliance violations. Consider accuracy, completeness, and adherence to regulatory requirements.'
  );
  const [scoringType, setScoringType] = useState(initialConfig?.scoringType || 'categorical');
  const [categories, setCategories] = useState<string[]>(
    initialConfig?.categories || ['compliant', 'violation', 'requires-review']
  );

  const promptTemplates = [
    {
      id: 'gdpr-compliance',
      name: 'GDPR Compliance Assessment',
      prompt:
        'Evaluate if the output correctly addresses GDPR requirements. Score as:\n- compliant: Fully meets GDPR standards\n- violation: Clear non-compliance\n- requires-review: Ambiguous or borderline case',
    },
    {
      id: 'fraud-detection',
      name: 'Fraud Detection Quality',
      prompt:
        'Assess the fraud detection output. Score as:\n- clear: Legitimate transaction\n- flagged: Suspicious, requires review\n- blocked: High-risk fraud',
    },
    {
      id: 'content-moderation',
      name: 'Content Moderation',
      prompt:
        'Evaluate if content moderation is appropriate. Score as:\n- safe: Content is acceptable\n- requires-review: Potentially problematic\n- violation: Clear policy violation',
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId);
    if (template) {
      setPrompt(template.prompt);
    }
  };

  const handleSave = () => {
    onSave({
      model,
      prompt,
      scoringType,
      categories: scoringType === 'categorical' ? categories : undefined,
    });
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
            <Gavel sx={{ color: '#818cf8' }} />
            <Typography variant="h6">Configure LLM-as-a-Judge</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Use AI to evaluate outputs based on custom criteria
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Model Selection */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Judge Model
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <MenuItem value="claude-sonnet-4.5">Claude Sonnet 4.5 (Recommended)</MenuItem>
            <MenuItem value="claude-sonnet-4">Claude Sonnet 4</MenuItem>
            <MenuItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</MenuItem>
            <MenuItem value="nova-premier">Amazon Nova Premier (Most Capable)</MenuItem>
            <MenuItem value="nova-pro">Amazon Nova Pro (Fast & Accurate)</MenuItem>
            <MenuItem value="nova-lite">Amazon Nova Lite (Lightning Fast)</MenuItem>
            <MenuItem value="nova-micro">Amazon Nova Micro (Lowest Latency)</MenuItem>
          </Select>
        </FormControl>

        {/* Prompt Templates */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Evaluation Prompt Template
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          {promptTemplates.map((template) => (
            <Chip
              key={template.id}
              label={template.name}
              onClick={() => handleTemplateSelect(template.id)}
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.3)',
                },
              }}
            />
          ))}
        </Box>

        {/* Prompt Text Area */}
        <TextField
          fullWidth
          multiline
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what the LLM should evaluate..."
          variant="outlined"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        />
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 3 }}>
          Tip: Use {`{{input}}`}, {`{{output}}`}, and {`{{expected}}`} to reference test case fields
        </Typography>

        {/* Scoring Type */}
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
          Scoring Type
        </Typography>
        <RadioGroup value={scoringType} onChange={(e) => setScoringType(e.target.value)}>
          <FormControlLabel
            value="boolean"
            control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: '#818cf8' } }} />}
            label={
              <Box>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Boolean (Pass/Fail)
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Simple true/false evaluation
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="categorical"
            control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: '#818cf8' } }} />}
            label={
              <Box>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Categorical (Multiple Options)
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Choose from predefined categories
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="continuous"
            control={<Radio sx={{ color: 'rgba(255, 255, 255, 0.5)', '&.Mui-checked': { color: '#818cf8' } }} />}
            label={
              <Box>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Continuous (0-100 Score)
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Numerical rating scale
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        {/* Categories (only for categorical) */}
        {scoringType === 'categorical' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Expected categories: {categories.join(', ')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!prompt.trim()}
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
