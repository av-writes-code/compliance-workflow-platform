import { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, IconButton, TextField, Tooltip } from '@mui/material';
import { ExpandMore, SmartToy, Memory, IntegrationInstructions, Security, CheckCircle, Notifications, CallSplit, Edit, Save, PlayArrow, Webhook, Loop, Code, Transform, Output, Psychology, Settings, InfoOutlined } from '@mui/icons-material';

const componentCategories = [
  {
    name: 'Triggers',
    description: 'Start your workflow with manual, webhook, schedule, or file upload triggers',
    items: [
      { id: 'manual-trigger', label: 'Execute Workflow', icon: <PlayArrow />, type: 'trigger' },
      { id: 'webhook', label: 'Webhook Trigger', icon: <Webhook />, type: 'trigger' },
      { id: 'schedule', label: 'Schedule Trigger', icon: <Settings />, type: 'trigger' },
    ],
  },
  {
    name: 'AI Agents',
    description: 'Execute LLM tasks like analysis, generation, classification, and evaluation',
    items: [
      { id: 'ai-agent', label: 'AI Agent', icon: <SmartToy />, type: 'agent' },
      { id: 'critic-agent', label: 'Critic Agent', icon: <Psychology />, type: 'agent' },
      { id: 'refiner-agent', label: 'Refiner Agent', icon: <Psychology />, type: 'agent' },
      { id: 'evaluation-agent', label: 'Evaluation Agent', icon: <Psychology />, type: 'agent' },
      { id: 'custom-agent', label: 'Custom Agent', icon: <SmartToy />, type: 'agent' },
    ],
  },
  {
    name: 'Chat Models',
    description: 'Direct LLM model calls with Claude (Anthropic), OpenAI, or custom providers',
    items: [
      { id: 'claude-chat', label: 'Claude Chat Model', icon: <SmartToy />, type: 'chat-model' },
      { id: 'openai-chat', label: 'OpenAI Chat Model', icon: <SmartToy />, type: 'chat-model' },
      { id: 'custom-llm', label: 'Custom LLM', icon: <SmartToy />, type: 'chat-model' },
    ],
  },
  {
    name: 'Loop & Iteration',
    description: 'Process lists item-by-item, in batches, or aggregate results',
    items: [
      { id: 'loop-items', label: 'Loop Over Items', icon: <Loop />, type: 'loop' },
      { id: 'split-batch', label: 'Split in Batches', icon: <CallSplit />, type: 'loop' },
      { id: 'aggregate', label: 'Aggregate', icon: <Transform />, type: 'loop' },
    ],
  },
  {
    name: 'Logic & Conditionals',
    description: 'Branch workflow based on conditions, switch cases, or merge paths',
    items: [
      { id: 'if-condition', label: 'If', icon: <CallSplit />, type: 'conditional' },
      { id: 'switch', label: 'Switch', icon: <CallSplit />, type: 'conditional' },
      { id: 'merge', label: 'Merge', icon: <Transform />, type: 'conditional' },
    ],
  },
  {
    name: 'Data Transformation',
    description: 'Clean, filter, sort, and merge data before processing',
    items: [
      { id: 'edit-fields', label: 'Edit Fields', icon: <Edit />, type: 'transform' },
      { id: 'set-values', label: 'Set Values', icon: <Settings />, type: 'transform' },
      { id: 'filter', label: 'Filter', icon: <CallSplit />, type: 'transform' },
      { id: 'sort', label: 'Sort', icon: <Transform />, type: 'transform' },
    ],
  },
  {
    name: 'Output & Parsers',
    description: 'Format results, extract structured data, or run custom code',
    items: [
      { id: 'code-node', label: 'Code', icon: <Code />, type: 'output' },
      { id: 'structured-parser', label: 'Structured Output Parser', icon: <Output />, type: 'output' },
      { id: 'json-parser', label: 'JSON Parser', icon: <Code />, type: 'output' },
    ],
  },
  {
    name: 'Memory & Storage',
    description: 'Save and retrieve data from databases, cache, or vector stores',
    items: [
      { id: 'postgres-memory', label: 'Postgres Chat Memory', icon: <Memory />, type: 'memory' },
      { id: 'redis-memory', label: 'Redis Memory', icon: <Memory />, type: 'memory' },
      { id: 'vector-store', label: 'Vector Store', icon: <Memory />, type: 'memory' },
    ],
  },
  {
    name: 'Compliance Tools',
    description: 'Validate evidence, check policies, score risk, and log audit trails',
    items: [
      { id: 'evidence-check', label: 'Evidence Validator', icon: <CheckCircle />, type: 'compliance' },
      { id: 'policy-check', label: 'Policy Checker', icon: <Security />, type: 'compliance' },
      { id: 'risk-scorer', label: 'Risk Scorer', icon: <Security />, type: 'compliance' },
      { id: 'audit-log', label: 'Audit Logger', icon: <Settings />, type: 'compliance' },
    ],
  },
  {
    name: 'Integrations',
    description: 'Connect to Slack, Jira, GitHub, AWS, and other external services',
    items: [
      { id: 'slack', label: 'Slack', icon: <IntegrationInstructions />, type: 'integration' },
      { id: 'jira', label: 'Jira', icon: <IntegrationInstructions />, type: 'integration' },
      { id: 'github', label: 'GitHub', icon: <IntegrationInstructions />, type: 'integration' },
      { id: 'aws', label: 'AWS', icon: <IntegrationInstructions />, type: 'integration' },
    ],
  },
];

