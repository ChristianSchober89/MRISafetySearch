export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface ConditionalGuidelines {
  staticMagneticField: string;
  spatialGradientField: string;
  sarLimit: string;
  notes: string;
}

export type SafetyClassification = "MR Safe" | "MR Conditional" | "MR Unsafe" | "Unknown";

export interface StructuredSafetyInfo {
  deviceName: string;
  manufacturer: string;
  safetyClassification: SafetyClassification;
  summary: string;
  conditionalGuidelines: ConditionalGuidelines | null;
  risksAndArtifacts: string;
  waitingPeriod: string;
  disclaimer: string | null;
}

export interface SearchResult {
  data: StructuredSafetyInfo;
  sources: GroundingChunk[];
}
