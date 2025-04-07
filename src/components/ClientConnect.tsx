
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Facebook, Calendar, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const ClientConnect: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [showFacebookDialog, setShowFacebookDialog] = useState(false);
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  
  // Check if client is authenticated
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem("clientAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/client-access");
    }
  }, [navigate]);

  // Update progress when connections change
  React.useEffect(() => {
    let newProgress = 0;
    if (googleConnected) newProgress += 50;
    if (facebookConnected) newProgress += 50;
    setProgress(newProgress);
  }, [googleConnected, facebookConnected]);

  const handleConnectFacebook = () => {
    // In a real implementation, this would initiate OAuth flow with Facebook
    setShowFacebookDialog(true);
  };

  const handleConnectGoogle = () => {
    // In a real implementation, this would initiate OAuth flow with Google
    setShowGoogleDialog(true);
  };

  const simulateFacebookConnection = () => {
    toast.success("Facebook Ads account connected successfully");
    setFacebookConnected(true);
    setShowFacebookDialog(false);
    
    // In a real app, we'd store the connection info securely
    localStorage.setItem("facebookAdsConnected", "true");
    localStorage.setItem("facebookClientId", "mock-fb-client-id-" + Date.now());
  };

  const simulateGoogleConnection = () => {
    toast.success("Google Calendar connected successfully");
    setGoogleConnected(true);
    setShowGoogleDialog(false);
    
    // In a real app, we'd store the connection info securely
    localStorage.setItem("googleCalendarConnected", "true");
    localStorage.setItem("googleClientId", "mock-google-client-id-" + Date.now());
  };

  const handleContinueToDashboard = () => {
    navigate("/client-dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connect Your Accounts</h1>
          <p className="text-gray-500">
            Connect your accounts to get the most out of our services.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Connection progress</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Facebook Ads</h3>
                  <p className="text-sm text-gray-500">
                    Allow us to access your ad accounts
                  </p>
                </div>
              </div>
              {facebookConnected ? (
                <Button variant="outline" size="sm" disabled>
                  Connected
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleConnectFacebook}>
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-gray-500">
                    Sync appointments and events
                  </p>
                </div>
              </div>
              {googleConnected ? (
                <Button variant="outline" size="sm" disabled>
                  Connected
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleConnectGoogle}>
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinueToDashboard}
          disabled={!googleConnected && !facebookConnected}
          className="w-full"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Facebook connection dialog */}
      <Dialog open={showFacebookDialog} onOpenChange={setShowFacebookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Facebook Ads</DialogTitle>
            <DialogDescription>
              This will allow us to access your Facebook Ads account to provide reports and optimize your campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              By connecting, you are granting us permission to:
            </p>
            <ul className="list-disc pl-5 pt-2 text-sm text-gray-500">
              <li>View your ad campaigns</li>
              <li>Access campaign performance metrics</li>
              <li>Monitor leads generated from ads</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFacebookDialog(false)}>Cancel</Button>
            <Button onClick={simulateFacebookConnection}>Authorize Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Google connection dialog */}
      <Dialog open={showGoogleDialog} onOpenChange={setShowGoogleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Google Calendar</DialogTitle>
            <DialogDescription>
              This will allow us to schedule and manage appointments on your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              By connecting, you are granting us permission to:
            </p>
            <ul className="list-disc pl-5 pt-2 text-sm text-gray-500">
              <li>View your calendar events</li>
              <li>Create new appointments</li>
              <li>Update existing appointments</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoogleDialog(false)}>Cancel</Button>
            <Button onClick={simulateGoogleConnection}>Authorize Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientConnect;
