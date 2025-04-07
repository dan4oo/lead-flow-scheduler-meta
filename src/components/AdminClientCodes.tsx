
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle, Copy, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ClientCode {
  id: string;
  code: string;
  clientName: string;
  created: Date;
  status: 'unused' | 'active';
}

const AdminClientCodes: React.FC = () => {
  const [clientCodes, setClientCodes] = useState<ClientCode[]>([
    {
      id: '1',
      code: '123456',
      clientName: 'Acme Corporation',
      created: new Date('2023-10-15'),
      status: 'active'
    },
    {
      id: '2',
      code: '654321',
      clientName: 'Beta Industries',
      created: new Date('2023-11-01'),
      status: 'unused'
    }
  ]);
  
  const [newClientName, setNewClientName] = useState('');
  
  const generateRandomCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const handleGenerateCode = () => {
    if (!newClientName.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    
    const newCode = generateRandomCode();
    const newClientCode: ClientCode = {
      id: Date.now().toString(),
      code: newCode,
      clientName: newClientName,
      created: new Date(),
      status: 'unused'
    };
    
    setClientCodes([...clientCodes, newClientCode]);
    setNewClientName('');
    
    toast.success('Access code generated', {
      description: `Code for ${newClientName}: ${newCode}`
    });
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };
  
  const handleDeleteCode = (id: string) => {
    setClientCodes(clientCodes.filter(code => code.id !== id));
    toast.success('Access code deleted');
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
        
        {clientCodes.length > 0 ? (
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
                  {clientCode.clientName}
                </div>
                <div className="col-span-3">
                  <code className="rounded bg-muted px-2 py-1">
                    {clientCode.code}
                  </code>
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {clientCode.created.toLocaleDateString()}
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
