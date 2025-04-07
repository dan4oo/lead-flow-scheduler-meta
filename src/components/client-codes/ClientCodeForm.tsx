
import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCode } from './types';

interface ClientCodeFormProps {
  onCodeGenerated: (newCode: ClientCode) => void;
}

const ClientCodeForm: React.FC<ClientCodeFormProps> = ({ onCodeGenerated }) => {
  const [newClientName, setNewClientName] = useState('');

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
      
      if (data && data[0]) {
        onCodeGenerated(data[0]);
        setNewClientName('');
        
        toast.success('Access code generated', {
          description: `Code for ${newClientName}: ${newCode}`
        });
      }
    } catch (error) {
      console.error('Error generating access code:', error);
      toast.error('Failed to generate access code');
    }
  };

  return (
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
  );
};

export default ClientCodeForm;
