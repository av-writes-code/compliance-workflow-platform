import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

// Dynamic data generator based on workflow selection
const generateComparisonData = (wf1: string, wf2: string) => {
  const workflowMetrics: Record<string, { baseAccuracy: number, baseLatency: number }> = {
    'v1': { baseAccuracy: 72, baseLatency: 2100 },
    'v2': { baseAccuracy: 87, baseLatency: 1890 },
    'v3': { baseAccuracy: 91, baseLatency: 1620 },
    'vendor-v1': { baseAccuracy: 68, baseLatency: 2400 },
    'vendor-v2': { baseAccuracy: 82, baseLatency: 1950 },
    'policy-v1': { baseAccuracy: 75, baseLatency: 1800 },
  };

  const wf1Data = workflowMetrics[wf1] || { baseAccuracy: 70, baseLatency: 2000 };
  const wf2Data = workflowMetrics[wf2] || { baseAccuracy: 85, baseLatency: 1700 };

  const accuracyData = [
    { date: 'Jan 8', [wf1]: wf1Data.baseAccuracy, [wf2]: wf2Data.baseAccuracy },
    { date: 'Jan 10', [wf1]: wf1Data.baseAccuracy + 3, [wf2]: wf2Data.baseAccuracy + 2 },
    { date: 'Jan 12', [wf1]: wf1Data.baseAccuracy + 6, [wf2]: wf2Data.baseAccuracy + 4 },
    { date: 'Jan 14', [wf1]: wf1Data.baseAccuracy + 10, [wf2]: wf2Data.baseAccuracy + 7 },
    { date: 'Jan 15', [wf1]: wf1Data.baseAccuracy + 13, [wf2]: wf2Data.baseAccuracy + 9 },
  ];

  const latencyData = [
    { date: 'Jan 8', [wf1]: wf1Data.baseLatency, [wf2]: wf2Data.baseLatency },
    { date: 'Jan 10', [wf1]: wf1Data.baseLatency - 50, [wf2]: wf2Data.baseLatency - 70 },
    { date: 'Jan 12', [wf1]: wf1Data.baseLatency - 120, [wf2]: wf2Data.baseLatency - 140 },
    { date: 'Jan 14', [wf1]: wf1Data.baseLatency - 180, [wf2]: wf2Data.baseLatency - 210 },
    { date: 'Jan 15', [wf1]: wf1Data.baseLatency - 250, [wf2]: wf2Data.baseLatency - 300 },
  ];

  return { accuracyData, latencyData, wf1Data, wf2Data };
};

export default function CompareTab() {
  const [workflow1, setWorkflow1] = useState('v1');
  const [workflow2, setWorkflow2] = useState('v2');

  const workflows = [
    { id: 'v1', name: 'Claims Detection v1' },
    { id: 'v2', name: 'Claims Detection v2' },
    { id: 'v3', name: 'Claims Detection v3 (Beta)' },
    { id: 'vendor-v1', name: 'Vendor Risk v1' },
    { id: 'vendor-v2', name: 'Vendor Risk v2' },
    { id: 'policy-v1', name: 'Policy Checker v1' },
  ];

  const comparisonData = useMemo(() =>
    generateComparisonData(workflow1, workflow2),
    [workflow1, workflow2]
  );

  const accuracyImprovement = useMemo(() => {
    const wf1Final = comparisonData.accuracyData[comparisonData.accuracyData.length - 1][workflow1];
    const wf2Final = comparisonData.accuracyData[comparisonData.accuracyData.length - 1][workflow2];
    return ((wf2Final - wf1Final) / wf1Final * 100).toFixed(1);
  }, [comparisonData, workflow1, workflow2]);

  const latencyReduction = useMemo(() => {
    const wf1Final = comparisonData.latencyData[comparisonData.latencyData.length - 1][workflow1];
    const wf2Final = comparisonData.latencyData[comparisonData.latencyData.length - 1][workflow2];
    return ((wf1Final - wf2Final) / wf1Final * 100).toFixed(1);
  }, [comparisonData, workflow1, workflow2]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Compare Workflows
      </Typography>

      {/* Workflow Selection */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Workflow 1</InputLabel>
            <Select
              value={workflow1}
              onChange={(e) => setWorkflow1(e.target.value)}
              label="Workflow 1"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {workflows.map((wf) => (
                <MenuItem key={wf.id} value={wf.id}>
                  {wf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Workflow 2</InputLabel>
            <Select
              value={workflow2}
              onChange={(e) => setWorkflow2(e.target.value)}
              label="Workflow 2"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {workflows.map((wf) => (
                <MenuItem key={wf.id} value={wf.id}>
                  {wf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Accuracy Improvement
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {Number(accuracyImprovement) > 0 ? (
                <TrendingUp sx={{ color: '#10b981' }} />
              ) : (
                <TrendingDown sx={{ color: '#ef4444' }} />
              )}
              <Typography variant="h5" sx={{ color: Number(accuracyImprovement) > 0 ? '#10b981' : '#ef4444' }}>
                {Number(accuracyImprovement) > 0 ? '+' : ''}{accuracyImprovement}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {workflow2} vs {workflow1}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Latency Reduction
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TrendingDown sx={{ color: '#10b981' }} />
              <Typography variant="h5" sx={{ color: '#10b981' }}>
                -{latencyReduction}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {workflow2} vs {workflow1}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Accuracy Chart */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'rgba(30, 30, 50, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
          Accuracy Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={comparisonData.accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: 4,
                color: 'white',
              }}
            />
            <Legend wrapperStyle={{ color: 'white', fontSize: 12 }} />
            <Line type="monotone" dataKey={workflow1} stroke="#f59e0b" strokeWidth={2} name={workflow1} />
            <Line type="monotone" dataKey={workflow2} stroke="#10b981" strokeWidth={2} name={workflow2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Latency Chart */}
      <Paper
        sx={{
          p: 2,
          bgcolor: 'rgba(30, 30, 50, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
          Latency Over Time (ms)
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparisonData.latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: 12 }} />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: 4,
                color: 'white',
              }}
            />
            <Legend wrapperStyle={{ color: 'white', fontSize: 12 }} />
            <Bar dataKey={workflow1} fill="#f59e0b" name={workflow1} />
            <Bar dataKey={workflow2} fill="#10b981" name={workflow2} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
