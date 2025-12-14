import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Clock, 
  Users, 
  XCircle,
  CheckCircle,
  Eye,
  Send,
  UserX
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { useCandidates } from "@/context/CandidateContext";
import { format } from "date-fns";
import { ActionItemType } from "@/types/candidate";
import { toast } from "sonner";

const ActionItems = () => {
  const { actionItems, removeActionItem, candidates, updateCandidate } = useCandidates();

  const getTypeIcon = (type: ActionItemType) => {
    switch (type) {
      case "Review":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "Pending Invite":
        return <Send className="h-5 w-5 text-success" />;
      case "Pending Rejection":
        return <UserX className="h-5 w-5 text-destructive" />;
      case "Response Pending":
        return <Clock className="h-5 w-5 text-primary" />;
      case "Duplicate":
        return <Users className="h-5 w-5 text-muted-foreground" />;
      case "Invite Failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">High</Badge>;
      case "Medium":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case "Low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleSendInvite = (itemId: string, candidateId: string) => {
    updateCandidate(candidateId, { status: "Invited" });
    removeActionItem(itemId);
    toast.success("Interview invite sent successfully!");
  };

  const handleReject = (itemId: string, candidateId: string) => {
    updateCandidate(candidateId, { status: "Rejected" });
    removeActionItem(itemId);
    toast.success("Candidate rejected");
  };

  const handleResolve = (itemId: string) => {
    removeActionItem(itemId);
    toast.success("Action item resolved");
  };

  const getActionButtons = (item: typeof actionItems[0]) => {
    switch (item.type) {
      case "Pending Invite":
        return (
          <>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm"
              className="bg-success hover:bg-success/90"
              onClick={() => handleSendInvite(item.id, item.candidateId)}
            >
              <Send className="h-4 w-4 mr-1" />
              Send Invite
            </Button>
          </>
        );
      case "Pending Rejection":
        return (
          <>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm"
              variant="destructive"
              onClick={() => handleReject(item.id, item.candidateId)}
            >
              <UserX className="h-4 w-4 mr-1" />
              Confirm Reject
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm"
              onClick={() => handleResolve(item.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolve
            </Button>
          </>
        );
    }
  };

  // Group action items by type
  const pendingInvites = actionItems.filter(item => item.type === "Pending Invite");
  const pendingRejections = actionItems.filter(item => item.type === "Pending Rejection");
  const reviewItems = actionItems.filter(item => item.type === "Review");
  const otherItems = actionItems.filter(item => 
    !["Pending Invite", "Pending Rejection", "Review"].includes(item.type)
  );

  const renderSection = (title: string, items: typeof actionItems, icon: React.ReactNode) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.candidateName}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {format(item.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {getActionButtons(item)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Action Items</h1>
          <p className="text-muted-foreground mt-1">
            Items requiring your attention
          </p>
        </div>

        {actionItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success opacity-50" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No action items require your attention right now.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {renderSection("Pending Invites", pendingInvites, <Send className="h-5 w-5 text-success" />)}
            {renderSection("Pending Rejections", pendingRejections, <UserX className="h-5 w-5 text-destructive" />)}
            {renderSection("Requires Review", reviewItems, <AlertCircle className="h-5 w-5 text-warning" />)}
            {renderSection("Other Items", otherItems, <Clock className="h-5 w-5 text-primary" />)}
          </>
        )}
      </main>
    </div>
  );
};

export default ActionItems;
