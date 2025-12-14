import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Candidate } from "@/pages/Index";

interface ResumeUploaderProps {
  onResumesUploaded: (candidates: Candidate[]) => void;
}

export const ResumeUploader = ({ onResumesUploaded }: ResumeUploaderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processResumes = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock candidates from uploaded files
    const mockCandidates: Candidate[] = uploadedFiles.map((file, index) => ({
      id: `candidate-${Date.now()}-${index}`,
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      email: `candidate${index + 1}@example.com`,
      phone: `+1 (555) ${String(100 + index).padStart(3, '0')}-${String(1000 + index).padStart(4, '0')}`,
      matchScore: 0,
      skills: ["JavaScript", "React", "TypeScript", "Node.js", "Python"].slice(0, Math.floor(Math.random() * 3) + 2),
      experience: `${Math.floor(Math.random() * 8) + 2} years`,
      education: "Bachelor's Degree in Computer Science",
      summary: "Experienced professional with a strong background in software development and team collaboration.",
      strengths: [],
      gaps: []
    }));
    
    onResumesUploaded(mockCandidates);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragActive ? "Drop files here" : "Drag & drop resumes here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (PDF, DOC, DOCX)
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button 
            onClick={processResumes} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Process {uploadedFiles.length} Resume(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
