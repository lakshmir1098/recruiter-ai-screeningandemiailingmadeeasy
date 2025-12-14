export interface CandidateSnapshot {
  estimatedSeniority: string;
  yearsOfExperience: number;
  lastRole: string;
}

export interface ScreeningResult {
  fitScore: number;
  fitCategory: "Strong" | "Medium" | "Low";
  screeningSummary: string;
  recommendedAction: "Interview" | "Review" | "Reject";
  strengths: string[];
  gaps: string[];
  candidateSnapshot: CandidateSnapshot;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeText: string;
  jobTitle: string;
  status: "Pending" | "Screened" | "Invited" | "Rejected";
  screeningResult?: ScreeningResult;
  createdAt: Date;
}

export interface ActionItem {
  id: string;
  candidateId: string;
  candidateName: string;
  type: "Review" | "Response Pending" | "Duplicate" | "Invite Failed";
  description: string;
  priority: "High" | "Medium" | "Low";
  createdAt: Date;
}
