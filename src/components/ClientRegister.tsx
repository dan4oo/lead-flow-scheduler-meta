
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Key } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm your password" }),
  accessCode: z.string().length(6, { message: "Access code must be 6 characters" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ClientRegister: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      accessCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Check if access code exists and is unused
      const { data: accessCode, error: accessCodeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', values.accessCode)
        .eq('status', 'unused')
        .single();

      if (accessCodeError || !accessCode) {
        if (values.accessCode === DEFAULT_ACCESS_CODE) {
          // Special handling for default code
          const { data: defaultCode } = await supabase
            .from('access_codes')
            .select('*')
            .eq('code', DEFAULT_ACCESS_CODE)
            .eq('status', 'unused')
            .single();

          if (!defaultCode) {
            toast.error("Access code already used");
            return;
          }
        } else {
          toast.error("Invalid or used access code");
          return;
        }
      }

      // Register the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: 'client',
          }
        }
      });

      if (signUpError) {
        toast.error("Registration failed", {
          description: signUpError.message,
        });
        return;
      }

      // Mark the access code as used
      await supabase
        .from('access_codes')
        .update({ 
          status: 'active',
          used_by: values.email 
        })
        .eq('code', values.accessCode);

      toast.success("Registration successful", {
        description: "Please log in with your credentials",
      });
      
      navigate('/client/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register with your access code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Input placeholder="name@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Input type="password" placeholder="Create password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Input type="password" placeholder="Confirm password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Code</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Input placeholder="Enter 6-digit code" {...field} />
                      </div>
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-1">
                      Try the demo code: {DEFAULT_ACCESS_CODE}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6">
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/client/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientRegister;
