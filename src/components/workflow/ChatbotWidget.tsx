import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Chat,
  Close,
  Send,
  SmartToy,
  Person,
  Minimize,
  OpenInFull,
} from '@mui/icons-material';
import { workflowTemplates } from '../../data/workflowTemplates';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: { label: string; action: () => void }[];
}

interface ChatbotWidgetProps {
  onWorkflowPreview?: (workflowId: string) => void;
  onComponentInfo?: (componentId: string) => void;
  onLoadTemplate?: (templateId: string) => void;
  externalMessage?: string | null;
}

export default function ChatbotWidget({
  onWorkflowPreview,
  onComponentInfo,
  onLoadTemplate,
  externalMessage,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your compliance workflow assistant. I can help you:\n\n• Find and preview workflows\n• Learn about workflow components\n• Guide you through building workflows\n• Answer compliance questions\n\nWhat would you like to know?',
      timestamp: new Date(),
      quickActions: [
        { label: 'Show me workflows', action: () => handleQuickAction('show-workflows') },
        { label: 'How does Loop work?', action: () => handleQuickAction('explain-loop') },
        { label: 'Create a new workflow', action: () => handleQuickAction('create-workflow') },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle external messages from parent
  useEffect(() => {
    if (externalMessage) {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: externalMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  }, [externalMessage]);

  const handleQuickAction = (action: string) => {
    let query = '';
    switch (action) {
      case 'show-workflows':
        query = 'Show me all available workflows';
        break;
      case 'explain-loop':
        query = 'How does the Loop component work?';
        break;
      case 'create-workflow':
        query = 'Help me create a new workflow';
        break;
    }
    if (query) {
      handleSendMessage(query);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        quickActions: response.quickActions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): { content: string; quickActions?: { label: string; action: () => void }[] } => {
    const lowerQuery = query.toLowerCase();

    // Enhanced workflow discovery with metadata (Test 1.2)
    if ((lowerQuery.includes('improve') || lowerQuery.includes('false positive')) && lowerQuery.includes('claims')) {
      const template = workflowTemplates['claims-detection'];
      return {
        content:
          `I can help! False positives often happen when decisions lack validation.\n` +
          `The **${template.name}** workflow is perfect for this:\n\n` +
          `📊 Workflow Details:\n` +
          `  • ${template.metadata.nodeCount} nodes\n` +
          `  • Integrations: ${template.metadata.integrations.join(', ')}\n` +
          `  • Current performance: ${template.metadata.baselineAccuracy}% accuracy\n` +
          `  • Status: Active in production (v1.0.0)\n\n` +
          `This template includes fraud detection and policy validation layers.`,
        quickActions: [
          { label: 'Tell me more', action: () => handleQuickAction('explain-claims') },
          { label: 'Load this template', action: () => onLoadTemplate?.('claims-detection') },
        ],
      };
    }

    // Workflow discovery
    if (lowerQuery.includes('show') && lowerQuery.includes('workflow')) {
      return {
        content: 'Here are the available workflows:\n\n1. **Claims Detection** - Detect misleading compliance claims\n2. **Vendor Risk** - Automated vendor risk assessment\n3. **Access Review** - Quarterly access review automation\n4. **Policy Violation** - Real-time policy violation detection\n5. **Evidence Collection** - Automated evidence gathering\n\nWould you like to preview any of these?',
        quickActions: [
          { label: 'Preview Claims Detection', action: () => onWorkflowPreview?.('claims-detection') },
          { label: 'Preview Vendor Risk', action: () => onWorkflowPreview?.('vendor-risk') },
        ],
      };
    }

    // Component information
    if (lowerQuery.includes('loop') || lowerQuery.includes('iteration')) {
      return {
        content: '**Loop Over Items** processes each item in a list one by one.\n\n**How it works:**\n• Takes an array as input\n• Executes the connected nodes for each item\n• Outputs results as an array\n\n**Use cases:**\n• Process multiple claims\n• Batch API calls\n• Iterate over documents\n\nWant to learn about other components?',
        quickActions: [
          { label: 'Tell me about AI Agent', action: () => handleQuickAction('explain-ai-agent') },
          { label: 'What is Critic Agent?', action: () => handleQuickAction('explain-critic') },
        ],
      };
    }

    if (lowerQuery.includes('ai agent')) {
      return {
        content: '**AI Agent** executes LLM tasks like analysis, generation, and classification.\n\n**Key features:**\n• Connect to Claude (Anthropic), OpenAI, or custom LLMs\n• Define custom prompts\n• Stream responses\n• Handle retries and errors\n\n**Common use cases:**\n• Text classification\n• Data extraction\n• Content generation\n• Sentiment analysis',
      };
    }

    if (lowerQuery.includes('critic')) {
      return {
        content: '**Critic Agent** evaluates and critiques AI-generated content.\n\n**How it works:**\n• Receives output from another agent\n• Analyzes quality, accuracy, compliance\n• Provides structured feedback\n• Can trigger refinement loops\n\n**Use for:**\n• Quality assurance\n• Compliance checking\n• Multi-step reasoning\n• Self-correction flows',
      };
    }

    // Component guidance for adding validation (Test 1.4)
    if (lowerQuery.includes('validation') || (lowerQuery.includes('add') && lowerQuery.includes('step'))) {
      return {
        content:
          `Great idea! You can use a **Critic Agent** to validate AI outputs.\n\n` +
          `🤖 Critic Agent:\n` +
          `  • Purpose: Evaluates and critiques AI-generated content\n` +
          `  • Use case: Quality assurance, compliance checking\n` +
          `  • Configuration: Define validation criteria\n\n` +
          `📍 How to add it:\n` +
          `  1. Drag 'Critic Agent' from Components palette (left side)\n` +
          `  2. Drop between 'AI Agent' and 'Decision' nodes\n` +
          `  3. Connect: AI Agent → Critic Agent → Decision`,
        quickActions: [
          { label: 'Show me Critic Agent in palette', action: () => onComponentInfo?.('critic-agent') },
        ],
      };
    }

    // Workflow creation
    if (lowerQuery.includes('create') || lowerQuery.includes('build') || lowerQuery.includes('new workflow')) {
      return {
        content: 'I\'ll guide you through creating a workflow:\n\n**Step 1:** What type of workflow do you want to create?\n• Claims processing\n• Risk assessment\n• Compliance checking\n• Custom automation\n\n**Step 2:** Choose your trigger (manual, webhook, schedule)\n\n**Step 3:** Add processing steps (AI agents, loops, conditionals)\n\n**Step 4:** Define outputs and notifications\n\nWhich type interests you?',
        quickActions: [
          { label: 'Claims processing', action: () => {} },
          { label: 'Risk assessment', action: () => {} },
          { label: 'Use a template instead', action: () => handleQuickAction('show-workflows') },
        ],
      };
    }

    // Compliance queries
    if (lowerQuery.includes('compliance') || lowerQuery.includes('regulation') || lowerQuery.includes('gdpr') || lowerQuery.includes('sox')) {
      return {
        content: 'I can help with compliance questions:\n\n**SOX Compliance:** Financial reporting and internal controls\n**GDPR:** Data privacy and user consent\n**HIPAA:** Healthcare data protection\n**PCI DSS:** Payment card security\n\nWhat specific compliance topic would you like to know about?',
      };
    }

    // Default response
    return {
      content: 'I can help you with:\n\n• **Workflows:** Browse, preview, and select templates\n• **Components:** Learn how each component works\n• **Building:** Step-by-step workflow creation\n• **Compliance:** Answer regulation questions\n\nWhat would you like to explore?',
      quickActions: [
        { label: 'Show workflows', action: () => handleQuickAction('show-workflows') },
        { label: 'Explain components', action: () => handleQuickAction('explain-loop') },
      ],
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <IconButton
        aria-label="Open chat assistant"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1400,
          width: 60,
          height: 60,
          bgcolor: '#818cf8',
          color: 'white',
          boxShadow: '0 4px 20px rgba(129, 140, 248, 0.4)',
          '&:hover': {
            bgcolor: '#6366f1',
            boxShadow: '0 6px 24px rgba(129, 140, 248, 0.5)',
          },
        }}
      >
        <Chat sx={{ fontSize: 28 }} />
      </IconButton>
    );
  }

  return (
    <Fade in={isOpen}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1400,
          width: isMinimized ? 320 : 400,
          height: isMinimized ? 60 : 600,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'rgba(17, 24, 39, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'rgba(99, 102, 241, 0.2)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#818cf8' }}>
              <SmartToy sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                Compliance Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>
                AI-powered helper
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {isMinimized ? <OpenInFull sx={{ fontSize: 18 }} /> : <Minimize sx={{ fontSize: 18 }} />}
            </IconButton>
            <IconButton aria-label="Close chat" size="small" onClick={() => setIsOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={!isMinimized}>
          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                data-message-role={message.role}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: message.role === 'user' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                  }}
                >
                  {message.role === 'user' ? <Person sx={{ fontSize: 16 }} /> : <SmartToy sx={{ fontSize: 16 }} />}
                </Avatar>
                <Box sx={{ maxWidth: '75%' }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: message.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${message.role === 'user' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontSize: 13,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                  {message.quickActions && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {message.quickActions.map((action, idx) => (
                        <Chip
                          key={idx}
                          label={action.label}
                          size="small"
                          onClick={action.action}
                          sx={{
                            fontSize: 10,
                            height: 24,
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.3)' },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(34, 197, 94, 0.3)' }}>
                  <SmartToy sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{ display: 'flex', gap: 0.5, p: 1 }}>
                  <CircularProgress size={8} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Typing...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    fontSize: 13,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              />
              <IconButton
                aria-label="Send message"
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                sx={{
                  bgcolor: '#818cf8',
                  color: 'white',
                  '&:hover': { bgcolor: '#6366f1' },
                  '&.Mui-disabled': { bgcolor: 'rgba(129, 140, 248, 0.3)' },
                }}
              >
                <Send sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Fade>
  );
}
