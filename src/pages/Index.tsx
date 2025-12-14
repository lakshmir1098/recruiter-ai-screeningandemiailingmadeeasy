import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Upload, 
  FileText, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Shield
} from "lucide-react";
import { CandidateCard } from "@/components/CandidateCard";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ResumeUploader } from "@/components/ResumeUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Footer } from "@/components/Footer";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  strengths: string[];
  gaps: string[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [jobDescription, setJobDescription] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription || candidates.length === 0) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update candidates with mock analysis results
    const analyzedCandidates = candidates.map(candidate => ({
      ...candidate,
      matchScore: Math.floor(Math.random() * 40) + 60,
      strengths: ["Strong technical background", "Relevant experience", "Good communication skills"],
      gaps: ["Limited leadership experience", "Missing specific certification"]
    }));
    
    setCandidates(analyzedCandidates.sort((a, b) => b.matchScore - a.matchScore));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setActiveTab("results");
  };

  const handleResumesUploaded = (newCandidates: Candidate[]) => {
    setCandidates(prev => [...prev, ...newCandidates]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!analysisComplete ? (
        <>
          <HeroSection />
          
          <section id="demo" className="py-20 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Try It Now
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Experience AI-Powered Recruitment
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Upload resumes and paste a job description to see our AI in action
                </p>
              </div>

              <Card className="border-border/50 shadow-xl">
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Resumes
                      </TabsTrigger>
                      <TabsTrigger value="job" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Job Description
                      </TabsTrigger>
                      <TabsTrigger value="results" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Results
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-6">
                      <ResumeUploader onResumesUploaded={handleResumesUploaded} />
                      {candidates.length > 0 && (
                        <div className="mt-6">
                          <p className="text-sm text-muted-foreground mb-3">
                            {candidates.length} resume(s) uploaded
                          </p>
                          <Button onClick={() => setActiveTab("job")} className="w-full">
                            Continue to Job Description
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="job" className="space-y-6">
                      <JobDescriptionInput 
                        value={jobDescription} 
                        onChange={setJobDescription} 
                      />
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={!jobDescription || candidates.length === 0 || isAnalyzing}
                        className="w-full"
                        size="lg"
                      >
                        {isAnalyzing ? (
                          <>
                            <Brain className="w-4 h-4 mr-2 animate-pulse" />
                            Analyzing Candidates...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <Progress value={66} className="h-2" />
                          <p className="text-sm text-muted-foreground text-center">
                            AI is analyzing resumes against job requirements...
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="results">
                      <AnalysisResults candidates={candidates} jobDescription={jobDescription} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          <FeaturesSection />
          <HowItWorksSection />
        </>
      ) : (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Analysis Results
                </h2>
                <p className="text-muted-foreground">
                  {candidates.length} candidates ranked by AI match score
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAnalysisComplete(false);
                  setCandidates([]);
                  setJobDescription("");
                  setActiveTab("upload");
                }}
              >
                Start New Analysis
              </Button>
            </div>
            <AnalysisResults candidates={candidates} jobDescription={jobDescription} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
