import { Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeDemoData } from './utils/demoDataStore';
import { Science, Rocket } from '@mui/icons-material';
import Dashboard from './pages/Dashboard';
import PrototypeStation from './pages/PrototypeStation';
import ProductionEnvironment from './pages/ProductionEnvironment';
import EvidenceBrowser from './pages/EvidenceBrowser';
import ApprovalWorkflows from './pages/ApprovalWorkflows';
import RegulatoryMapping from './pages/RegulatoryMapping';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname === '/' ? '/dashboard' : location.pathname;

  // Initialize demo data on mount
  useEffect(() => {
    initializeDemoData();
  }, []);

  // Determine environment badge
  const getEnvironmentBadge = () => {
    if (location.pathname === '/prototype') {
      return <Chip icon={<Science />} label="Prototype" size="small" color="success" />;
    }
    if (location.pathname === '/production') {
      return <Chip icon={<Rocket />} label="Production" size="small" color="primary" />;
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Compliance Workflow Platform
          </Typography>
          {getEnvironmentBadge()}
        </Toolbar>
        <Tabs
          value={currentTab}
          onChange={(_, val) => navigate(val)}
          sx={{ bgcolor: 'background.paper' }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" value="/dashboard" />
          <Tab icon={<Science />} iconPosition="start" label="Prototype" value="/prototype" />
          <Tab icon={<Rocket />} iconPosition="start" label="Production" value="/production" />
          <Tab label="Evidence" value="/evidence" />
          <Tab label="Approvals" value="/approvals" />
          <Tab label="Mapping" value="/mapping" />
        </Tabs>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prototype" element={<PrototypeStation />} />
          <Route path="/production" element={<ProductionEnvironment />} />
          <Route path="/evidence" element={<EvidenceBrowser />} />
          <Route path="/approvals" element={<ApprovalWorkflows />} />
          <Route path="/mapping" element={<RegulatoryMapping />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
