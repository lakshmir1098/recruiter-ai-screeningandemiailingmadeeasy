import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  screenCandidate as screenCandidateApi, 
  sendInvite, 
  sendRejection,
  getStatusFromScore,
  needsManualAction 
} from "@/services/recruitApi";

export interface DbCandidate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  job_title: string;
  job_description: string | null;
  resume_text: string | null;
  fit_score: number | null;
  fit_category: string | null;
  screening_summary: string | null;
  recommended_action: string | null;
  strengths: string[] | null;
  gaps: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCandidatesDb = () => {
  const [candidates, setCandidates] = useState<DbCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCandidates = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, [user]);

  const screenAndSaveCandidate = async (
    name: string,
    email: string,
    jobTitle: string,
    jobDescription: string,
    resumeText: string
  ) => {
    if (!user) throw new Error("Not authenticated");

    // Call n8n screening webhook
    const screeningResult = await screenCandidateApi({
      jd: jobDescription,
      resume: resumeText,
    });

    // Determine status based on score
    const status = getStatusFromScore(screeningResult.fitScore);
    const requiresManualAction = needsManualAction(screeningResult.fitScore);

    // Save to database
    const { data: newCandidate, error } = await supabase
      .from("candidates")
      .insert({
        user_id: user.id,
        name,
        email,
        job_title: jobTitle,
        job_description: jobDescription,
        resume_text: resumeText,
        fit_score: screeningResult.fitScore,
        fit_category: screeningResult.fitCategory,
        screening_summary: screeningResult.screeningSummary,
        recommended_action: screeningResult.recommendedAction,
        strengths: screeningResult.strengths,
        gaps: screeningResult.gaps,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving candidate:", error);
      throw new Error("Failed to save candidate");
    }

    // Auto-trigger webhooks based on score
    if (status === "Invited") {
      // Score >= 90: Auto-invite
      try {
        await sendInvite({
          candidate: { email, name },
          jobTitle,
          companyName: "Your Company",
        });
        toast.success("Candidate auto-invited (score >= 90)");
      } catch (err) {
        console.error("Auto-invite failed:", err);
        toast.error("Auto-invite webhook failed");
      }
    } else if (status === "Rejected") {
      // Score <= 40: Auto-reject
      try {
        await sendRejection({
          candidate: { email, name },
          jobTitle,
          companyName: "Your Company",
        });
        toast.success("Candidate auto-rejected (score <= 40)");
      } catch (err) {
        console.error("Auto-reject failed:", err);
        toast.error("Auto-reject webhook failed");
      }
    }

    await fetchCandidates();
    return { candidate: newCandidate, requiresManualAction, screeningResult };
  };

  const inviteCandidate = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) throw new Error("Candidate not found");

    // Call n8n invite webhook
    await sendInvite({
      candidate: { email: candidate.email, name: candidate.name },
      jobTitle: candidate.job_title,
      companyName: "Your Company",
    });

    // Update status in database
    const { error } = await supabase
      .from("candidates")
      .update({ status: "Invited" })
      .eq("id", candidateId);

    if (error) throw new Error("Failed to update candidate status");

    await fetchCandidates();
    toast.success("Interview invite sent!");
  };

  const rejectCandidate = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) throw new Error("Candidate not found");

    // Call n8n reject webhook
    await sendRejection({
      candidate: { email: candidate.email, name: candidate.name },
      jobTitle: candidate.job_title,
      companyName: "Your Company",
    });

    // Update status in database
    const { error } = await supabase
      .from("candidates")
      .update({ status: "Rejected" })
      .eq("id", candidateId);

    if (error) throw new Error("Failed to update candidate status");

    await fetchCandidates();
    toast.info("Candidate rejected");
  };

  return {
    candidates,
    loading,
    screenAndSaveCandidate,
    inviteCandidate,
    rejectCandidate,
    refetch: fetchCandidates,
  };
};
