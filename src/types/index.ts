export type Framework = 'SOC2' | 'ISO27001' | 'HIPAA' | 'GDPR' | 'PCI-DSS';

export type ControlStatus = 'passing' | 'failing' | 'pending' | 'not-tested';

export type EvidenceStatus = 'current' | 'expiring-soon' | 'expired' | 'pending' | 'approved' | 'rejected';

export type EvidenceType = 'document' | 'screenshot' | 'configuration' | 'log' | 'attestation' | 'third-party-report';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type PolicyStatus = 'draft' | 'review' | 'awaiting-approval' | 'published' | 'archived';

export type NodeType = 'trigger' | 'control' | 'evidence' | 'approval' | 'notification' | 'integration' | 'decision';

export interface Control {
  id: string;
  name: string;
  description: string;
  frameworks: Framework[];
  status: ControlStatus;
  owner: string;
  lastTested: string;
  evidenceCount: number;
  citations: Citation[];
}

export interface Citation {
  framework: Framework;
  controlId: string;
  text: string;
  interpretation: string;
  implementationNotes: string;
}

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  status: EvidenceStatus;
  collectionDate: string;
  source: string;
  owner: string;
  reviewer?: string;
  approvalDate?: string;
  frameworks: Framework[];
  controlIds: string[];
  fileUrl?: string;
  metadata: Record<string, any>;
}

export interface FrameworkReadiness {
  framework: Framework;
  percentageReady: number;
  controlsPassing: number;
  controlsFailing: number;
  controlsPending: number;
  controlsNotTested: number;
}

export interface ApprovalWorkflow {
  id: string;
  stages: ApprovalStage[];
  currentStageIndex: number;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
}

export interface ApprovalStage {
  id: string;
  name: string;
  type: 'parallel' | 'sequential';
  approvers: Approver[];
}

export interface Approver {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: ApprovalStatus;
  timestamp?: string;
  comment?: string;
  delegatedTo?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config?: Record<string, any>;
    status?: 'pending' | 'running' | 'completed' | 'failed';
  };
}

export interface Policy {
  id: string;
  name: string;
  version: string;
  status: PolicyStatus;
  lastModified: string;
  owner: string;
  content: string;
  frameworks: Framework[];
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  inherentRisk: RiskLevel;
  residualRisk: RiskLevel;
  controls: string[];
  owner: string;
}
