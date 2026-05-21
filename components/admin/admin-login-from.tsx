"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Utensils } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import InputField from "../ui/form/input-feild";

const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (res?.error) {
        setError("Invalid email or password!");
      } else if (res?.ok) {
        window.location.href = "/admin/dashboard";
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Card className=' backdrop-blur-xl border border-white/10 shadow-xl min-w-100 w-full'>
          <CardHeader className='space-y-3 pb-1'>
            {/* Logo Section */}
            <div className='flex justify-center'>
              {/* Reddish/Rose gradient matching Cloud 9's accents */}
              <div className='w-12 h-12 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center shadow-md shadow-rose-500/20 transform rotate-6 hover:rotate-0 transition-transform duration-300'>
                <span className='text-white font-bold transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer'>
                  <Utensils size={22} />
                </span>
              </div>
            </div>

            {/* Text Section */}
            <div className='space-y-1 text-center'>
              <CardTitle className='text-2xl font-bold tracking-tight text-slate-800'>Admin Login</CardTitle>
              <p className='text-sm text-slate-500 font-medium'>Welcome back! Please enter your credentials to access the panel.</p>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <InputField
              className='bg-white'
              name='email'
              label='Email'
              type='email'
              placeholder='admin@gmail.com'
              inputClassName='bg-transparent'
            />

            <InputField name='password' label='Password' type='password' placeholder='admin123' inputClassName='bg-transparent' />

            <div className='text-xs text-slate-400 font-medium text-center -mt-1 pb-1'>
              Demo Access: <span className='text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.5 rounded'>admin@gmail.com</span> / <span className='text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.5 rounded'>admin123</span>
            </div>

            {error && <div className='text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2'>{error}</div>}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin' size={18} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
