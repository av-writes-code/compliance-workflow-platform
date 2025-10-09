import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete, DataObject, CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import EvaluationResultsModal from './EvaluationResultsModal';

interface Dataset {
  id: string;
  name: string;
  description: string;
  testCases: number;
  tags: string[];
  createdAt: string;
  metrics?: {
    precision?: number;
    recall?: number;
    f1Score?: number;
    accuracy?: number;
    coverage?: number;
  };
}

const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'GDPR Regulation Dataset',
    description: 'Test cases for GDPR compliance and data protection requirements',
    testCases: 28,
    tags: ['GDPR', 'Privacy', 'EU'],
    createdAt: '2024-01-15',
    metrics: {
      precision: 0.92,
      recall: 0.89,
      f1Score: 0.905,
      accuracy: 0.91,
      coverage: 0.86,
    },
  },
  {
    id: '2',
    name: 'SP Communication Dataset',
    description: 'Service Provider communication and API integration test suite',
    testCases: 35,
    tags: ['SP', 'API', 'Integration'],
    createdAt: '2024-01-10',
    metrics: {
      precision: 0.95,
      recall: 0.87,
      f1Score: 0.91,
      accuracy: 0.93,
      coverage: 0.74,
    },
  },
  {
    id: '3',
    name: 'Financial Fraud Detection',
    description: 'Baseline test cases for detecting fraudulent financial transactions',
    testCases: 52,
    tags: ['Fraud', 'Finance', 'ML'],
    createdAt: '2024-01-08',
    metrics: {
      precision: 0.88,
      recall: 0.94,
      f1Score: 0.91,
      accuracy: 0.90,
      coverage: 0.92,
    },
  },
];

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedLabel: string;
  actualResult: string;
  labelStatus: 'labeled' | 'unlabeled';
  matchStatus: 'match' | 'mismatch' | 'pending';
  confidence?: number;
  notes?: string;
}

const sampleTestCases: Record<string, TestCase[]> = {
  '1': [
    {
      id: 't1',
      name: 'GDPR Use Case 1',
      input: 'EU customer requests export of all personal data including transaction history',
      expectedLabel: 'compliant',
      actualResult: 'compliant',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.96,
    },
    {
      id: 't2',
      name: 'GDPR Use Case 2',
      input: 'Customer requests immediate account deletion without 30-day waiting period',
      expectedLabel: 'requires-review',
      actualResult: 'compliant',
      labelStatus: 'labeled',
      matchStatus: 'mismatch',
      confidence: 0.72,
    },
    {
      id: 't3',
      name: 'GDPR Use Case 3',
      input: 'Customer withdraws marketing consent but continues to receive promotional emails',
      expectedLabel: 'violation',
      actualResult: 'violation',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.94,
    },
    {
      id: 't4',
      name: 'GDPR Use Case 4',
      input: 'Share customer data with US vendor without adequacy decision or safeguards',
      expectedLabel: 'violation',
      actualResult: 'requires-review',
      labelStatus: 'labeled',
      matchStatus: 'mismatch',
      confidence: 0.68,
    },
  ],
  '2': [
    {
      id: 't1',
      name: 'SP Communication Use Case 1',
      input: 'Service provider API call with valid OAuth token and proper rate limiting',
      expectedLabel: 'compliant',
      actualResult: 'compliant',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.98,
    },
    {
      id: 't2',
      name: 'SP Communication Use Case 2',
      input: 'API request includes sensitive PII in URL parameters instead of request body',
      expectedLabel: 'violation',
      actualResult: 'violation',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.91,
    },
    {
      id: 't3',
      name: 'SP Communication Use Case 3',
      input: 'Webhook delivery retry after initial failure but no exponential backoff',
      expectedLabel: 'requires-review',
      actualResult: 'unlabeled',
      labelStatus: 'unlabeled',
      matchStatus: 'pending',
    },
    {
      id: 't4',
      name: 'SP Communication Use Case 4',
      input: 'Service provider exceeds rate limit by 300% during peak hours',
      expectedLabel: 'violation',
      actualResult: 'compliant',
      labelStatus: 'labeled',
      matchStatus: 'mismatch',
      confidence: 0.54,
    },
  ],
  '3': [
    {
      id: 't1',
      name: 'Financial Fraud Use Case 1',
      input: 'Large $10K transfer to brand new account opened same day',
      expectedLabel: 'flagged',
      actualResult: 'flagged',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.88,
    },
    {
      id: 't2',
      name: 'Financial Fraud Use Case 2',
      input: 'Twenty small payments under $3K each from same IP address within 2 hours',
      expectedLabel: 'flagged',
      actualResult: 'clear',
      labelStatus: 'labeled',
      matchStatus: 'mismatch',
      confidence: 0.61,
    },
    {
      id: 't3',
      name: 'Financial Fraud Use Case 3',
      input: 'International wire transfer to sanctioned country on OFAC list',
      expectedLabel: 'blocked',
      actualResult: 'blocked',
      labelStatus: 'labeled',
      matchStatus: 'match',
      confidence: 0.99,
    },
    {
      id: 't4',
      name: 'Financial Fraud Use Case 4',
      input: 'Legitimate business payment of $50K from verified corporate account',
      expectedLabel: 'clear',
      actualResult: 'unlabeled',
      labelStatus: 'unlabeled',
      matchStatus: 'pending',
    },
  ],
};

