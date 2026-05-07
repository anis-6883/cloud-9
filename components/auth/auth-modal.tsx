"use client";

import { Loader2, Lock, Mail, User as UserIcon, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "register" && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (mode === "login") {
      try {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (result?.error) {
          setErrors({ email: "Invalid credentials. Please try again." });
          setIsLoading(false);
          return;
        }

        // Successful login
        setIsLoading(false);
        setFormData({ fullName: "", email: "", password: "" });
        setErrors({});
        onClose();
        // Option to refresh page or push state
        window.location.reload();
      } catch (error) {
        setErrors({ email: "An error occurred during sign in." });
        setIsLoading(false);
      }
    } else {
      // Simulate Register API call since credentials provider doesn't do sign-up automatically
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset form
      setIsLoading(false);
      setFormData({ fullName: "", email: "", password: "" });
      setErrors({});
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
      setIsLoading(true);
      await signIn("google");
      // Note: this will redirect to Google immediately.
      // If you want to handle the error before redirect (less common with OAuth),
      // you would set redirect: false, but NextAuth handles OAuth redirects.
    };

    const isFormValid = mode === "register" && formData.fullName.trim() && formData.email.trim() && formData.password.trim();

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in' onClick={onClose} />

        {/* Modal */}
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in'>
          <div className='bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 w-full max-w-md relative'>
            {/* Close Button */}
            <button onClick={onClose} className='absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors z-10'>
              <X size={20} className='text-foreground' />
            </button>

            {/* Content */}
            <div className='p-8'>
              {/* Title */}
              <h2 className='text-2xl font-bold text-foreground mb-2'>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
              <p className='text-muted-foreground text-sm mb-6'>
                {mode === "login" ? "Log in to access your account" : "Sign up to get started"}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Full Name (Register only) */}
                {mode === "register" && (
                  <div>
                    <label htmlFor='fullName' className='sr-only'>
                      Full Name
                    </label>
                    <div className='relative'>
                      <UserIcon size={18} className='absolute left-3 top-3 text-muted-foreground' />
                      <input
                        id='fullName'
                        type='text'
                        name='fullName'
                        placeholder='Full Name'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 bg-secondary border rounded-xl outline-none transition-all ${
                          errors.fullName
                            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                        } text-foreground placeholder-muted-foreground`}
                      />
                    </div>
                    {errors.fullName && <p className='text-red-400 text-xs mt-1'>{errors.fullName}</p>}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor='email' className='sr-only'>
                    Email
                  </label>
                  <div className='relative'>
                    <Mail size={18} className='absolute left-3 top-3 text-muted-foreground' />
                    <input
                      id='email'
                      type='email'
                      name='email'
                      placeholder='Email address'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-secondary border rounded-xl outline-none transition-all ${
                        errors.email
                          ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                      } text-foreground placeholder-muted-foreground`}
                    />
                  </div>
                  {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className='flex items-center justify-between mb-1'>
                    <label htmlFor='password' className='sr-only'>
                      Password
                    </label>
                    {mode === "login" && (
                      <button type='button' className='text-xs text-accent hover:text-accent/80 transition-colors'>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className='relative'>
                    <Lock size={18} className='absolute left-3 top-3 text-muted-foreground' />
                    <input
                      id='password'
                      type='password'
                      name='password'
                      placeholder='Password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-secondary border rounded-xl outline-none transition-all ${
                        errors.password
                          ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-border focus:border-accent focus:ring-2 focus:ring-accent/20"
                      } text-foreground placeholder-muted-foreground`}
                    />
                  </div>
                  {errors.password && <p className='text-red-400 text-xs mt-1'>{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={!isFormValid || isLoading}
                  className='w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2'
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
              </form>

              {/* Divider (Login only) */}
              {mode === "login" && (
                <div className='my-6 flex items-center gap-3'>
                  <div className='flex-1 h-px bg-border' />
                  <span className='text-xs text-muted-foreground'>OR</span>
                  <div className='flex-1 h-px bg-border' />
                </div>
              )}

              {/* Google Login (Login only) */}
              {mode === "login" && (
                <button
                  type='button'
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className='w-full bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-foreground font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-border'
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className='animate-spin' />
                    </>
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

              {/* Footer Link */}
              <p className='text-center text-sm text-muted-foreground mt-6'>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type='button'
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setFormData({ fullName: "", email: "", password: "" });
                    setErrors({});
                  }}
                  className='text-accent hover:text-accent/80 font-semibold transition-colors'
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
}
