
import React from 'react';
import { toast } from 'sonner';
import { Copy, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ClientCode } from './types';

interface ClientCodeListProps {
  clientCodes: ClientCode[];
  onDeleteCode: (id: string) => void;
  isLoading: boolean;
}

const ClientCodeList: React.FC<ClientCodeListProps> = ({ 
  clientCodes, 
  onDeleteCode, 
  isLoading 
}) => {
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
      
      onDeleteCode(id);
      toast.success('Access code deleted');
    } catch (error) {
      console.error('Error deleting access code:', error);
      toast.error('Failed to delete access code');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (clientCodes.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No client codes generated yet</p>
      </div>
    );
  }

  return (
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
  );
};

export default ClientCodeList;
