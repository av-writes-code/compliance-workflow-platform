import { useState } from 'react';
import { Box, Grid, Paper, Typography, Chip, Table, TableBody, TableCell, TableHead, TableRow, Button, Drawer, IconButton } from '@mui/material';
import { Close, Description } from '@mui/icons-material';

const controlsData = [
  {
    id: 'CC6.1',
    name: 'Logical Access Controls',
    frameworks: ['SOC2', 'ISO27001'],
    status: 'passing',
    evidenceCount: 5,
    lastTested: '2024-10-01',
    citation: {
      framework: 'SOC2',
      text: 'The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity\'s objectives.',
      interpretation: 'Organization must have controls to restrict access to systems and data based on user roles and business needs.',
      requirements: ['Access control policies', 'User access reviews', 'Authentication mechanisms', 'Authorization workflows'],
    },
  },
  {
    id: 'CC6.2',
    name: 'User Authentication',
    frameworks: ['SOC2', 'HIPAA'],
    status: 'passing',
    evidenceCount: 3,
    lastTested: '2024-09-28',
    citation: {
      framework: 'SOC2',
      text: 'Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity.',
      interpretation: 'All users must be properly authenticated before accessing systems. Multi-factor authentication required for sensitive systems.',
      requirements: ['MFA implementation', 'User registration process', 'Access provisioning workflows'],
    },
  },
  {
    id: 'A.9.2.1',
    name: 'User Registration and De-registration',
    frameworks: ['ISO27001'],
    status: 'failing',
    evidenceCount: 1,
    lastTested: '2024-09-15',
    citation: {
      framework: 'ISO27001',
      text: 'A formal user registration and de-registration process shall be implemented to enable assignment of access rights.',
      interpretation: 'Formal processes required for onboarding and offboarding users with documented procedures.',
      requirements: ['Onboarding checklist', 'Offboarding procedures', 'Access review logs'],
    },
  },
  {
    id: 'CC7.2',
    name: 'System Monitoring',
    frameworks: ['SOC2'],
    status: 'pending',
    evidenceCount: 2,
    lastTested: '2024-10-02',
    citation: {
      framework: 'SOC2',
      text: 'The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity\'s ability to meet its objectives.',
      interpretation: 'Continuous monitoring of systems with alerting for security events and anomalies.',
      requirements: ['SIEM logs', 'Monitoring dashboards', 'Incident response procedures'],
    },
  },
];

export default function RegulatoryMapping() {
  const [selectedControl, setSelectedControl] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passing': return 'success';
      case 'failing': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Regulatory Mapping</Typography>

      <Grid container spacing={3}>
        {/* Framework Filter */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All Frameworks" variant="filled" color="primary" />
            <Chip label="SOC 2" variant="outlined" />
            <Chip label="ISO 27001" variant="outlined" />
            <Chip label="HIPAA" variant="outlined" />
            <Chip label="GDPR" variant="outlined" />
          </Paper>
        </Grid>

        {/* Controls Table */}
        <Grid item xs={12}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Control ID</TableCell>
                  <TableCell>Control Name</TableCell>
                  <TableCell>Frameworks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Evidence</TableCell>
                  <TableCell>Last Tested</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {controlsData.map((control) => (
                  <TableRow key={control.id} hover>
                    <TableCell>{control.id}</TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {control.frameworks.map((fw) => (
                          <Chip key={fw} label={fw} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={control.status}
                        size="small"
                        color={getStatusColor(control.status)}
                      />
                    </TableCell>
                    <TableCell>{control.evidenceCount}</TableCell>
                    <TableCell>{control.lastTested}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedControl(control);
                          setDrawerOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      {/* Citation Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 500 } }}
      >
        {selectedControl && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Control Details</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Chip label={selectedControl.citation.framework} color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">{selectedControl.id}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedControl.name}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Citation Text</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2">{selectedControl.citation.text}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Interpretation</Typography>
                <Typography variant="body2">{selectedControl.citation.interpretation}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Evidence Requirements</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedControl.citation.requirements.map((req: string, idx: number) => (
                    <Paper key={idx} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description fontSize="small" />
                      <Typography variant="body2">{req}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Implementation Notes</Typography>
                <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                  <Typography variant="body2">
                    Implement role-based access control (RBAC) with quarterly access reviews.
                    All privileged access requires MFA. Document all access grants and removals.
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Related Controls</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="CC6.2 - Authentication" size="small" />
                  <Chip label="CC6.3 - Authorization" size="small" />
                  <Chip label="A.9.2.2 - Privileged Access" size="small" />
                </Box>
              </Box>

              <Button variant="contained" fullWidth>
                View Evidence
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
