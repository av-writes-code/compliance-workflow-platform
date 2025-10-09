import { Box, Typography, Drawer, IconButton, Checkbox, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Close, Delete, Circle, CircleOutlined } from '@mui/icons-material';

interface Breakpoint {
  nodeId: string;
  nodeName: string;
  position: 'before' | 'after';
  enabled: boolean;
  condition?: string;
}

interface BreakpointsPanelProps {
  open: boolean;
  onClose: () => void;
  breakpoints: Breakpoint[];
  onToggleBreakpoint: (nodeId: string, enabled: boolean) => void;
  onRemoveBreakpoint: (nodeId: string) => void;
  onNavigateToNode: (nodeId: string) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onRemoveAll: () => void;
}

export default function BreakpointsPanel({
  open,
  onClose,
  breakpoints,
  onToggleBreakpoint,
  onRemoveBreakpoint,
  onNavigateToNode,
  onEnableAll,
  onDisableAll,
  onRemoveAll,
}: BreakpointsPanelProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 340,
          bgcolor: '#0f0f1e',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Breakpoints
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {breakpoints.length} breakpoint{breakpoints.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Bulk Actions */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            onClick={onEnableAll}
            disabled={breakpoints.length === 0}
            sx={{
              color: '#22c55e',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              fontSize: 11,
              '&:hover': { borderColor: '#22c55e', bgcolor: 'rgba(34, 197, 94, 0.1)' },
            }}
            variant="outlined"
          >
            Enable All
          </Button>
          <Button
            size="small"
            onClick={onDisableAll}
            disabled={breakpoints.length === 0}
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              fontSize: 11,
              '&:hover': { borderColor: 'rgba(255, 255, 255, 0.4)', bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
            variant="outlined"
          >
            Disable All
          </Button>
          <Button
            size="small"
            onClick={onRemoveAll}
            disabled={breakpoints.length === 0}
            sx={{
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              fontSize: 11,
              '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
            }}
            variant="outlined"
          >
            Remove All
          </Button>
        </Box>
      </Box>

      {/* Breakpoints List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {breakpoints.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', mb: 1 }}>
              No breakpoints set
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 11 }}>
              Right-click on a node to add a breakpoint
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {breakpoints.map((bp, index) => (
              <Box key={bp.nodeId}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                    },
                    opacity: bp.enabled ? 1 : 0.5,
                  }}
                  onClick={() => onNavigateToNode(bp.nodeId)}
                >
                  {/* Enable/Disable Checkbox */}
                  <Checkbox
                    checked={bp.enabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleBreakpoint(bp.nodeId, !bp.enabled);
                    }}
                    icon={<CircleOutlined sx={{ fontSize: 16, color: '#ef4444' }} />}
                    checkedIcon={<Circle sx={{ fontSize: 16, color: '#ef4444' }} />}
                    sx={{ p: 0, mr: 1.5 }}
                  />

                  {/* Node Name & Position */}
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: 13 }}>
                        {bp.nodeName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}>
                          Break {bp.position === 'before' ? 'Before' : 'After'}
                        </Typography>
                        {bp.condition && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#fbbf24',
                              fontSize: 10,
                              display: 'block',
                              mt: 0.5,
                              fontFamily: 'monospace',
                            }}
                          >
                            ? {bp.condition}
                          </Typography>
                        )}
                      </Box>
                    }
                  />

                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBreakpoint(bp.nodeId);
                    }}
                    sx={{
                      color: '#ef4444',
                      opacity: 0.6,
                      '&:hover': { opacity: 1, bgcolor: 'rgba(239, 68, 68, 0.1)' },
                    }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItem>
                {index < breakpoints.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
              </Box>
            ))}
          </List>
        )}
      </Box>

      {/* Footer Help */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          bgcolor: 'rgba(99, 102, 241, 0.05)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 11, display: 'block', mb: 0.5 }}>
          💡 <strong>Tip:</strong> Click a breakpoint to navigate to the node on the canvas
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}>
          Disabled breakpoints (gray) won't pause execution
        </Typography>
      </Box>
    </Drawer>
  );
}
