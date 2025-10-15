import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import { PlayArrow, Speed, History, SaveAlt, Code, Gavel, Person, Settings, CheckCircle } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { runEvaluation } from '../../utils/evaluationEngine';
import { addEvaluationRun, getBaselineRun, EvaluationRun } from '../../utils/demoDataStore';
import BuiltInEvalsConfigDialog from './BuiltInEvalsConfigDialog';
import LLMJudgeConfigDialog from './LLMJudgeConfigDialog';
import CustomCodeConfigDialog from './CustomCodeConfigDialog';
import HITLConfigDialog from './HITLConfigDialog';

interface RunEvaluationTabProps {
  environment: 'prototype' | 'production';
  workflowId?: string;
  workflowName?: string;
}

export default function RunEvaluationTab({
  environment,
  workflowId,
  workflowName,
}: RunEvaluationTabProps) {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedEvalType, setSelectedEvalType] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [configDialogOpen, setConfigDialogOpen] = useState<string | null>(null);
  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const { enqueueSnackbar } = useSnackbar();

  const datasets = [
    { id: '1', name: 'GDPR Regulation Dataset', testCases: 28 },
    { id: '2', name: 'SP Communication Dataset', testCases: 35 },
    { id: '3', name: 'Financial Fraud Detection', testCases: 52 },
  ];

  const evaluationTypes = [
    {
      id: 'builtin',
      name: 'Built-in Evals',
      icon: Speed,
      description: 'Pre-configured evaluation metrics',
      details: 'Standard metrics like accuracy, precision, recall, and F1-score. Use for classification tasks with ground truth labels.',
    },
    {
      id: 'custom',
      name: 'Custom Code Evals',
      icon: Code,
      description: 'Python/JS evaluation functions',
      details: 'Write custom validation logic for domain-specific requirements. Use for business rules, regex matching, and data validation.',
    },
    {
      id: 'llm-judge',
      name: 'LLM as a Judge',
      icon: Gavel,
      description: 'AI-powered evaluation',
      details: 'Use GPT-4 or Claude to score outputs on subjective criteria like tone, helpfulness, and accuracy. Use for comparing response quality.',
    },
    {
      id: 'hitl',
      name: 'Human-in-the-Loop',
      icon: Person,
      description: 'Manual review & feedback',
      details: 'Expert human review for high-stakes decisions and edge cases. Required for regulatory compliance and sensitive content.',
    },
  ];

  const handleQuickTest = async () => {
    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) return;

    setIsRunning(true);
    setProgress(0);

    // Animate progress: 10 steps @ 300ms = 3000ms (DEMO.md Test 2.1)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(i);
    }

    // Run actual evaluation
    const mockTestCases = new Array(dataset.testCases).fill({});
    const result = runEvaluation(
      workflowId || 'v2.0',
      dataset.id,
      mockTestCases
    );

    // Save result
    const newRun: EvaluationRun = {
      id: Date.now().toString(),
      workflowName: workflowName || 'Claims Detection v2.0.0',
      datasetName: dataset.name,
      accuracy: result.accuracy, // 94 (DEMO.md Test 2.2 line 110)
      latency: result.latency,
      passedTests: result.passedTests, // 49 (DEMO.md Test 2.2 line 115)
      totalTests: result.totalTests,
      timestamp: new Date().toLocaleString(),
      status: result.accuracy >= 90 ? 'success' : 'warning',
    };

    addEvaluationRun(newRun);
    setIsRunning(false);

    // Get baseline for comparison (DEMO.md Test 2.2 line 109)
    const baseline = getBaselineRun(dataset.name);
    if (baseline) {
      const improvement = result.accuracy - baseline.accuracy; // 7% (DEMO.md Test 2.2 line 111)
      enqueueSnackbar(
        `🎉 ${result.accuracy}% accuracy - outperforms baseline by ${improvement}%!`, // ← DEMO.md Test 2.2 line 110-111
        { variant: 'success' }
      );
    } else {
      enqueueSnackbar(
        `✅ ${result.accuracy}% accuracy (${result.passedTests}/${result.totalTests} passed)`,
        { variant: 'success' }
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Workflow Info */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'rgba(30, 30, 50, 0.6)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
          Current Workflow
        </Typography>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          {workflowName || 'No workflow selected'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={environment}
            size="small"
            color={environment === 'production' ? 'primary' : 'success'}
          />
          {workflowId && (
            <Chip
              label={`ID: ${workflowId.slice(0, 8)}`}
              size="small"
              variant="outlined"
              sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
            />
          )}
        </Box>
      </Paper>

      {/* Dataset Selection */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Select Dataset</InputLabel>
        <Select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          label="Select Dataset"
          sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
          }}
        >
          {datasets.map((dataset) => (
            <MenuItem key={dataset.id} value={dataset.id}>
              {dataset.name} ({dataset.testCases} test cases)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Evaluation Type Selection */}
      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1.5 }}>
        Evaluation Method
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
        {evaluationTypes.map((evalType) => {
          const IconComponent = evalType.icon;
          const isConfigured = configurations[evalType.id] !== undefined;
          return (
            <Paper
              key={evalType.id}
              onClick={() => setSelectedEvalType(evalType.id)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                bgcolor: selectedEvalType === evalType.id
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(30, 30, 50, 0.4)',
                border: selectedEvalType === evalType.id
                  ? '2px solid #818cf8'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#818cf8',
                  bgcolor: 'rgba(99, 102, 241, 0.15)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconComponent sx={{ fontSize: 18, color: '#818cf8' }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: '0.8rem' }}>
                    {evalType.name}
                  </Typography>
                </Box>
                {isConfigured && (
                  <CheckCircle sx={{ fontSize: 14, color: '#10b981' }} />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem' }}>
                {evalType.description}
              </Typography>
              {selectedEvalType === evalType.id && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.7rem',
                      display: 'block',
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {evalType.details}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfigDialogOpen(evalType.id);
                    }}
                    sx={{
                      mt: 1,
                      fontSize: '0.7rem',
                      py: 0.5,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#818cf8',
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    {isConfigured ? 'Edit Configuration' : 'Configure'}
                  </Button>
                </>
              )}
            </Paper>
          );
        })}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Fast shortcuts for common tasks
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          {/* Quick Test */}
          <Box
            onClick={!selectedDataset || isRunning ? undefined : handleQuickTest}
            sx={{
              p: 2,
              bgcolor: selectedDataset && !isRunning ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 30, 50, 0.4)',
              border: selectedDataset && !isRunning ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              cursor: selectedDataset && !isRunning ? 'pointer' : 'not-allowed',
              opacity: selectedDataset && !isRunning ? 1 : 0.5,
              transition: 'all 0.2s',
              '&:hover': selectedDataset && !isRunning ? {
                bgcolor: 'rgba(99, 102, 241, 0.25)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              } : {},
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Speed sx={{ color: '#818cf8', fontSize: 20 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, mb: 0.5 }}>
                  Quick Test
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 0.5 }}>
                  Run evaluation on 10 random test cases for rapid validation
                </Typography>
                <Chip
                  label="~30 seconds"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Repeat Last Run */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(30, 30, 50, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              cursor: workflowId ? 'pointer' : 'not-allowed',
              opacity: workflowId ? 1 : 0.5,
              transition: 'all 0.2s',
              '&:hover': workflowId ? {
                bgcolor: 'rgba(30, 30, 50, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              } : {},
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <History sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 20 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, mb: 0.5 }}>
                  Repeat Last Run
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                  Re-execute your most recent evaluation with the same configuration
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Save as Template */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(30, 30, 50, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              cursor: selectedDataset ? 'pointer' : 'not-allowed',
              opacity: selectedDataset ? 1 : 0.5,
              transition: 'all 0.2s',
              '&:hover': selectedDataset ? {
                bgcolor: 'rgba(30, 30, 50, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              } : {},
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SaveAlt sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 20 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, mb: 0.5 }}>
                  Save as Template
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                  Bookmark this evaluation setup to reuse later on different datasets
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Full Run Button */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 1.5 }}>
          Run Evaluation
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<PlayArrow />}
          disabled={!selectedDataset || !selectedEvalType || isRunning}
          onClick={() => {
            // TODO: Trigger full evaluation run
            console.log('Running evaluation with:', {
              dataset: selectedDataset,
              evalType: selectedEvalType,
              config: configurations[selectedEvalType],
            });
          }}
          sx={{
            py: 2,
            bgcolor: '#10b981',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            '&:hover': {
              bgcolor: '#059669',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              bgcolor: 'rgba(30, 30, 50, 0.4)',
              color: 'rgba(255, 255, 255, 0.3)',
              boxShadow: 'none',
            },
            transition: 'all 0.2s',
          }}
        >
          {!selectedDataset
            ? 'Select a Dataset to Continue'
            : !selectedEvalType
            ? 'Select an Evaluation Method'
            : isRunning
            ? 'Running Evaluation...'
            : 'Run Full Evaluation'}
        </Button>
        {selectedDataset && selectedEvalType && !configurations[selectedEvalType] && (
          <Typography
            variant="caption"
            sx={{
              color: '#f59e0b',
              display: 'block',
              mt: 1,
              textAlign: 'center',
            }}
          >
            ⚠️ Configuration recommended - Click "Configure" button above
          </Typography>
        )}
      </Box>

      {/* Progress */}
      {isRunning && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            Running evaluation... {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#10b981',
              },
            }}
          />
        </Box>
      )}

      {/* Configuration Dialogs */}
      <BuiltInEvalsConfigDialog
        open={configDialogOpen === 'builtin'}
        onClose={() => setConfigDialogOpen(null)}
        onSave={(config) => setConfigurations({ ...configurations, builtin: config })}
        initialConfig={configurations.builtin}
      />
      <LLMJudgeConfigDialog
        open={configDialogOpen === 'llm-judge'}
        onClose={() => setConfigDialogOpen(null)}
        onSave={(config) => setConfigurations({ ...configurations, 'llm-judge': config })}
        initialConfig={configurations['llm-judge']}
      />
      <CustomCodeConfigDialog
        open={configDialogOpen === 'custom'}
        onClose={() => setConfigDialogOpen(null)}
        onSave={(config) => setConfigurations({ ...configurations, custom: config })}
        initialConfig={configurations.custom}
      />
      <HITLConfigDialog
        open={configDialogOpen === 'hitl'}
        onClose={() => setConfigDialogOpen(null)}
        onSave={(config) => setConfigurations({ ...configurations, hitl: config })}
        initialConfig={configurations.hitl}
      />
    </Box>
  );
}
