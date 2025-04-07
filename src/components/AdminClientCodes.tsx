
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PlusCircle, Copy, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ClientCode {
  id: string;
  code: string;
  client_name: string;
  created_at: string;
  status: 'unused' | 'active';
}

const DEFAULT_ACCESS_CODE = '123456';

const AdminClientCodes: React.FC = () => {
  const [clientCodes, setClientCodes] = useState<ClientCode[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load client codes from Supabase and check if default code exists
  useEffect(() => {
    const fetchClientCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('access_codes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setClientCodes(data || []);
        
        // Check if default code exists
        const defaultCodeExists = data?.some(code => code.code === DEFAULT_ACCESS_CODE);
        
        // If default code doesn't exist, create it
        if (!defaultCodeExists) {
          createDefaultCode();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client codes:', error);
        toast.error('Failed to load access codes');
        setIsLoading(false);
      }
    };
    
    fetchClientCodes();
  }, []);
  
  const createDefaultCode = async () => {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .insert({
          code: DEFAULT_ACCESS_CODE,
          client_name: 'Default Client',
          status: 'unused'
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        setClientCodes(prevCodes => [data[0], ...prevCodes]);
        toast.success('Default access code created', {
          description: `Code: ${DEFAULT_ACCESS_CODE}`
        });
      }
    } catch (error) {
      console.error('Error creating default code:', error);
      toast.error('Failed to create default access code');
    }
  };
  
  const generateRandomCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const handleGenerateCode = async () => {
    if (!newClientName.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    
    const newCode = generateRandomCode();
    
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .insert({
          code: newCode,
          client_name: newClientName,
          status: 'unused'
        })
        .select();
      
      if (error) throw error;
      
      setClientCodes([data[0], ...clientCodes]);
      setNewClientName('');
      
      toast.success('Access code generated', {
        description: `Code for ${newClientName}: ${newCode}`
      });
    } catch (error) {
      console.error('Error generating access code:', error);
      toast.error('Failed to generate access code');
    }
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };
  
  const handleDeleteCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClientCodes(clientCodes.filter(code => code.id !== id));
      toast.success('Access code deleted');
    } catch (error) {
      console.error('Error deleting access code:', error);
      toast.error('Failed to delete access code');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Access Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <label htmlFor="clientName" className="text-sm font-medium">
                Client Name
              </label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerateCode}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Code
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : clientCodes.length > 0 ? (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 items-center border-b bg-muted/50 px-4 py-3 text-sm font-medium">
              <div className="col-span-3">Client</div>
              <div className="col-span-3">Access Code</div>
              <div className="col-span-3">Created</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {clientCodes.map((clientCode) => (
              <div
                key={clientCode.id}
                className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0"
              >
                <div className="col-span-3 font-medium">
                  {clientCode.client_name}
                </div>
                <div className="col-span-3">
                  <code className="rounded bg-muted px-2 py-1">
                    {clientCode.code}
                  </code>
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {new Date(clientCode.created_at).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      clientCode.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {clientCode.status === 'active' ? 'Active' : 'Unused'}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyCode(clientCode.code)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCode(clientCode.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">No client codes generated yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminClientCodes;
