import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Zap, 
  Bell, 
  Clock, 
  Shield,
  Save,
  ExternalLink
} from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState({
    autoInviteStrong: true,
    requireReviewMedium: true,
    maxInvitesPerWeek: 50,
    timezone: "America/New_York",
    emailNotifications: true,
    slackNotifications: false,
    dataRetentionDays: 90,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your recruitment preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Automation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation
              </CardTitle>
              <CardDescription>
                Configure automatic actions for candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-invite" className="font-medium">
                    Auto-invite strong fits
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send interview invites to strong fit candidates
                  </p>
                </div>
                <Switch
                  id="auto-invite"
                  checked={settings.autoInviteStrong}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoInviteStrong: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="review-medium" className="font-medium">
                    Require review for medium fits
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add medium fit candidates to action items for manual review
                  </p>
                </div>
                <Switch
                  id="review-medium"
                  checked={settings.requireReviewMedium}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireReviewMedium: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="max-invites">Max invites per week</Label>
                <Input
                  id="max-invites"
                  type="number"
                  value={settings.maxInvitesPerWeek}
                  onChange={(e) =>
                    setSettings({ ...settings, maxInvitesPerWeek: parseInt(e.target.value) || 0 })
                  }
                  className="max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger className="max-w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Slack notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified in Slack
                  </p>
                </div>
                <Switch
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, slackNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Data retention period (days)</Label>
                <Input
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) =>
                    setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) || 30 })
                  }
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Candidate data will be automatically deleted after this period
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>
                  Recruit-AI integrates with internal AI and scheduling services.
                </p>
                <p className="mt-2">
                  Contact <span className="font-medium text-foreground">ops@company.com</span> for changes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
