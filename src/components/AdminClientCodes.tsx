
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientCodeForm from './client-codes/ClientCodeForm';
import ClientCodeList from './client-codes/ClientCodeList';
import { ClientCode, DEFAULT_ACCESS_CODE } from './client-codes/types';

const AdminClientCodes: React.FC = () => {
  const [clientCodes, setClientCodes] = useState<ClientCode[]>([]);
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

  const handleCodeGenerated = (newCode: ClientCode) => {
    setClientCodes([newCode, ...clientCodes]);
  };

  const handleDeleteCode = (id: string) => {
    setClientCodes(clientCodes.filter(code => code.id !== id));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Access Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientCodeForm onCodeGenerated={handleCodeGenerated} />
        <ClientCodeList 
          clientCodes={clientCodes}
          onDeleteCode={handleDeleteCode}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AdminClientCodes;
