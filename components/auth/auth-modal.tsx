"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import InputField from "../ui/form/input-feild";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Zod schemas for login and register
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long")
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic schema based on mode
  const currentSchema = mode === "login" ? loginSchema : registerSchema;

  const methods = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: mode === "login" ? { email: "", password: "" } : { fullName: "", email: "", password: "" }
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      setIsLoading(true);
      setErrors({});

      if (mode === "login") {
        const loginData = data as LoginFormData;

        const res = await signIn("credentials", {
          redirect: false,
          email: loginData.email,
          password: loginData.password
        });

        if (res?.error) {
          setErrors({ general: "Invalid email or password" });
        } else {
          onClose(); // modal close
        }
      } else {
        const registerData = data as RegisterFormData;
        console.log("Register:", registerData);
        //register API here
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  const handleModeChange = () => {
    setMode(mode === "login" ? "register" : "login");
    methods.reset();
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200' onClick={onClose} />

      {/* Modal Container */}
      <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'>
        <div className='pointer-events-auto w-full max-w-md px-4'>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Card className='relative w-full max-w-md'>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className='absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors z-10 cursor-pointer'
                  aria-label='Close modal'
                  type='button'
                >
                  <X size={20} className='text-foreground' />
                </button>

                {/* Header */}
                <CardHeader>
                  <CardTitle className='text-2xl font-bold text-foreground dark:text-black mb-0'>
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <CardDescription className='text-muted-foreground text-sm'>
                    {mode === "login" ? "Log in to access your account" : "Sign up to get started"}
                  </CardDescription>
                </CardHeader>

                {/* Form Content */}
                <CardContent className='space-y-4'>
                  {/* Full Name Field (Register only) */}
                  {mode === "register" && (
                    <InputField
                      name='fullName'
                      label='Full Name'
                      type='text'
                      placeholder='Your full name'
                      inputClassName='bg-white text-black'
                    />
                  )}

                  {/* Email Field */}
                  <InputField
                    name='email'
                    label='Email'
                    type='email'
                    placeholder='e.g., john@gmail.com'
                    prefixIconClassName='text-black'
                    inputClassName='bg-white text-black'
                  />

                  {/* Password Field */}
                  <InputField
                    name='password'
                    label='Password'
                    type='password'
                    placeholder='Password'
                    inputClassName='bg-white text-black'
                  />

                  {/* Error Message */}
                  {errors.general && (
                    <div className='p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>
                      {errors.general}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className='animate-spin' />
                        Processing...
                      </>
                    ) : mode === "login" ? (
                      "Login"
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  {/* Divider (Login only) */}
                  {mode === "login" && (
                    <div className='my-6 flex items-center gap-3'>
                      <div className='flex-1 h-px bg-border' />
                      <span className='text-xs text-muted-foreground'>OR</span>
                      <div className='flex-1 h-px bg-border' />
                    </div>
                  )}

                  {/* Google Login Button (Login only) */}
                  {mode === "login" && (
                    <button
                      type='button'
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className='w-full bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-border cursor-pointer'
                    >
                      {isLoading ? (
                        <Loader2 size={18} className='animate-spin' />
                      ) : (
                        <>
                          <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                            <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                            <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                            <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </button>
                  )}

                  {/* Toggle Mode Link */}
                  <p className='text-center text-sm text-muted-foreground mt-6 cursor-pointer'>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type='button'
                      onClick={handleModeChange}
                      className='text-accent hover:text-accent/80 font-semibold transition-colors cursor-pointer'
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </CardContent>
              </Card>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
