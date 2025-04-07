
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Key } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const accessCodeFormSchema = z.object({
  accessCode: z.string().length(6, { message: "Access code must be 6 characters" }),
});

const ClientLogin: React.FC = () => {
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Access code form
  const accessCodeForm = useForm<z.infer<typeof accessCodeFormSchema>>({
    resolver: zodResolver(accessCodeFormSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  const handleLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      localStorage.setItem('userRole', 'client');
      
      toast.success("Login successful", {
        description: "Redirecting to client access...",
      });
      
      navigate('/client-access');
      
    } catch (err) {
      console.error('Login error:', err);
      toast.error("An unexpected error occurred");
    }
  };

  const handleAccessCodeSubmit = async (values: z.infer<typeof accessCodeFormSchema>) => {
    try {
      // Check if code is the default code
      if (values.accessCode === DEFAULT_ACCESS_CODE) {
        // For demo purposes, auto-create a guest account
        const email = `guest_${Date.now()}@example.com`;
        const password = `guest${Date.now()}`;
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'client',
            }
          }
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        localStorage.setItem('userRole', 'client');
        localStorage.setItem('guestLogin', 'true');
        
        toast.success("Access granted", {
          description: "Using default guest access code",
        });
        
        navigate('/client-access');
        return;
      }
      
      // For non-default codes
      const { data, error } = await supabase
        .from('access_codes')
        .select()
        .eq('code', values.accessCode)
        .eq('status', 'unused')
        .single();
      
      if (error || !data) {
        toast.error("Invalid access code", {
          description: "Please check your code and try again",
        });
        return;
      }
      
      // Auto-create a guest account
      const email = `guest_${Date.now()}@example.com`;
      const password = `guest${Date.now()}`;
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'client',
          }
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('guestLogin', 'true');
      
      toast.success("Access granted", {
        description: "Redirecting to client portal...",
      });
      
      navigate('/client-access');
      
    } catch (err) {
      console.error('Access code error:', err);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Client Portal</CardTitle>
          <CardDescription className="text-center">
            Access your client dashboard
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="access-code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="access-code">Access Code</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="access-code">
            <CardContent className="pt-4">
              <Form {...accessCodeForm}>
                <form onSubmit={accessCodeForm.handleSubmit(handleAccessCodeSubmit)} className="space-y-6">
                  <FormField
                    control={accessCodeForm.control}
                    name="accessCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Access Code</FormLabel>
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
                  
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="login">
            <CardContent className="pt-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <Input placeholder="name@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Log in
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account yet?
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/client/register">
              Create Account
            </Link>
          </Button>
          <div className="text-xs text-center text-muted-foreground pt-2">
            <Link to="/admin/login" className="hover:underline">
              Administrator Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientLogin;
