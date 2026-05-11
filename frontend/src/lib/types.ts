export interface Claim {
  id: number;
  claim: string;
  source_url: string;
  verdict: "SUPPORTED" | "REFUTED" | "INSUFFICIENT_EVIDENCE";
  confidence: number;
  reasoning: string;
  sources_found?: number;
  submitter: string;
}
