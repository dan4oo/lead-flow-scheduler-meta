
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

// Mock access codes - in a real app, these would be stored in a database
const VALID_ACCESS_CODES = ["123456", "654321", "111222"];

const formSchema = z.object({
  accessCode: z.string().length(6, {
    message: "Access code must be 6 characters.",
  }),
});

const ClientAccessCode: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (VALID_ACCESS_CODES.includes(values.accessCode)) {
      // Store access code in localStorage for session management
      localStorage.setItem("clientAccessCode", values.accessCode);
      localStorage.setItem("clientAuthenticated", "true");
      
      toast.success("Access code verified", {
        description: "Redirecting to account setup...",
      });
      
      // Navigate to account connection page
      navigate("/client-connect");
    } else {
      toast.error("Invalid access code", {
        description: "Please check your code and try again.",
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
