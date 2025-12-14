import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Resumes",
    description: "Drag and drop or upload multiple resumes in PDF, DOC, or DOCX format."
  },
  {
    icon: FileText,
    step: "02",
    title: "Add Job Description",
    description: "Paste your job description or requirements to define what you're looking for."
  },
  {
    icon: Brain,
    step: "03",
    title: "AI Analysis",
    description: "Our AI analyzes each resume against your job requirements in seconds."
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Review Results",
    description: "Get ranked candidates with detailed match scores and insights."
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get from resumes to ranked candidates in just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 shadow-sm">
                  <step.icon className="w-10 h-10 text-primary" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
