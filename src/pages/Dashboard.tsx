import { Box, Grid, Card, CardContent, Typography, LinearProgress, Chip, Paper } from '@mui/material';
import { CheckCircle, Error, Schedule, HelpOutline } from '@mui/icons-material';
import { useAppStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { frameworkReadiness } = useAppStore();

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const evidenceData = [
    { name: 'Current', value: 45, color: '#4caf50' },
    { name: 'Expiring Soon', value: 12, color: '#ff9800' },
    { name: 'Expired', value: 5, color: '#f44336' },
  ];

  const taskForecast = [
    { month: 'Oct', tasks: 28 },
    { month: 'Nov', tasks: 35 },
    { month: 'Dec', tasks: 22 },
    { month: 'Jan', tasks: 30 },
  ];

  const testTrends = [
    { week: 'W1', passRate: 75 },
    { week: 'W2', passRate: 78 },
    { week: 'W3', passRate: 82 },
    { week: 'W4', passRate: 85 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Compliance Dashboard</Typography>

      <Grid container spacing={3}>
        {/* Framework Readiness Cards */}
        {frameworkReadiness.map((framework) => (
          <Grid item xs={12} md={6} lg={3} key={framework.framework}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{framework.framework}</Typography>
                  <Chip
                    label={`${framework.percentageReady}%`}
                    color={getStatusColor(framework.percentageReady)}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={framework.percentageReady}
                  color={getStatusColor(framework.percentageReady)}
                  sx={{ mb: 2, height: 8, borderRadius: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption">{framework.controlsPassing}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Error sx={{ fontSize: 16, color: 'error.main' }} />
                    <Typography variant="caption">{framework.controlsFailing}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption">{framework.controlsPending}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <HelpOutline sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="caption">{framework.controlsNotTested}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Test Trends Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Trends</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={testTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="passRate" stroke="#1976D2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Evidence Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Evidence Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={evidenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {evidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                {evidenceData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="caption">{item.name}: {item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Forecast */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Task Forecast</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={taskForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#1976D2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Approval Queue */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Approval Queue</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { title: 'Access Control Policy v2.1', assignee: 'Legal Team', dueDate: 'Oct 5', priority: 'high' },
                  { title: 'Vendor Risk Assessment', assignee: 'Risk Committee', dueDate: 'Oct 8', priority: 'medium' },
                  { title: 'Incident Response Plan', assignee: 'CISO', dueDate: 'Oct 10', priority: 'low' },
                ].map((item, idx) => (
                  <Paper key={idx} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" fontWeight={500}>{item.title}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">{item.assignee}</Typography>
                      <Typography variant="caption" color="text.secondary">Due: {item.dueDate}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Health */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Integration Health</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: 'GitHub', status: 'connected', lastSync: '2 min ago' },
                  { name: 'Slack', status: 'connected', lastSync: '5 min ago' },
                  { name: 'Jira', status: 'warning', lastSync: '2 hours ago' },
                  { name: 'AWS', status: 'connected', lastSync: '1 min ago' },
                ].map((integration, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: integration.status === 'connected' ? 'success.main' : 'warning.main'
                        }}
                      />
                      <Typography variant="body2">{integration.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{integration.lastSync}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
