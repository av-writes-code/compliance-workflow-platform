import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import { Visibility, CheckCircle, Error, Warning } from '@mui/icons-material';

interface EvaluationRun {
  id: string;
  workflowName: string;
  datasetName: string;
  accuracy: number;
  latency: number;
  passedTests: number;
  totalTests: number;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

const mockRuns: EvaluationRun[] = [
  {
    id: '1',
    workflowName: 'Media Content Moderation v3',
    datasetName: 'Social Media Compliance Dataset',
    accuracy: 90.0,
    latency: 1240,
    passedTests: 45,
    totalTests: 50,
    timestamp: '2025-10-07 14:32',
    status: 'success',
  },
  {
    id: '2',
    workflowName: 'GDPR Compliance Checker v2',
    datasetName: 'GDPR Regulation Dataset',
    accuracy: 90.5,
    latency: 980,
    passedTests: 38,
    totalTests: 42,
    timestamp: '2025-10-06 11:18',
    status: 'success',
  },
  {
    id: '3',
    workflowName: 'Financial Fraud Detection v1',
    datasetName: 'Financial Fraud Detection',
    accuracy: 88.6,
    latency: 1560,
    passedTests: 31,
    totalTests: 35,
    timestamp: '2025-10-05 09:42',
    status: 'warning',
  },
];

interface RecentRunsTabProps {
  workflowId?: string;
}

export default function RecentRunsTab({ workflowId }: RecentRunsTabProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 18, color: '#f59e0b' }} />;
      case 'failed':
        return <Error sx={{ fontSize: 18, color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Recent Evaluation Runs
      </Typography>

      {mockRuns.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No evaluation runs yet
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Dataset
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Accuracy
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Tests
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Latency
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRuns.map((run) => (
                <TableRow
                  key={run.id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.05)',
                    },
                  }}
                >
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    {getStatusIcon(run.status)}
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body2">{run.datasetName}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Chip
                      label={`${run.accuracy}%`}
                      size="small"
                      color={getStatusColor(run.status) as any}
                      sx={{ minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body2">
                      {run.passedTests}/{run.totalTests}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="body2">{run.latency}ms</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="caption">{run.timestamp}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <IconButton size="small" sx={{ color: '#818cf8' }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
