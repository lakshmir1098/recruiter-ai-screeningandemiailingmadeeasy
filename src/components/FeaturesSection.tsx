import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Shield, Zap, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description: "Our AI extracts and analyzes skills, experience, and qualifications from resumes in seconds."
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "Automatically match candidates to job requirements with precision scoring algorithms."
  },
  {
    icon: BarChart3,
    title: "Detailed Insights",
    description: "Get comprehensive reports on candidate strengths, gaps, and fit for the role."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process hundreds of resumes in minutes instead of spending hours on manual review."
  },
  {
    icon: Shield,
    title: "Bias Reduction",
    description: "AI-driven analysis helps reduce unconscious bias in the screening process."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share candidate profiles and insights with your hiring team seamlessly."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Hire Smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to streamline your recruitment process from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