interface ComponentPaletteProps {
  onDragStart: (item: any) => void;
}

export default function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const [expanded, setExpanded] = useState<string[]>(['Triggers', 'AI Agents', 'Loop & Iteration']);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});

  const handleAccordionChange = (panel: string) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  const handleEdit = (itemId: string, currentLabel: string) => {
    setEditingId(itemId);
    if (!labels[itemId]) {
      setLabels((prev) => ({ ...prev, [itemId]: currentLabel }));
    }
  };

  const handleSave = (itemId: string) => {
    setEditingId(null);
  };

  const getLabel = (itemId: string, defaultLabel: string) => {
    return labels[itemId] || defaultLabel;
  };

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: 'rgba(17, 24, 39, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        p: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 180px)',
        maxHeight: 'calc(100vh - 180px)',
        position: 'relative',
        zIndex: 1,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.4)',
          },
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
        Workflow Components
      </Typography>

      {componentCategories.map((category) => (
        <Accordion
          key={category.name}
          expanded={expanded.includes(category.name)}
          onChange={() => handleAccordionChange(category.name)}
          sx={{
            bgcolor: 'transparent',
            boxShadow: 'none',
            '&:before': { display: 'none' },
            mb: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
            sx={{
              minHeight: 40,
              '& .MuiAccordionSummary-content': { margin: '8px 0' },
              px: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                {category.name}
              </Typography>
              <Tooltip title={category.description} arrow placement="right">
                <InfoOutlined sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', cursor: 'help' }} />
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pl: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {category.items.map((item) => (
                <Paper
                  key={item.id}
                  draggable={editingId !== item.id}
                  onDragStart={() => onDragStart({ ...item, label: getLabel(item.id, item.label) })}
                  sx={{
                    p: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    cursor: editingId === item.id ? 'default' : 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:active': {
                      cursor: editingId === item.id ? 'default' : 'grabbing',
                    },
                  }}
                >
                  <Box sx={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  {editingId === item.id ? (
                    <TextField
                      value={labels[item.id] || item.label}
                      onChange={(e) => setLabels((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      size="small"
                      variant="standard"
                      autoFocus
                      sx={{
                        flexGrow: 1,
                        '& input': { color: 'white', fontSize: 13, p: 0 },
                        '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255, 255, 255, 0.3)' },
                        '& .MuiInput-underline:after': { borderBottomColor: '#6366f1' },
                      }}
                    />
                  ) : (
                    <Typography variant="caption" sx={{ color: 'white', fontSize: 13, flexGrow: 1 }}>
                      {getLabel(item.id, item.label)}
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => editingId === item.id ? handleSave(item.id) : handleEdit(item.id, item.label)}
                    sx={{ p: 0.5, color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: 'white' } }}
                  >
                    {editingId === item.id ? <Save fontSize="small" /> : <Edit fontSize="small" />}
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
