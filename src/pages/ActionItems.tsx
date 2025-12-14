import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  Users, 
  XCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { useCandidates } from "@/context/CandidateContext";
import { format } from "date-fns";

const ActionItems = () => {
  const { actionItems, removeActionItem } = useCandidates();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Review":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "Response Pending":
        return <Clock className="h-5 w-5 text-primary" />;
      case "Duplicate":
        return <Users className="h-5 w-5 text-muted-foreground" />;
      case "Invite Failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5" />;
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

  const handleResolve = (itemId: string) => {
    removeActionItem(itemId);
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
          <div className="space-y-4">
            {actionItems.map((item) => (
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActionItems;