export default function DatasetsTab() {
  const [datasets] = useState<Dataset[]>(mockDatasets);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDatasetId, setViewDatasetId] = useState<string | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Test Datasets</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Dataset
        </Button>
      </Box>

      {/* Datasets Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {datasets.map((dataset) => (
          <Card
            key={dataset.id}
            sx={{
              bgcolor: 'rgba(30, 30, 50, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                borderColor: 'rgba(99, 102, 241, 0.5)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataObject sx={{ color: '#818cf8', fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {dataset.name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" sx={{ color: '#818cf8' }} onClick={() => setViewDatasetId(dataset.id)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'rgba(239, 68, 68, 0.8)' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                {dataset.description}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {dataset.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  {dataset.metrics && (
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {dataset.metrics.precision !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                            Precision:
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 600, fontSize: '0.75rem' }}>
                            {(dataset.metrics.precision * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                      {dataset.metrics.recall !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                            Recall:
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 600, fontSize: '0.75rem' }}>
                            {(dataset.metrics.recall * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                      {dataset.metrics.f1Score !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                            F1:
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 600, fontSize: '0.75rem' }}>
                            {(dataset.metrics.f1Score * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                      {dataset.metrics.coverage !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                            Coverage:
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
                            {(dataset.metrics.coverage * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  <Chip
                    label={`${dataset.testCases} test cases`}
                    size="small"
                    onClick={() => setViewDatasetId(dataset.id)}
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(16, 185, 129, 0.3)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Create Dataset Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Dataset</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Dataset Name" fullWidth variant="outlined" />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
            <TextField label="Tags (comma separated)" fullWidth variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setCreateDialogOpen(false)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dataset Modal */}
      <Dialog
        open={viewDatasetId !== null}
        onClose={() => setViewDatasetId(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.98)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        {viewDatasetId && (() => {
          const dataset = datasets.find(d => d.id === viewDatasetId);
          const testCases = sampleTestCases[viewDatasetId] || [];
          if (!dataset) return null;

          return (
            <>
              <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataObject sx={{ color: '#818cf8' }} />
                  {dataset.name}
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {dataset.description}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                  {dataset.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
                    />
                  ))}
                  <Chip
                    label={`${dataset.testCases} test cases`}
                    size="small"
                    sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                  Test Scenarios ({testCases.length})
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, display: 'block' }}>
                  Review what the system should do in each situation
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {testCases.map((testCase, index) => {
                    const borderColor =
                      testCase.matchStatus === 'match' ? '#10b981' :
                      testCase.matchStatus === 'mismatch' ? '#ef4444' :
                      '#6b7280';
                    const statusIcon =
                      testCase.matchStatus === 'match' ? <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} /> :
                      testCase.matchStatus === 'mismatch' ? <Cancel sx={{ color: '#ef4444', fontSize: 18 }} /> :
                      null;

                    return (
                      <Box
                        key={testCase.id}
                        onClick={() => setSelectedTestCase(testCase)}
                        sx={{
                          p: 2,
                          bgcolor: 'rgba(30, 30, 50, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 1,
                          borderLeft: `3px solid ${borderColor}`,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(30, 30, 50, 0.8)',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {statusIcon}
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {testCase.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={testCase.labelStatus === 'labeled' ? 'Labeled' : 'Unlabeled'}
                            size="small"
                            sx={{
                              bgcolor: testCase.labelStatus === 'labeled' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                              color: testCase.labelStatus === 'labeled' ? '#10b981' : '#9ca3af',
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1.5, fontSize: '0.85rem' }}>
                          {testCase.input}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Expected
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                              {testCase.expectedLabel}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: '200px' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Actual Result
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                              {testCase.actualResult}
                            </Typography>
                          </Box>
                          {testCase.confidence && (
                            <Box sx={{ minWidth: '80px' }}>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Confidence
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                                {(testCase.confidence * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Button onClick={() => setViewDatasetId(null)} sx={{ color: 'white' }}>
                  Close
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* Evaluation Results Modal */}
      <EvaluationResultsModal
        open={selectedTestCase !== null}
        onClose={() => setSelectedTestCase(null)}
        testCase={selectedTestCase}
        onSave={(updatedTestCase) => {
          console.log('Saved test case:', updatedTestCase);
          setSelectedTestCase(null);
        }}
      />
    </Box>
  );
}
