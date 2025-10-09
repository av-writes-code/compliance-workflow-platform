import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Tabs,
  Tab,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Edit,
  PlayArrow,
  Save,
  Undo,
  Visibility,
  VisibilityOff,
  Warning,
  ContentCopy,
  RestartAlt,
  CallSplit,
} from '@mui/icons-material';

interface WatchedVariable {
  path: string;
  value: any;
  type: string;
}

interface StateModificationPanelProps {
  open: boolean;
  onClose: () => void;
  currentNodeId?: string;
  currentNodeLabel?: string;
  currentState?: any;
  onUpdateState?: (newState: any) => void;
  onForkExecution?: (fromNodeId: string, newState: any) => void;
}

export default function StateModificationPanel({
  open,
  onClose,
  currentNodeId,
  currentNodeLabel,
  currentState,
  onUpdateState,
  onForkExecution,
}: StateModificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'watchers'>('editor');
  const [editedState, setEditedState] = useState(JSON.stringify(currentState || {}, null, 2));
  const [watchedVars, setWatchedVars] = useState<WatchedVariable[]>([
    { path: 'status', value: 'approved', type: 'string' },
    { path: 'confidence', value: 0.89, type: 'number' },
  ]);
  const [newWatchPath, setNewWatchPath] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleStateChange = (value: string) => {
    setEditedState(value);
    setHasUnsavedChanges(true);

    // Validate JSON
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleSaveState = () => {
    try {
      const parsedState = JSON.parse(editedState);
      if (onUpdateState) {
        onUpdateState(parsedState);
        setHasUnsavedChanges(false);
      }
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleResetState = () => {
    setEditedState(JSON.stringify(currentState || {}, null, 2));
    setHasUnsavedChanges(false);
    setJsonError(null);
  };

  const handleFork = () => {
    try {
      const parsedState = JSON.parse(editedState);
      if (onForkExecution && currentNodeId) {
        onForkExecution(currentNodeId, parsedState);
        setHasUnsavedChanges(false);
      }
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleAddWatch = () => {
    if (!newWatchPath.trim()) return;

    try {
      const state = JSON.parse(editedState);
      const value = newWatchPath.split('.').reduce((obj, key) => obj?.[key], state);
      const type = typeof value;

      setWatchedVars(prev => [
        ...prev,
        { path: newWatchPath, value, type },
      ]);
      setNewWatchPath('');
    } catch (e) {
      // Ignore errors when adding watches
    }
  };

  const removeWatch = (path: string) => {
    setWatchedVars(prev => prev.filter(v => v.path !== path));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 520 },
          bgcolor: '#0a0f1e',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit sx={{ fontSize: 24, color: '#818cf8' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              State Modification
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            <Close />
          </IconButton>
        </Box>
        {currentNodeLabel && (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }}>
            {currentNodeLabel}
          </Typography>
        )}
      </Box>

      {/* Warning Banner */}
      {hasUnsavedChanges && (
        <Alert
          severity="warning"
          sx={{
            m: 2,
            bgcolor: 'rgba(251, 191, 36, 0.1)',
            color: '#fbbf24',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            '& .MuiAlert-icon': { color: '#fbbf24' },
          }}
        >
          You have unsaved changes
        </Alert>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.6)', minHeight: 48, fontSize: 13 },
          '& .Mui-selected': { color: '#818cf8' },
          '& .MuiTabs-indicator': { bgcolor: '#818cf8' },
        }}
      >
        <Tab label="JSON Editor" value="editor" />
        <Tab label="Variable Watchers" value="watchers" />
      </Tabs>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {activeTab === 'editor' && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
              Edit State (JSON)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, fontSize: 12 }}>
              Modify the current node state directly. Changes will be applied when you click "Apply Changes" or you can fork the execution from this point.
            </Typography>

            {/* JSON Editor */}
            <TextField
              multiline
              fullWidth
              rows={20}
              value={editedState}
              onChange={(e) => handleStateChange(e.target.value)}
              error={!!jsonError}
              helperText={jsonError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  '& fieldset': { borderColor: jsonError ? '#ef4444' : 'rgba(99, 102, 241, 0.3)' },
                  '&:hover fieldset': { borderColor: jsonError ? '#ef4444' : '#818cf8' },
                },
                '& .MuiFormHelperText-root': { color: '#ef4444', fontFamily: 'monospace', fontSize: 11 },
              }}
            />

            {/* Quick Actions */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopy />}
                onClick={() => navigator.clipboard.writeText(editedState)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  fontSize: 11,
                }}
              >
                Copy
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Undo />}
                onClick={handleResetState}
                disabled={!hasUnsavedChanges}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  fontSize: 11,
                }}
              >
                Reset
              </Button>
            </Box>

            {/* Info Box */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 1, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Typography variant="caption" sx={{ color: '#818cf8', fontSize: 11, display: 'block', mb: 0.5 }}>
                💡 Time-Travel Debugging
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>
                Use "Fork Execution" to create a new execution branch from this state. The original execution will remain unchanged.
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 'watchers' && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5, fontWeight: 600 }}>
              Variable Watchers
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, fontSize: 12 }}>
              Track specific variables in the state. Watchers update in real-time as you step through execution.
            </Typography>

            {/* Add Watch */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g., user.profile.name"
                value={newWatchPath}
                onChange={(e) => setNewWatchPath(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWatch()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    fontSize: 13,
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: '#818cf8' },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddWatch}
                disabled={!newWatchPath.trim()}
                sx={{ bgcolor: '#818cf8', '&:hover': { bgcolor: '#6366f1' }, whiteSpace: 'nowrap' }}
              >
                Add Watch
              </Button>
            </Box>

            {/* Watched Variables */}
            {watchedVars.map((watch, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1.5,
                  p: 2,
                  bgcolor: 'rgba(30, 30, 50, 0.5)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#818cf8', fontFamily: 'monospace', fontSize: 12, mb: 0.5 }}>
                      {watch.path}
                    </Typography>
                    <Chip
                      label={watch.type}
                      size="small"
                      sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', fontSize: 9, height: 18 }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeWatch(watch.path)}
                    sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: watch.type === 'string' ? '#22c55e' : watch.type === 'number' ? '#fbbf24' : 'white',
                  }}
                >
                  {JSON.stringify(watch.value, null, 2)}
                </Box>
              </Box>
            ))}

            {watchedVars.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Visibility sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No variables being watched
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }}>
                  Add a watch to track values
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {onUpdateState && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<Save />}
              onClick={handleSaveState}
              disabled={!!jsonError || !hasUnsavedChanges}
              sx={{
                bgcolor: '#22c55e',
                '&:hover': { bgcolor: '#16a34a' },
                '&.Mui-disabled': { bgcolor: 'rgba(34, 197, 94, 0.2)', color: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              Apply Changes
            </Button>
          )}
          {onForkExecution && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CallSplit />}
              onClick={handleFork}
              disabled={!!jsonError}
              sx={{
                borderColor: 'rgba(129, 140, 248, 0.5)',
                color: '#818cf8',
                '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)', borderColor: '#818cf8' },
                '&.Mui-disabled': { borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              Fork Execution
            </Button>
          )}
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, display: 'block', textAlign: 'center' }}>
          Changes affect only this execution session
        </Typography>
      </Box>
    </Drawer>
  );
}
