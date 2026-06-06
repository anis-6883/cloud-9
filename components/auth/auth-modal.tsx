"use client";
import { handleCustomerOtpVerify, handleCustomerRegister } from "@/actions/customer/auth-actions";
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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long")
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits")
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

type Mode = "login" | "register" | "otp";

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSuccess, onSwitchMode }: { onSuccess: () => void; onSwitchMode: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    const res = await signIn("customer-credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    });
    setIsLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <CardContent className='space-y-4 pt-4'>
          <InputField name='email' label='Email' type='email' placeholder='e.g., john@gmail.com' inputClassName='bg-white text-black' />
          <InputField name='password' label='Password' type='password' placeholder='Password' inputClassName='bg-white text-black' />
          {error && <div className='p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>{error}</div>}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Processing...
              </>
            ) : (
              "Login"
            )}
          </button>
          <div className='my-4 flex items-center gap-3'>
            <div className='flex-1 h-px bg-border' />
            <span className='text-xs text-muted-foreground'>OR</span>
            <div className='flex-1 h-px bg-border' />
          </div>
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
          <p className='text-center text-sm text-muted-foreground mt-4'>
            Don&apos;t have an account?{" "}
            <button
              type='button'
              onClick={onSwitchMode}
              className='text-accent hover:text-accent/80 font-semibold transition-colors cursor-pointer'
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </form>
    </FormProvider>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess, onSwitchMode }: { onSuccess: (email: string, password: string) => void; onSwitchMode: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    const res = await handleCustomerRegister({
      name: data.fullName,
      email: data.email,
      password: data.password
    });
    setIsLoading(false);
    if (!res.status) {
      setError(res.error || "Registration failed!");
    } else {
      onSuccess(data.email, data.password);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <CardContent className='space-y-4 pt-4'>
          <InputField name='fullName' label='Full Name' type='text' placeholder='Your full name' inputClassName='bg-white text-black' />
          <InputField name='email' label='Email' type='email' placeholder='e.g., john@gmail.com' inputClassName='bg-white text-black' />
          <InputField
            name='password'
            label='Password'
            type='password'
            placeholder='Password (min 8 chars)'
            inputClassName='bg-white text-black'
          />
          {error && <div className='p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>{error}</div>}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Processing...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className='text-center text-sm text-muted-foreground mt-4'>
            Already have an account?{" "}
            <button
              type='button'
              onClick={onSwitchMode}
              className='text-accent hover:text-accent/80 font-semibold transition-colors cursor-pointer'
            >
              Sign in
            </button>
          </p>
        </CardContent>
      </form>
    </FormProvider>
  );
}

// ─── OTP Form ─────────────────────────────────────────────────────────────────
function OtpForm({ email, password, onSuccess, onBack }: { email: string; password: string; onSuccess: () => void; onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setError(null);
    const res = await handleCustomerOtpVerify({ email, otp: data.otp });
    if (!res.status) {
      setIsLoading(false);
      setError(res.error || "Invalid OTP. Please try again.");
      return;
    }
    // OTP verified — auto login
    const loginRes = await signIn("customer-credentials", {
      redirect: false,
      email,
      password
    });
    setIsLoading(false);
    if (loginRes?.error) {
      setError("Verified! Please login manually.");
    } else {
      onSuccess();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <CardContent className='space-y-4 pt-4'>
          <InputField
            name='otp'
            label='OTP Code'
            type='text'
            placeholder='Enter 6-digit OTP'
            inputClassName='bg-white text-black tracking-widest text-center text-lg'
          />
          {error && <div className='p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>{error}</div>}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className='animate-spin' /> Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
          <p className='text-center text-sm text-muted-foreground'>
            Wrong email?{" "}
            <button
              type='button'
              onClick={onBack}
              className='text-accent hover:text-accent/80 font-semibold transition-colors cursor-pointer'
            >
              Go back
            </button>
          </p>
        </CardContent>
      </form>
    </FormProvider>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleRegisterSuccess = (email: string, password: string) => {
    setPendingCredentials({ email, password });
    setMode("otp");
  };

  const handleClose = () => {
    setMode("login");
    setPendingCredentials(null);
    onClose();
  };

  if (!isOpen) return null;

  const title = mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Verify Email";
  const description =
    mode === "login"
      ? "Log in to access your account"
      : mode === "register"
        ? "Sign up to get started"
        : `We sent a 6-digit OTP to ${pendingCredentials?.email}`;

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200' onClick={handleClose} />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'>
        <div className='pointer-events-auto w-full max-w-md px-4'>
          <Card className='relative w-full max-w-md'>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className='absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors z-10 cursor-pointer'
              aria-label='Close modal'
              type='button'
            >
              <X size={20} className='text-foreground' />
            </button>

            {/* Header */}
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-foreground dark:text-black mb-0'>{title}</CardTitle>
              <CardDescription className='text-muted-foreground text-sm'>{description}</CardDescription>
            </CardHeader>

            {/* Body — swap by mode */}
            {mode === "login" && <LoginForm onSuccess={handleClose} onSwitchMode={() => setMode("register")} />}
            {mode === "register" && <RegisterForm onSuccess={handleRegisterSuccess} onSwitchMode={() => setMode("login")} />}
            {mode === "otp" && pendingCredentials && (
              <OtpForm
                email={pendingCredentials.email}
                password={pendingCredentials.password}
                onSuccess={handleClose}
                onBack={() => setMode("register")}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
