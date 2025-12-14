import { createContext, useContext, useState, ReactNode } from "react";
import { Candidate, ActionItem, ScreeningResult } from "@/types/candidate";

interface CandidateContextType {
  candidates: Candidate[];
  actionItems: ActionItem[];
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  addActionItem: (item: ActionItem) => void;
  removeActionItem: (id: string) => void;
  screenCandidate: (candidateId: string, result: ScreeningResult) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const addCandidate = (candidate: Candidate) => {
    setCandidates((prev) => [...prev, candidate]);
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addActionItem = (item: ActionItem) => {
    setActionItems((prev) => [...prev, item]);
  };

  const removeActionItem = (id: string) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const screenCandidate = (candidateId: string, result: ScreeningResult) => {
    updateCandidate(candidateId, {
      status: "Screened",
      screeningResult: result,
    });

    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Create action items based on recommendation
    if (result.recommendedAction === "Interview") {
      addActionItem({
        id: crypto.randomUUID(),
        candidateId,
        candidateName: candidate.name,
        type: "Pending Invite",
        description: `Strong fit - ready to send interview invite. Score: ${result.fitScore}/100`,
        priority: "High",
        createdAt: new Date(),
      });
    } else if (result.fitCategory === "Medium") {
      addActionItem({
        id: crypto.randomUUID(),
        candidateId,
        candidateName: candidate.name,
        type: "Review",
        description: `Medium fit candidate requires manual review. Score: ${result.fitScore}/100`,
        priority: "Medium",
        createdAt: new Date(),
      });
    } else if (result.recommendedAction === "Reject") {
      addActionItem({
        id: crypto.randomUUID(),
        candidateId,
        candidateName: candidate.name,
        type: "Pending Rejection",
        description: `Low fit - confirm rejection. Score: ${result.fitScore}/100`,
        priority: "Low",
        createdAt: new Date(),
      });
    }
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        actionItems,
        addCandidate,
        updateCandidate,
        addActionItem,
        removeActionItem,
        screenCandidate,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidateProvider");
  }
  return context;
};
