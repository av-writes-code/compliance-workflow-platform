import { Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkflowCanvas from './pages/WorkflowCanvas';
import EvidenceBrowser from './pages/EvidenceBrowser';
import ApprovalWorkflows from './pages/ApprovalWorkflows';
import RegulatoryMapping from './pages/RegulatoryMapping';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname === '/' ? '/dashboard' : location.pathname;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Compliance Workflow Platform
          </Typography>
        </Toolbar>
        <Tabs
          value={currentTab}
          onChange={(_, val) => navigate(val)}
          sx={{ bgcolor: 'background.paper' }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" value="/dashboard" />
          <Tab label="Workflows" value="/workflows" />
          <Tab label="Evidence" value="/evidence" />
          <Tab label="Approvals" value="/approvals" />
          <Tab label="Mapping" value="/mapping" />
        </Tabs>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows" element={<WorkflowCanvas />} />
          <Route path="/evidence" element={<EvidenceBrowser />} />
          <Route path="/approvals" element={<ApprovalWorkflows />} />
          <Route path="/mapping" element={<RegulatoryMapping />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
