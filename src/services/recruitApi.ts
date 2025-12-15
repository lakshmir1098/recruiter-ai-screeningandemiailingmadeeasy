// n8n webhook URLs - update these with your actual n8n webhook URLs
const N8N_BASE_URL = "https://your-n8n-instance.com/webhook";
const SCREEN_WEBHOOK_ID = "b41ad258-86d3-42e3-9319-88271b95e5ab";
const INVITE_WEBHOOK_PATH = "api/recruitai/action/invite";
const REJECT_WEBHOOK_ID = "2cb93916-2c97-44ae-a87c-99fdcb24c1dc";

export interface ScreeningRequest {
  jd: string;
  resume: string;
}

export interface ScreeningResponse {
  fitScore: number;
  fitCategory: "Strong" | "Medium" | "Low";
  screeningSummary: string;
  strengths: string[];
  gaps: string[];
  recommendedAction: "Interview" | "Review" | "Reject";
}

export interface CandidateActionRequest {
  candidate: {
    email: string;
    name: string;
  };
  jobTitle: string;
  companyName: string;
}

export const screenCandidate = async (request: ScreeningRequest): Promise<ScreeningResponse> => {
  const response = await fetch(`${N8N_BASE_URL}/${SCREEN_WEBHOOK_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jd: request.jd,
      resume: request.resume,
    }),
  });

  if (!response.ok) {
    throw new Error(`Screening failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    fitScore: data.fitScore,
    fitCategory: data.fitCategory,
    screeningSummary: data.screeningSummary,
    strengths: data.strengths || [],
    gaps: data.gaps || [],
    recommendedAction: data.recommendedAction,
  };
};

export const sendInvite = async (request: CandidateActionRequest): Promise<void> => {
  const response = await fetch(`${N8N_BASE_URL}/${INVITE_WEBHOOK_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidate: {
        email: request.candidate.email,
        name: request.candidate.name,
      },
      jobTitle: request.jobTitle,
      companyName: request.companyName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Invite failed: ${response.statusText}`);
  }
};

export const sendRejection = async (request: CandidateActionRequest): Promise<void> => {
  const response = await fetch(`${N8N_BASE_URL}/${REJECT_WEBHOOK_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidate: {
        email: request.candidate.email,
        name: request.candidate.name,
      },
      jobTitle: request.jobTitle,
      companyName: request.companyName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Rejection failed: ${response.statusText}`);
  }
};
