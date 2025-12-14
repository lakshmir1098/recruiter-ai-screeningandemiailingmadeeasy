import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Eye, 
  Send, 
  XCircle,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { useCandidates } from "@/context/CandidateContext";
import { toast } from "sonner";

const Candidates = () => {
  const { candidates, updateCandidate } = useCandidates();
  const [searchQuery, setSearchQuery] = useState("");
  const [fitFilter, setFitFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFit = fitFilter === "all" || 
      candidate.screeningResult?.fitCategory === fitFilter;
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesFit && matchesStatus;
  });

  const stats = {
    strong: candidates.filter((c) => c.screeningResult?.fitCategory === "Strong").length,
    medium: candidates.filter((c) => c.screeningResult?.fitCategory === "Medium").length,
    inProgress: candidates.filter((c) => c.status === "Pending").length,
  };

  const handleInvite = async (candidateId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateCandidate(candidateId, { status: "Invited" });
    toast.success("Interview invite sent!");
  };

  const handleReject = (candidateId: string) => {
    updateCandidate(candidateId, { status: "Rejected" });
    toast.info("Candidate rejected");
  };

  const getFitBadge = (fitCategory?: string) => {
    switch (fitCategory) {
      case "Strong":
        return <Badge className="bg-success/10 text-success border-success/20">Strong</Badge>;
      case "Medium":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case "Low":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Low</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Invited":
        return <Badge className="bg-success/10 text-success border-success/20">Invited</Badge>;
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case "Screened":
        return <Badge variant="secondary">Screened</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all screened candidates
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.strong}</p>
                  <p className="text-sm text-muted-foreground">Strong Fits</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.medium}</p>
                  <p className="text-sm text-muted-foreground">Medium Fits</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={fitFilter} onValueChange={setFitFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Fit Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fits</SelectItem>
                  <SelectItem value="Strong">Strong</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Screened">Screened</SelectItem>
                  <SelectItem value="Invited">Invited</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Candidates ({filteredCandidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No candidates found</p>
                <p className="text-sm">Screen candidates to see them here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Fit Score</TableHead>
                    <TableHead>Fit Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.jobTitle}</TableCell>
                      <TableCell>
                        {candidate.screeningResult ? (
                          <span className="font-medium">
                            {candidate.screeningResult.fitScore}/100
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{getFitBadge(candidate.screeningResult?.fitCategory)}</TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {candidate.status === "Screened" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleInvite(candidate.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(candidate.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Candidates;
