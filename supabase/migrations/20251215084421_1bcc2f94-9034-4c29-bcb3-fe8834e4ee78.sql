-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  resume_text TEXT,
  fit_score INTEGER CHECK (fit_score >= 0 AND fit_score <= 100),
  fit_category TEXT CHECK (fit_category IN ('Strong', 'Medium', 'Low')),
  screening_summary TEXT,
  recommended_action TEXT CHECK (recommended_action IN ('Interview', 'Review', 'Reject')),
  strengths TEXT[],
  gaps TEXT[],
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Screened', 'Invited', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own candidates
CREATE POLICY "Users can view their own candidates"
ON public.candidates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own candidates"
ON public.candidates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidates"
ON public.candidates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own candidates"
ON public.candidates FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();