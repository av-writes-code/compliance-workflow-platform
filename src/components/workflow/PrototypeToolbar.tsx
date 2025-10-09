import { Box, Button, ButtonGroup, Divider, Menu, MenuItem } from '@mui/material';
import { Save, FolderOpen, PlayArrow, Clear, FileDownload, ViewModule } from '@mui/icons-material';
import { useState } from 'react';
import EvaluationsButton from './EvaluationsButton';

interface PrototypeToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onRun: () => void;
  onClear: () => void;
  onExport: () => void;
  onLoadTemplate: (templateId: string) => void;
  onOpenEvaluations: () => void;
}

export default function PrototypeToolbar({
  onSave,
  onLoad,
  onRun,
  onClear,
  onExport,
  onLoadTemplate,
  onOpenEvaluations,
}: PrototypeToolbarProps) {
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);

  const templates = [
    { id: 'claims-detection', name: 'Claims Detection' },
    { id: 'vendor-risk', name: 'Vendor Risk Assessment' },
    { id: 'policy-checker', name: 'Policy Violation Checker' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        bgcolor: 'rgba(17, 24, 39, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <ButtonGroup variant="contained" size="small">
        <Button startIcon={<Save />} onClick={onSave}>
          Save
        </Button>
        <Button startIcon={<FolderOpen />} onClick={onLoad}>
          Load
        </Button>
      </ButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<PlayArrow />}
        onClick={onRun}
      >
        Run Test
      </Button>

      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      <Button
        variant="outlined"
        size="small"
        startIcon={<ViewModule />}
        onClick={(e) => setTemplateMenuAnchor(e.currentTarget)}
      >
        Load Template
      </Button>
      <Menu
        anchorEl={templateMenuAnchor}
        open={Boolean(templateMenuAnchor)}
        onClose={() => setTemplateMenuAnchor(null)}
      >
        {templates.map((template) => (
          <MenuItem
            key={template.id}
            onClick={() => {
              onLoadTemplate(template.id);
              setTemplateMenuAnchor(null);
            }}
          >
            {template.name}
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ flexGrow: 1 }} />

      <EvaluationsButton onClick={onOpenEvaluations} />

      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      <ButtonGroup variant="outlined" size="small">
        <Button startIcon={<FileDownload />} onClick={onExport}>
          Export JSON
        </Button>
        <Button startIcon={<Clear />} onClick={onClear} color="error">
          Clear Canvas
        </Button>
      </ButtonGroup>
    </Box>
  );
}
