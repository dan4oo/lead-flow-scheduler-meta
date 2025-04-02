
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [metaConnected, setMetaConnected] = useState(false);
  
  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated",
    });
  };
  
  const handleConnectGoogle = () => {
    setGoogleConnected(true);
    toast({
      title: "Connected to Google",
      description: "Your Google Calendar is now connected",
    });
  };
  
  const handleConnectMeta = () => {
    setMetaConnected(true);
    toast({
      title: "Connected to Meta",
      description: "Your Meta Ads account is now connected",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="Your Digital Marketing Agency" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" defaultValue="contact@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveGeneral}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-medium">Google Calendar</h3>
                  <p className="text-sm text-gray-500">Connect your Google Calendar to sync appointments</p>
                </div>
                {googleConnected ? (
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="bg-green-100 text-green-800 mb-2">Connected</Badge>
                    <Button variant="outline" size="sm" onClick={() => setGoogleConnected(false)}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnectGoogle}>Connect</Button>
                )}
              </div>
              
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-medium">Meta Ads</h3>
                  <p className="text-sm text-gray-500">Import leads from your Facebook and Instagram ads</p>
                </div>
                {metaConnected ? (
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="bg-green-100 text-green-800 mb-2">Connected</Badge>
                    <Button variant="outline" size="sm" onClick={() => setMetaConnected(false)}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnectMeta}>Connect</Button>
                )}
              </div>
              
              <div className="flex items-start justify-between pb-4">
                <div>
                  <h3 className="text-lg font-medium">SMS Gateway</h3>
                  <p className="text-sm text-gray-500">Connect SMS provider for sending text reminders</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">New Lead Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications when new leads are added</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-gray-500">
                    Send automatic reminders to clients before appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Send SMS notifications to staff for new leads</p>
                </div>
                <Switch />
              </div>
              
              <div className="pt-4">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button>Add User</Button>
              </div>
              
              <div className="border rounded-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">JD</span>
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">john.doe@example.com</p>
                    </div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">JS</span>
                    </div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-500">jane.smith@example.com</p>
                    </div>
                  </div>
                  <Badge variant="outline">User</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
