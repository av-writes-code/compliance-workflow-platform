import { Box, Typography, Card, CardContent, Paper, Chip, Avatar, Button } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Timeline } from '@mui/icons-material';

const approvalWorkflows = [
  {
    id: '1',
    title: 'Access Control Policy v2.1',
    status: 'in-progress',
    currentStage: 'Legal Review',
    stages: [
      {
        name: 'Manager Review',
        type: 'sequential',
        approvers: [
          { name: 'John Doe', status: 'approved', role: 'Engineering Manager', timestamp: '2024-10-01 10:30' },
        ],
      },
      {
        name: 'Legal Review',
        type: 'parallel',
        approvers: [
          { name: 'Jane Smith', status: 'pending', role: 'Legal Counsel' },
          { name: 'Bob Johnson', status: 'pending', role: 'Compliance Officer' },
        ],
      },
      {
        name: 'Executive Approval',
        type: 'sequential',
        approvers: [
          { name: 'Alice Brown', status: 'pending', role: 'CISO' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Vendor Risk Assessment - Acme Corp',
    status: 'approved',
    currentStage: 'Completed',
    stages: [
      {
        name: 'Risk Committee',
        type: 'parallel',
        approvers: [
          { name: 'Charlie Wilson', status: 'approved', role: 'Risk Manager', timestamp: '2024-09-28 14:20' },
          { name: 'Diana Prince', status: 'approved', role: 'Security Lead', timestamp: '2024-09-28 15:45' },
        ],
      },
    ],
  },
];

export default function ApprovalWorkflows() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'rejected': return <Cancel sx={{ color: 'error.main' }} />;
      case 'pending': return <Schedule sx={{ color: 'warning.main' }} />;
      default: return <Timeline />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Approval Workflows</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        {approvalWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6">{workflow.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Current Stage: {workflow.currentStage}
                  </Typography>
                </Box>
                <Chip
                  label={workflow.status.replace('-', ' ')}
                  color={workflow.status === 'approved' ? 'success' : workflow.status === 'rejected' ? 'error' : 'info'}
                />
              </Box>

              {/* Swimlane Visualization */}
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {workflow.stages.map((stage, stageIdx) => (
                  <Paper
                    key={stageIdx}
                    sx={{
                      minWidth: 280,
                      p: 2,
                      bgcolor: workflow.currentStage === stage.name ? 'primary.50' : 'grey.50',
                      border: workflow.currentStage === stage.name ? 2 : 1,
                      borderColor: workflow.currentStage === stage.name ? 'primary.main' : 'grey.300',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {stage.name}
                      </Typography>
                      <Chip
                        label={stage.type}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {stage.approvers.map((approver, idx) => (
                        <Paper key={idx} sx={{ p: 1.5, bgcolor: 'white' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {approver.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {approver.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {approver.role}
                              </Typography>
                            </Box>
                            {getStatusIcon(approver.status)}
                          </Box>
                          {approver.timestamp && (
                            <Typography variant="caption" color="text.secondary">
                              {approver.timestamp}
                            </Typography>
                          )}
                          {approver.status === 'pending' && workflow.status === 'in-progress' && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button size="small" variant="contained" color="success" fullWidth>
                                Approve
                              </Button>
                              <Button size="small" variant="outlined" color="error" fullWidth>
                                Reject
                              </Button>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Timeline */}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Approval Timeline
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {workflow.stages.map((stage, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: stage.approvers.every(a => a.status === 'approved') ? 'success.main' : 'grey.300',
                        }}
                      />
                      <Typography variant="caption">{stage.name}</Typography>
                      {idx < workflow.stages.length - 1 && (
                        <Box sx={{ width: 40, height: 2, bgcolor: 'grey.300' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
