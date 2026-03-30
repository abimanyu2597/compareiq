/**
 * CompareIQ AI — Shared TypeScript Types
 */

// ─── Input Types ──────────────────────────────────────────────────────────────
export type InputType = "text" | "pdf" | "url" | "image" | "audio";
export type Persona = "student" | "investor" | "developer" | "traveler" | "family" | "business" | "procurement";
export type DecisionMode = "buy" | "migrate" | "apply" | "shortlist" | "validate" | "choose_vendor" | "negotiate";
export type ComparisonStatus = "pending" | "running" | "done" | "error";
export type PipelineStepStatus = "pending" | "running" | "done" | "error";
export type ContradictionSeverity = "low" | "medium" | "high";

// ─── Entity ───────────────────────────────────────────────────────────────────
export interface Entity {
  id: string;
  label: string;
  inputType: InputType;
  content: string;
  file?: File;
  filePath?: string;
  fileId?: string;
}

// ─── Comparison Config ────────────────────────────────────────────────────────
export interface CriterionWeight {
  name: string;
  weight: number;
  description?: string;
}

export interface ComparisonConfig {
  intent: string;
  entities: Entity[];
  criteria: CriterionWeight[];
  persona: Persona;
  decisionMode: DecisionMode;
  enableMonitoring: boolean;
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────
export interface PipelineStep {
  id: string;
  label: string;
  status: PipelineStepStatus;
  detail?: string;
  startedAt?: Date;
  finishedAt?: Date;
}

// ─── Evidence ─────────────────────────────────────────────────────────────────
export interface EvidenceSnippet {
  text: string;
  sourceType: InputType;
  sourceRef: string;
  confidence: number;
  freshnessDate?: string;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
export interface CriterionScore {
  entityId: string;
  entityLabel: string;
  criterion: string;
  score: number;
  rationale: string;
  evidence: EvidenceSnippet[];
}

export interface EntitySummary {
  entityId: string;
  entityLabel: string;
  totalScore: number;
  rank: number;
  isWinner: boolean;
  pros: string[];
  cons: string[];
}

// ─── Contradictions ───────────────────────────────────────────────────────────
export interface Contradiction {
  claimA: string;
  claimB: string;
  sourceA: string;
  sourceB: string;
  severity: ContradictionSeverity;
  resolutionNote?: string;
}

// ─── Trust Metrics ────────────────────────────────────────────────────────────
export interface TrustMetrics {
  confidence: number;
  completeness: number;
  freshness: number;
  contradictionCount: number;
  missingFields: string[];
  uncertaintyWarnings: string[];
}

// ─── Comparison Result ────────────────────────────────────────────────────────
export interface ComparisonResult {
  id: string;
  status: ComparisonStatus;
  intent: string;
  persona: Persona;
  decisionMode: DecisionMode;
  createdAt: string;

  executiveSummary?: string;
  winnerId?: string;
  winnerLabel?: string;
  winnerRationale?: string;
  scores: EntitySummary[];
  criterionScores: CriterionScore[];
  contradictions: Contradiction[];
  trust?: TrustMetrics;
  followUpSuggestions: string[];
  monitoringEnabled: boolean;
}

// ─── Monitoring ───────────────────────────────────────────────────────────────
export interface MonitorStatus {
  comparisonId: string;
  enabled: boolean;
  lastChecked?: string;
  nextCheck?: string;
  changeCount: number;
  recommendationShifted: boolean;
  latestDelta?: Record<string, unknown>;
}

// ─── Use Case Cards ───────────────────────────────────────────────────────────
export interface UseCaseCard {
  label: string;
  tag: string;
  icon?: string;
}

// ─── Export ───────────────────────────────────────────────────────────────────
export type ExportFormat = "pdf" | "markdown" | "executive";
