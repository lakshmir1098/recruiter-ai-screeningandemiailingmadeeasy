import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Candidate } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export const CandidateCard = ({ candidate, rank }: CandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Partial Match";
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      rank === 1 && "ring-2 ring-primary"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              {rank <= 3 && (
                <div className={cn(
                  "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  rank === 1 && "bg-yellow-400 text-yellow-900",
                  rank === 2 && "bg-gray-300 text-gray-700",
                  rank === 3 && "bg-amber-600 text-white"
                )}>
                  {rank}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.experience} experience</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={cn("text-3xl font-bold", getScoreColor(candidate.matchScore))}>
              {candidate.matchScore}%
            </div>
            <p className="text-xs text-muted-foreground">{getScoreLabel(candidate.matchScore)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Progress value={candidate.matchScore} className="h-2" />
        
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>{candidate.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span className="truncate">{candidate.education}</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              View Details
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{candidate.summary}</p>
            </div>

            {candidate.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {candidate.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {candidate.gaps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Areas for Consideration
                </h4>
                <ul className="space-y-1">
                  {candidate.gaps.map((gap, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">Contact Candidate</Button>
              <Button variant="outline" className="flex-1">Download Resume</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
