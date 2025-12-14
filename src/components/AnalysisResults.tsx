import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidateCard } from "@/components/CandidateCard";
import { Candidate } from "@/pages/Index";
import { TrendingUp, Users, Award, AlertTriangle } from "lucide-react";

interface AnalysisResultsProps {
  candidates: Candidate[];
  jobDescription: string;
}

export const AnalysisResults = ({ candidates, jobDescription }: AnalysisResultsProps) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Results Yet</h3>
        <p className="text-muted-foreground">
          Upload resumes and add a job description to see AI analysis results.
        </p>
      </div>
    );
  }

  const topCandidates = candidates.filter(c => c.matchScore >= 80);
  const avgScore = Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{candidates.length}</p>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{topCandidates.length}</p>
              <p className="text-sm text-muted-foreground">Top Matches (80%+)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
              <p className="text-sm text-muted-foreground">Average Match Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Ranked Candidates</h3>
          <Badge variant="outline">Sorted by Match Score</Badge>
        </div>
        
        <div className="grid gap-4">
          {candidates.map((candidate, index) => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate} 
              rank={index + 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
