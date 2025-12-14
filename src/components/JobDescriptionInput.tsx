import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const exampleJobDescription = `Senior Frontend Developer

We are looking for an experienced Frontend Developer to join our team.

Requirements:
- 5+ years of experience with React and TypeScript
- Strong understanding of modern CSS and responsive design
- Experience with state management (Redux, Zustand, or similar)
- Knowledge of testing frameworks (Jest, React Testing Library)
- Excellent problem-solving and communication skills

Nice to have:
- Experience with Next.js or similar frameworks
- Knowledge of CI/CD pipelines
- Experience mentoring junior developers`;

export const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="job-description" className="text-base font-medium flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Job Description
        </Label>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => onChange(exampleJobDescription)}
        >
          <Lightbulb className="w-3 h-3 mr-1" />
          Use Example
        </Badge>
      </div>
      
      <Textarea
        id="job-description"
        placeholder="Paste your job description here... Include requirements, qualifications, and any specific skills you're looking for."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] resize-none"
      />
      
      <p className="text-xs text-muted-foreground">
        Tip: Include specific skills, experience levels, and qualifications for better matching results.
      </p>
    </div>
  );
};
