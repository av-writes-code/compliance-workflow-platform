import { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Tabs, Tab } from '@mui/material';
import { Close } from '@mui/icons-material';
import DatasetsTab from './DatasetsTab';
import RunEvaluationTab from './RunEvaluationTab';
import RecentRunsTab from './RecentRunsTab';
import CompareTab from './CompareTab';

interface EvaluationsDrawerProps {
  open: boolean;
  onClose: () => void;
  environment: 'prototype' | 'production';
  workflowId?: string;
  workflowName?: string;
}

export default function EvaluationsDrawer({
  open,
  onClose,
  environment,
  workflowId,
  workflowName,
}: EvaluationsDrawerProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 600,
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          color: 'white',
          borderLeft: '1px solid rgba(99, 102, 241, 0.3)',
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
          <Typography variant="h6">Evaluations</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Environment: {environment}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.875rem',
            minHeight: 48,
          },
          '& .Mui-selected': {
            color: '#818cf8',
          },
          '& .MuiTabs-indicator': {
            bgcolor: '#818cf8',
          },
        }}
      >
        <Tab label="Datasets" />
        <Tab label="Run Evaluation" />
        <Tab label="Recent Runs" />
        <Tab label="Compare" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 0 && <DatasetsTab />}
        {activeTab === 1 && (
          <RunEvaluationTab
            environment={environment}
            workflowId={workflowId}
            workflowName={workflowName}
          />
        )}
        {activeTab === 2 && <RecentRunsTab workflowId={workflowId} />}
        {activeTab === 3 && <CompareTab />}
      </Box>
    </Drawer>
  );
}
