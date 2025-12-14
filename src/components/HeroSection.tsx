import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap, Clock } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-6xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Recruitment Platform
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Find Your Perfect
          <span className="block text-primary">Candidates Faster</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          RecruitAI uses advanced artificial intelligence to analyze resumes, match candidates 
          to job requirements, and help you make better hiring decisions in minutes, not days.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <a href="#demo">
              Try Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Watch Video
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground mb-1">75%</span>
            <span className="text-sm text-muted-foreground">Faster Screening</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground mb-1">10K+</span>
            <span className="text-sm text-muted-foreground">Candidates Analyzed</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground mb-1">95%</span>
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};
