import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Brain, 
  AlertCircle,
  Lightbulb,
  File
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { AppNavigation } from "@/components/AppNavigation";
import { ScreeningOutput } from "@/components/ScreeningOutput";
import { ScreeningResult } from "@/types/candidate";
import { useCandidates } from "@/context/CandidateContext";
import { toast } from "sonner";
import { screenCandidate as screenCandidateApi, sendInvite } from "@/services/recruitApi";

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

const Screen = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  
  const { addCandidate, updateCandidate } = useCandidates();

  const jdValidation = jobDescription.length >= 100;
  const resumeValidation = resumeText.length > 0 || resumeFile !== null;
  const canAnalyze = jdValidation && resumeValidation && !isAnalyzing;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setResumeFile(acceptedFiles[0]);
        setResumeText("");
        toast.success(`Uploaded: ${acceptedFiles[0].name}`);
      }
    },
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setScreeningResult(null);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => Math.min(prev + 15, 90));
    }, 400);

    try {
      // Call n8n screening webhook with correct JSON format
      const apiResult = await screenCandidateApi({
        jd: jobDescription,
        resume: resumeText || "Uploaded file content",
      });
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      const result: ScreeningResult = {
        fitScore: apiResult.fitScore,
        fitCategory: apiResult.fitCategory,
        screeningSummary: apiResult.screeningSummary,
        recommendedAction: apiResult.recommendedAction,
        strengths: apiResult.strengths,
        gaps: apiResult.gaps,
      };

      setScreeningResult(result);

      // Add candidate to context
      const candidateId = crypto.randomUUID();
      addCandidate({
        id: candidateId,
        name: "Candidate",
        email: "candidate@email.com",
        resumeText: resumeText || "Uploaded file",
        jobTitle: "Frontend Developer",
        status: "Screened",
        screeningResult: result,
        createdAt: new Date(),
      });

      toast.success("Analysis complete!");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Screening error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendInvite = async () => {
    try {
      await sendInvite({
        candidate: {
          email: "candidate@email.com",
          name: "Candidate",
        },
        jobTitle: "Frontend Developer",
        companyName: "Your Company",
      });
      toast.success("Interview invite sent!");
    } catch (error) {
      console.error("Invite error:", error);
      toast.error("Failed to send invite.");
    }
  };

  const handleReset = () => {
    setJobDescription("");
    setResumeText("");
    setResumeFile(null);
    setScreeningResult(null);
    setAnalysisProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Screening Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Paste a job description and upload a resume to analyze candidate fit
          </p>
        </div>

        {!screeningResult ? (
          <>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Job Description Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setJobDescription(exampleJobDescription)}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Use Example
                    </Badge>
                  </div>
                  <Textarea
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  {jobDescription.length > 0 && !jdValidation && (
                    <div className="flex items-center gap-2 text-warning text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Minimum 100 characters required ({jobDescription.length}/100)
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resume Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="h-5 w-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <File className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{resumeFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Click or drag to replace
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="font-medium">Drop resume here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports PDF, DOC, DOCX
                        </p>
                      </>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or paste text
                      </span>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Paste resume content here..."
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      if (e.target.value) setResumeFile(null);
                    }}
                    className="min-h-[180px] resize-none"
                    disabled={!!resumeFile}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Analyze Button */}
            <Card>
              <CardContent className="py-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  size="lg"
                  className="w-full gap-2 text-lg py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-5 w-5 animate-pulse" />
                      Analyzing with Recruit-AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      Analyze with Recruit-AI
                    </>
                  )}
                </Button>
                
                {isAnalyzing && (
                  <div className="mt-4 space-y-2">
                    <Progress value={analysisProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      AI is analyzing resume against job requirements...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <Button variant="outline" onClick={handleReset}>
                Screen Another Candidate
              </Button>
            </div>
            <ScreeningOutput result={screeningResult} onSendInvite={handleSendInvite} />
          </>
        )}
      </main>
    </div>
  );
};

export default Screen;
