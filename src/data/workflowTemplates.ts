import { Node, Edge } from 'reactflow';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
}

export const workflowTemplates: Record<string, WorkflowTemplate> = {
  'claims-detection': {
    id: 'claims-detection',
    name: 'Claims Detection',
    description: 'Detect fraudulent or invalid insurance claims automatically',
    category: 'compliance',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 50, y: 150 },
        data: {
          label: 'Webhook Trigger',
          subtitle: 'claim submitted',
          icon: "Webhook",
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 280, y: 150 },
        data: {
          label: 'Document Parser',
          subtitle: 'extract claim data',
          icon: "Description",
        },
      },
      {
        id: '3',
        type: 'standard',
        position: { x: 510, y: 150 },
        data: {
          label: 'AI Agent',
          subtitle: 'fraud detection',
          icon: "SmartToy",
        },
      },
      {
        id: '4',
        type: 'standard',
        position: { x: 740, y: 150 },
        data: {
          label: 'Policy Checker',
          subtitle: 'validate coverage',
          icon: "Security",
        },
      },
      {
        id: '5',
        type: 'decision',
        position: { x: 990, y: 120 },
        data: {
          label: 'Valid Claim?',
        },
      },
      {
        id: '6',
        type: 'standard',
        position: { x: 1200, y: 80 },
        data: {
          label: 'Auto-Approve',
          subtitle: 'process payment',
          icon: "SmartToy",
        },
      },
      {
        id: '7',
        type: 'standard',
        position: { x: 1200, y: 220 },
        data: {
          label: 'Flag for Review',
          subtitle: 'send to adjuster',
          icon: "Security",
        },
      },
      {
        id: '8',
        type: 'standard',
        position: { x: 1430, y: 150 },
        data: {
          label: 'Slack Notification',
          subtitle: 'alert team',
          icon: "IntegrationInstructions",
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e4-5', source: '4', target: '5', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e5-6', source: '5', target: '6', animated: true, type: 'editable', style: { stroke: '#10b981', strokeWidth: 1.5 }, data: { branchLabel: '✓ approved' } },
      { id: 'e5-7', source: '5', target: '7', animated: true, type: 'editable', style: { stroke: '#ef4444', strokeWidth: 1.5 }, data: { branchLabel: '⚠ flagged' } },
      { id: 'e6-8', source: '6', target: '8', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e7-8', source: '7', target: '8', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    ],
  },

  'vendor-risk': {
    id: 'vendor-risk',
    name: 'Vendor Risk Assessment',
    description: 'Automated third-party vendor security and compliance evaluation',
    category: 'risk-management',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 50, y: 200 },
        data: {
          label: 'Schedule Trigger',
          subtitle: 'monthly review',
          icon: "AccessTime",
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 280, y: 200 },
        data: {
          label: 'Fetch Vendor List',
          subtitle: 'active vendors',
          icon: "Memory",
        },
      },
      {
        id: '3',
        type: 'standard',
        position: { x: 510, y: 80 },
        data: {
          label: 'Security Scan',
          subtitle: 'check domains/SSL',
          icon: "Security",
        },
      },
      {
        id: '4',
        type: 'standard',
        position: { x: 510, y: 200 },
        data: {
          label: 'Compliance Check',
          subtitle: 'SOC2, GDPR, ISO27001',
          icon: "Security",
        },
      },
      {
        id: '5',
        type: 'standard',
        position: { x: 510, y: 320 },
        data: {
          label: 'Financial Review',
          subtitle: 'credit & stability',
          icon: "Calculate",
        },
      },
      {
        id: '6',
        type: 'standard',
        position: { x: 740, y: 200 },
        data: {
          label: 'Risk Scorer',
          subtitle: 'aggregate scores',
          icon: "Psychology",
        },
      },
      {
        id: '7',
        type: 'decision',
        position: { x: 970, y: 170 },
        data: {
          label: 'Risk Level?',
        },
      },
      {
        id: '8',
        type: 'standard',
        position: { x: 1180, y: 200 },
        data: {
          label: 'Jira Ticket',
          subtitle: 'track remediation',
          icon: "IntegrationInstructions",
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 }, label: 'parallel' },
      { id: 'e2-4', source: '2', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-5', source: '2', target: '5', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e3-6', source: '3', target: '6', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e4-6', source: '4', target: '6', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e5-6', source: '5', target: '6', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e6-7', source: '6', target: '7', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e7-8', source: '7', target: '8', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    ],
  },

  'access-review': {
    id: 'access-review',
    name: 'Access Review',
    description: 'Quarterly user access and permissions review automation',
    category: 'compliance',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 50, y: 150 },
        data: {
          label: 'Schedule Trigger',
          subtitle: 'quarterly',
          icon: "AccessTime",
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 280, y: 150 },
        data: {
          label: 'Fetch User List',
          subtitle: 'active users',
          icon: "Memory",
        },
      },
      {
        id: '3',
        type: 'standard',
        position: { x: 510, y: 150 },
        data: {
          label: 'Loop Over Users',
          subtitle: 'process each user',
          icon: "LoopIcon",
        },
      },
      {
        id: '4',
        type: 'standard',
        position: { x: 740, y: 150 },
        data: {
          label: 'Policy Matcher',
          subtitle: 'role vs permissions',
          icon: "Security",
        },
      },
      {
        id: '5',
        type: 'decision',
        position: { x: 970, y: 120 },
        data: {
          label: 'Compliant?',
        },
      },
      {
        id: '6',
        type: 'standard',
        position: { x: 1180, y: 150 },
        data: {
          label: 'Manager Alert',
          subtitle: 'review violation',
          icon: "IntegrationInstructions",
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e4-5', source: '4', target: '5', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e5-6', source: '5', target: '6', animated: true, type: 'editable', style: { stroke: '#ef4444', strokeWidth: 1.5 }, label: 'violation' },
    ],
  },

  'policy-violation': {
    id: 'policy-violation',
    name: 'Policy Violation Detection',
    description: 'Real-time policy violation detection and alerting',
    category: 'security',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 50, y: 150 },
        data: {
          label: 'Event Trigger',
          subtitle: 'real-time',
          icon: "Webhook",
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 280, y: 150 },
        data: {
          label: 'Document Scanner',
          subtitle: 'extract text',
          icon: "Description",
        },
      },
      {
        id: '3',
        type: 'standard',
        position: { x: 510, y: 150 },
        data: {
          label: 'Policy Engine',
          subtitle: 'match rules',
          icon: "Security",
        },
      },
      {
        id: '4',
        type: 'decision',
        position: { x: 740, y: 120 },
        data: {
          label: 'Violation?',
        },
      },
      {
        id: '5',
        type: 'standard',
        position: { x: 950, y: 150 },
        data: {
          label: 'Audit Logger',
          subtitle: 'record incident',
          icon: "Memory",
        },
      },
      {
        id: '6',
        type: 'standard',
        position: { x: 1180, y: 150 },
        data: {
          label: 'Alert Team',
          subtitle: 'compliance notification',
          icon: "IntegrationInstructions",
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e4-5', source: '4', target: '5', animated: true, type: 'editable', style: { stroke: '#ef4444', strokeWidth: 1.5 }, label: 'found' },
      { id: 'e5-6', source: '5', target: '6', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    ],
  },

  'evidence-collection': {
    id: 'evidence-collection',
    name: 'Evidence Collection',
    description: 'Automated evidence gathering and validation workflow',
    category: 'compliance',
    nodes: [
      {
        id: '1',
        type: 'standard',
        position: { x: 50, y: 150 },
        data: {
          label: 'Manual Trigger',
          subtitle: 'start collection',
          icon: "SmartToy",
        },
      },
      {
        id: '2',
        type: 'standard',
        position: { x: 280, y: 150 },
        data: {
          label: 'Evidence Validator',
          subtitle: 'check completeness',
          icon: "Security",
        },
      },
      {
        id: '3',
        type: 'standard',
        position: { x: 510, y: 150 },
        data: {
          label: 'Storage',
          subtitle: 'attach to control',
          icon: "Memory",
        },
      },
      {
        id: '4',
        type: 'standard',
        position: { x: 740, y: 150 },
        data: {
          label: 'Audit Logger',
          subtitle: 'record collection',
          icon: "Memory",
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, type: 'editable', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    ],
  },
};
