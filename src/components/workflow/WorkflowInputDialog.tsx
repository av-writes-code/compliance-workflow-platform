import { useState } from 'react';
import {
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Close,
  PlayArrow,
  Code,
  CloudUpload,
  Description,
  Storage,
  Api,
  Webhook,
  AutoAwesome,
  InsertDriveFile,
} from '@mui/icons-material';

interface WorkflowInputDialogProps {
  open: boolean;
  onClose: () => void;
  onRun: (inputData: any) => void;
  workflowName: string;
}

export default function WorkflowInputDialog({
  open,
  onClose,
  workflowName,
  onRun,
}: WorkflowInputDialogProps) {
  const [inputMode, setInputMode] = useState<'form' | 'json' | 'file' | 'integration'>('form');
  const [jsonInput, setJsonInput] = useState('{\n  "claimId": "CLM-2025-001",\n  "amount": 15000,\n  "category": "health"\n}');
  const [formInputs, setFormInputs] = useState({
    claimId: 'CLM-2025-001',
    amount: '15000',
    category: 'health',
  });
  const [jsonError, setJsonError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [integrationType, setIntegrationType] = useState<'s3' | 'api' | 'database' | 'webhook'>('s3');

  const handleFormChange = (field: string, value: string) => {
    setFormInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      JSON.parse(value);
      setJsonError('');
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleRun = () => {
    let inputData;

    if (inputMode === 'json') {
      try {
        inputData = JSON.parse(jsonInput);
      } catch (e) {
        setJsonError('Invalid JSON format');
        return;
      }
    } else {
      inputData = formInputs;
    }

    onRun(inputData);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 450,
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="h6">Workflow Input</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {workflowName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, lineHeight: 1.6 }}>
            💡 <strong>What's this?</strong> Provide the initial data that will flow through your workflow. This simulates a real-world trigger (like a new claim submission) and lets you test how your workflow processes it.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Tab Switcher */}
        <Tabs
          value={inputMode}
          onChange={(_, value) => setInputMode(value)}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 12,
              minHeight: 42,
            },
            '& .Mui-selected': { color: '#818cf8' },
            '& .MuiTabs-indicator': { bgcolor: '#818cf8' },
          }}
        >
          <Tab label="Form" value="form" icon={<Description sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label="JSON" value="json" icon={<Code sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label="File" value="file" icon={<CloudUpload sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label="Integration" value="integration" icon={<Api sx={{ fontSize: 16 }} />} iconPosition="start" />
        </Tabs>

        {/* Form Mode */}
        {inputMode === 'form' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5, display: 'block' }}>
                Claim ID
              </Typography>
              <TextField
                fullWidth
                value={formInputs.claimId}
                onChange={(e) => handleFormChange('claimId', e.target.value)}
                placeholder="e.g., CLM-2025-001"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5, display: 'block' }}>
                Amount ($)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={formInputs.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                placeholder="e.g., 15000"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5, display: 'block' }}>
                Category
              </Typography>
              <TextField
                fullWidth
                value={formInputs.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                placeholder="e.g., health, auto, property"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              />
            </Box>
          </Box>
        )}

        {/* JSON Mode */}
        {inputMode === 'json' && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              error={!!jsonError}
              helperText={jsonError}
              placeholder="Enter JSON input data..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: 13,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: jsonError ? '#ef4444' : 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Provide a valid JSON object with workflow input parameters
              </Typography>
              <Button
                size="small"
                startIcon={<AutoAwesome />}
                onClick={() => setJsonInput('{\n  "claimId": "CLM-2025-001",\n  "amount": 15000,\n  "category": "health"\n}')}
                sx={{ color: '#818cf8', textTransform: 'none', fontSize: 11 }}
              >
                Use Sample
              </Button>
            </Box>
          </Box>
        )}

        {/* File Upload Mode */}
        {inputMode === 'file' && (
          <Box>
            <Box
              sx={{
                border: '2px dashed rgba(99, 102, 241, 0.5)',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                bgcolor: 'rgba(99, 102, 241, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#818cf8',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <CloudUpload sx={{ fontSize: 48, color: '#818cf8', mb: 2 }} />
              <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                {selectedFile ? selectedFile.name : 'Drop files here or click to upload'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Supports CSV, JSON, Excel formats
              </Typography>
            </Box>
            {selectedFile && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(34, 197, 94, 0.1)', borderRadius: 1, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile sx={{ color: '#22c55e', fontSize: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                  <Chip label="Ready" size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }} />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Integration Mode */}
        {inputMode === 'integration' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Data Source</InputLabel>
              <Select
                value={integrationType}
                onChange={(e) => setIntegrationType(e.target.value as any)}
                label="Data Source"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              >
                <MenuItem value="s3">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Storage sx={{ fontSize: 18 }} />
                    AWS S3 Bucket
                  </Box>
                </MenuItem>
                <MenuItem value="api">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Api sx={{ fontSize: 18 }} />
                    REST API
                  </Box>
                </MenuItem>
                <MenuItem value="database">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Storage sx={{ fontSize: 18 }} />
                    Database Query
                  </Box>
                </MenuItem>
                <MenuItem value="webhook">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Webhook sx={{ fontSize: 18 }} />
                    Webhook
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {integrationType === 's3' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Bucket Name"
                  placeholder="my-compliance-bucket"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Object Key / Path"
                  placeholder="claims/2025/data.json"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
              </Box>
            )}

            {integrationType === 'api' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="API Endpoint"
                  placeholder="https://api.example.com/claims"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Headers (JSON)"
                  placeholder='{"Authorization": "Bearer token"}'
                  multiline
                  rows={3}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: 'white', fontFamily: 'monospace', fontSize: 12 },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleRun}
          disabled={inputMode === 'json' && !!jsonError}
          startIcon={<PlayArrow />}
          sx={{
            bgcolor: '#22c55e',
            '&:hover': { bgcolor: '#16a34a' },
          }}
        >
          Run Workflow
        </Button>
      </DialogActions>
    </Drawer>
  );
}
