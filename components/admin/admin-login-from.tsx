"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
    console.log("Submitting admin login form with data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Card className='bg-[#071f2e]/80 backdrop-blur-xl border border-white/10 shadow-xl min-w-100 w-full'>
          <CardHeader>
            <CardTitle className='text-xl text-white text-center'>Admin Login</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            <InputField
              name='email'
              label='Email'
              type='email'
              placeholder='e.g., john@gmail.com'
              inputClassName='bg-[#0b2d3d] text-white border-white/10'
            />

            <InputField
              name='password'
              label='Password'
              type='password'
              placeholder='Password'
              inputClassName='bg-[#0b2d3d] text-white border-white/10'
            />

            {error && <div className='text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2'>{error}</div>}

            <button
              type='submit'
              disabled={isLoading}
              className='
                cursor-pointer
                w-full rounded-xl py-2.5
                bg-[#0b3a4a]
                hover:bg-[#0e4b5f]
                text-white font-semibold
                transition-all
                flex items-center justify-center gap-2
                disabled:opacity-50
              '
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
