
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import { DEFAULT_ACCESS_CODE } from "./client-codes/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  accessCode: z.string().length(6, {
    message: "Access code must be 6 characters.",
  }),
});

const ClientAccessCode: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  // Check if client has already verified their access code
  useEffect(() => {
    const checkClientVerification = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('client_verifications')
        .select('is_verified')
        .eq('user_id', user.id)
        .single();
      
      if (data?.is_verified) {
        // Client is already verified, redirect to connection page
        navigate('/client-connect');
      }
    };
    
    checkClientVerification();
  }, [user, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      // Check if code is the default code or exists in the database
      if (values.accessCode === DEFAULT_ACCESS_CODE) {
        // For default code, check if it exists in the database
        const { data: defaultCode, error: defaultCodeError } = await supabase
          .from('access_codes')
          .select('*')
          .eq('code', DEFAULT_ACCESS_CODE)
          .single();
        
        let codeStatus = 'unused';
        let codeId;
        
        if (defaultCodeError && defaultCodeError.code !== 'PGRST116') {
          // If error is not "no rows returned", then it's a different error
          console.error('Error checking default code:', defaultCodeError);
          toast.error("An error occurred while verifying access code");
          return;
        }
        
        // If default code doesn't exist in database, create it
        if (!defaultCode) {
          const { data: newDefaultCode, error: createError } = await supabase
            .from('access_codes')
            .insert({
              code: DEFAULT_ACCESS_CODE,
              client_name: 'Default Client',
              status: 'unused'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating default code:', createError);
            toast.error("Failed to create default access code");
            return;
          }
          
          codeId = newDefaultCode.id;
        } else {
          codeId = defaultCode.id;
          codeStatus = defaultCode.status;
          
          // Check if code is already used
          if (codeStatus === 'active' && defaultCode.used_by !== user.id) {
            toast.error("Access code already used");
            return;
          }
        }
        
        // Record that this client has verified their access using default code
        const { error: verificationError } = await supabase
          .from('client_verifications')
          .upsert({
            user_id: user.id,
            is_verified: true,
            access_code_id: codeId
          });
        
        if (verificationError) {
          console.error('Error saving verification:', verificationError);
          toast.error("Failed to save verification");
          return;
        }
        
        // Update the default code status only after verification is successful
        if (codeStatus === 'unused') {
          await supabase
            .from('access_codes')
            .update({ status: 'active', used_by: user.id })
            .eq('id', codeId);
        }
        
        toast.success("Default access code accepted", {
          description: "Redirecting to account setup...",
        });
        
        // Navigate to account connection page
        navigate("/client-connect");
        return;
      }
      
      // For non-default codes, check if code exists and is valid
      const { data: codeData, error: codeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', values.accessCode)
        .eq('status', 'unused')
        .single();
      
      if (codeError || !codeData) {
        toast.error("Invalid or used access code", {
          description: "Please check your code and try again.",
        });
        return;
      }
      
      // Record that this client has verified their access
      const { error: verificationError } = await supabase
        .from('client_verifications')
        .upsert({
          user_id: user.id,
          is_verified: true,
          access_code_id: codeData.id
        });
      
      if (verificationError) {
        console.error('Error saving verification:', verificationError);
        toast.error("Failed to save verification");
        return;
      }
      
      // Update the access code status only after verification is successful
      const { error: updateError } = await supabase
        .from('access_codes')
        .update({ status: 'active', used_by: user.id })
        .eq('id', codeData.id);
      
      if (updateError) {
        console.error('Error updating access code:', updateError);
        toast.error("Failed to update access code status");
        return;
      }
      
      toast.success("Access code verified", {
        description: "Redirecting to account setup...",
      });
      
      // Navigate to account connection page
      navigate("/client-connect");
      
    } catch (error) {
      console.error('Error verifying access code:', error);
      toast.error("An error occurred", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Client Access</h1>
          <p className="text-gray-500">
            Enter the access code provided by your account manager.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Hint: Try default code: {DEFAULT_ACCESS_CODE})
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify Access Code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ClientAccessCode;
