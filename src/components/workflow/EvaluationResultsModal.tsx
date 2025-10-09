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
  Chip,
  IconButton,
} from '@mui/material';
import { Close, CheckCircle, Cancel, Edit, Save } from '@mui/icons-material';

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedLabel: string;
  actualResult: string;
  labelStatus: 'labeled' | 'unlabeled';
  matchStatus: 'match' | 'mismatch' | 'pending';
  confidence?: number;
  notes?: string;
}

interface EvaluationResultsModalProps {
  open: boolean;
  onClose: () => void;
  testCase: TestCase | null;
  onSave?: (updatedTestCase: TestCase) => void;
}

export default function EvaluationResultsModal({
  open,
  onClose,
  testCase,
  onSave,
}: EvaluationResultsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpectedLabel, setEditedExpectedLabel] = useState('');
  const [editedActualResult, setEditedActualResult] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  if (!testCase) return null;

  const handleEdit = () => {
    setEditedExpectedLabel(testCase.expectedLabel);
    setEditedActualResult(testCase.actualResult);
    setEditedNotes(testCase.notes || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const matchStatus =
      editedExpectedLabel === editedActualResult ? 'match' :
      editedActualResult === 'unlabeled' ? 'pending' :
      'mismatch';

    const updatedTestCase: TestCase = {
      ...testCase,
      expectedLabel: editedExpectedLabel,
      actualResult: editedActualResult,
      labelStatus: editedActualResult === 'unlabeled' ? 'unlabeled' : 'labeled',
      matchStatus,
      notes: editedNotes,
    };

    onSave?.(updatedTestCase);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const borderColor =
    testCase.matchStatus === 'match' ? '#10b981' :
    testCase.matchStatus === 'mismatch' ? '#ef4444' :
    '#6b7280';

  const statusIcon =
    testCase.matchStatus === 'match' ? <CheckCircle sx={{ color: '#10b981', fontSize: 24 }} /> :
    testCase.matchStatus === 'mismatch' ? <Cancel sx={{ color: '#ef4444', fontSize: 24 }} /> :
    null;

  const labelOptions = ['compliant', 'violation', 'requires-review', 'flagged', 'blocked', 'clear', 'unlabeled'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          border: `2px solid ${borderColor}`,
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {statusIcon}
            <Typography variant="h6">{testCase.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={testCase.labelStatus === 'labeled' ? 'Labeled' : 'Unlabeled'}
              size="small"
              sx={{
                bgcolor: testCase.labelStatus === 'labeled' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                color: testCase.labelStatus === 'labeled' ? '#10b981' : '#9ca3af',
              }}
            />
            <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Scenario Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
            Scenario
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', p: 2, bgcolor: 'rgba(30, 30, 50, 0.6)', borderRadius: 1 }}>
            {testCase.input}
          </Typography>
        </Box>

        {/* Expected vs Actual Comparison */}
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
              Expected Label
            </Typography>
            {isEditing ? (
              <FormControl fullWidth size="small">
                <Select
                  value={editedExpectedLabel}
                  onChange={(e) => setEditedExpectedLabel(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  {labelOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={testCase.expectedLabel}
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
              Actual Result
            </Typography>
            {isEditing ? (
              <FormControl fullWidth size="small">
                <Select
                  value={editedActualResult}
                  onChange={(e) => setEditedActualResult(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  {labelOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={testCase.actualResult}
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Confidence Score */}
        {testCase.confidence && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
              Confidence Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${testCase.confidence * 100}%`,
                    height: '100%',
                    bgcolor: testCase.confidence >= 0.8 ? '#10b981' : testCase.confidence >= 0.6 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: 'white', minWidth: '50px' }}>
                {(testCase.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Notes */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
            Notes / Comments
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Add notes about this evaluation..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            />
          ) : (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: testCase.notes ? 'normal' : 'italic' }}>
              {testCase.notes || 'No notes added'}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', gap: 1, px: 3, py: 2 }}>
        {isEditing ? (
          <>
            <Button onClick={handleCancel} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
            >
              Edit Labels
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
