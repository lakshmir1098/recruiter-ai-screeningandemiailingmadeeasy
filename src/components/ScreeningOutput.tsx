import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Send,
  Copy,
  User
} from "lucide-react";
import { ScreeningResult } from "@/types/candidate";
import { toast } from "sonner";
import { useState } from "react";

interface ScreeningOutputProps {
  result: ScreeningResult;
  onSendInvite: () => Promise<void>;
}

export const ScreeningOutput = ({ result, onSendInvite }: ScreeningOutputProps) => {
  const [isSending, setIsSending] = useState(false);

  const getActionIcon = () => {
    switch (result.recommendedAction) {
      case "Interview":
        return <CheckCircle className="h-5 w-5" />;
      case "Review":
        return <AlertCircle className="h-5 w-5" />;
      case "Reject":
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getActionColor = () => {
    switch (result.recommendedAction) {
      case "Interview":
        return "bg-success/10 text-success border-success/20";
      case "Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Reject":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getFitColor = () => {
    switch (result.fitCategory) {
      case "Strong":
        return "text-success";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-destructive";
    }
  };

  const handleSendInvite = async () => {
    setIsSending(true);
    try {
      await onSendInvite();
      toast.success("Interview invite sent successfully!");
    } catch {
      toast.error("Failed to send invite. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyRejection = () => {
    navigator.clipboard.writeText(
      `Thank you for your interest. After careful review, we've decided to move forward with other candidates whose experience more closely matches our current requirements.`
    );
    toast.success("Rejection message copied to clipboard");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Fit Score Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Fit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getFitColor()}`}>
                {result.fitScore}
              </div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
            <div className="flex-1">
              <Progress 
                value={result.fitScore} 
                className="h-3"
              />
              <div className="flex justify-between mt-2">
                <Badge variant="outline" className={getFitColor()}>
                  {result.fitCategory} Fit
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Snapshot */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Candidate Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Seniority</div>
              <div className="font-medium">{result.candidateSnapshot.estimatedSeniority}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Experience</div>
              <div className="font-medium">{result.candidateSnapshot.yearsOfExperience} years</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Role</div>
              <div className="font-medium">{result.candidateSnapshot.lastRole}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Screening Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Screening Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {result.screeningSummary}
          </p>
        </CardContent>
      </Card>

      {/* Recommended Action */}
      <Card className={`border-2 ${getActionColor()}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getActionIcon()}
              <div>
                <div className="font-semibold">Recommended Action</div>
                <div className="text-sm opacity-80">{result.recommendedAction}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <TrendingUp className="h-4 w-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <TrendingDown className="h-4 w-4" />
              Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.gaps.map((gap, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  {gap}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Step Actions */}
      <Card>
        <CardContent className="py-4">
          {result.recommendedAction === "Interview" && (
            <Button 
              onClick={handleSendInvite} 
              disabled={isSending}
              className="w-full gap-2"
              size="lg"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending Invite..." : "Send Interview Invite"}
            </Button>
          )}
          {result.recommendedAction === "Reject" && (
            <Button 
              onClick={handleCopyRejection}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <Copy className="h-4 w-4" />
              Copy Rejection Message
            </Button>
          )}
          {result.recommendedAction === "Review" && (
            <div className="text-center text-muted-foreground">
              This candidate requires manual review. Check Action Items for details.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
