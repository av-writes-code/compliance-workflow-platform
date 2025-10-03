import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Paper,
  IconButton,
  Drawer,
} from '@mui/material';
import { Description, Image, Settings, Attachment, CheckCircle, Close, Download, Link as LinkIcon } from '@mui/icons-material';

const sampleEvidence = [
  {
    id: '1',
    title: 'Access Control Policy',
    type: 'document',
    status: 'approved',
    collectionDate: '2024-09-15',
    frameworks: ['SOC2', 'ISO27001'],
    owner: 'John Doe',
  },
  {
    id: '2',
    title: 'AWS Config Screenshot',
    type: 'screenshot',
    status: 'current',
    collectionDate: '2024-10-01',
    frameworks: ['SOC2'],
    owner: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Database Encryption Config',
    type: 'configuration',
    status: 'current',
    collectionDate: '2024-09-28',
    frameworks: ['HIPAA', 'SOC2'],
    owner: 'Bob Johnson',
  },
  {
    id: '4',
    title: 'Audit Logs Q3 2024',
    type: 'log',
    status: 'expiring-soon',
    collectionDate: '2024-07-01',
    frameworks: ['SOC2'],
    owner: 'Alice Brown',
  },
  {
    id: '5',
    title: 'Penetration Test Report',
    type: 'third-party-report',
    status: 'current',
    collectionDate: '2024-09-20',
    frameworks: ['SOC2', 'ISO27001', 'HIPAA'],
    owner: 'Security Team',
  },
  {
    id: '6',
    title: 'Employee Training Attestation',
    type: 'attestation',
    status: 'expired',
    collectionDate: '2023-12-15',
    frameworks: ['SOC2'],
    owner: 'HR Team',
  },
];

export default function EvidenceBrowser() {
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFramework, setFilterFramework] = useState('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screenshot': return <Image />;
      case 'configuration': return <Settings />;
      case 'document': return <Description />;
      default: return <Attachment />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'current': return 'success';
      case 'expiring-soon': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const filteredEvidence = sampleEvidence.filter(
    (ev) =>
      (filterStatus === 'all' || ev.status === filterStatus) &&
      (filterFramework === 'all' || ev.frameworks.includes(filterFramework))
  );

  const handleCardClick = (evidence: any) => {
    setSelectedEvidence(evidence);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Evidence Browser</Typography>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="current">Current</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="expiring-soon">Expiring Soon</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Framework</InputLabel>
                <Select
                  value={filterFramework}
                  label="Framework"
                  onChange={(e) => setFilterFramework(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="SOC2">SOC 2</MenuItem>
                  <MenuItem value="ISO27001">ISO 27001</MenuItem>
                  <MenuItem value="HIPAA">HIPAA</MenuItem>
                  <MenuItem value="GDPR">GDPR</MenuItem>
                </Select>
              </FormControl>
              <TextField
                placeholder="Search evidence..."
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              <Button variant="contained">Upload Evidence</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Evidence Grid */}
        {filteredEvidence.map((evidence) => (
          <Grid item xs={12} sm={6} md={4} key={evidence.id}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => handleCardClick(evidence)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  {getTypeIcon(evidence.type)}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {evidence.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {evidence.collectionDate}
                    </Typography>
                  </Box>
                  <Chip
                    label={evidence.status.replace('-', ' ')}
                    size="small"
                    color={getStatusColor(evidence.status)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {evidence.frameworks.map((fw: string) => (
                    <Chip key={fw} label={fw} size="small" variant="outlined" />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Owner: {evidence.owner}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Evidence Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 400 } }}
      >
        {selectedEvidence && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Evidence Details</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Title</Typography>
                <Typography variant="body1">{selectedEvidence.title}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedEvidence.type}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedEvidence.status.replace('-', ' ')}
                  color={getStatusColor(selectedEvidence.status)}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Collection Date</Typography>
                <Typography variant="body1">{selectedEvidence.collectionDate}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Owner</Typography>
                <Typography variant="body1">{selectedEvidence.owner}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Frameworks</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {selectedEvidence.frameworks.map((fw: string) => (
                    <Chip key={fw} label={fw} size="small" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Mapped Controls</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label="CC6.1 - Access Control" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  <Chip label="CC6.2 - Authentication" size="small" sx={{ mb: 0.5 }} />
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Button variant="contained" startIcon={<Download />} fullWidth>
                  Download
                </Button>
                <Button variant="outlined" startIcon={<LinkIcon />} fullWidth>
                  Share Link
                </Button>
                <Button variant="outlined" fullWidth>
                  Map to Additional Controls
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Activity Log</Typography>
                <Paper sx={{ p: 1.5, mt: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" display="block">
                    <strong>Approved</strong> by Jane Doe on 2024-09-16
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    <strong>Uploaded</strong> by John Doe on 2024-09-15
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
