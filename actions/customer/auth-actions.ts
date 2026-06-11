"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function handleCustomerLogin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { status: false, error: "Email and password are required!" };
    }

    const res = await apiClient(apiRoutes.publicRoutes.customerSignIn, {
      method: "POST",
      body: { email, password, provider: "email" },
      cache: "no-store"
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.message || "Invalid credentials!"
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function handleCustomerRegister(data: { name: string; email: string; password: string }) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.customerRegister, {
      method: "POST",
      body: { ...data, provider: "email" },
      cache: "no-store"
    });

    if (!res?.status) {
      return {
        status: false,
        error: res?.message || "Registration failed!"
      };
    }

    return { status: true, message: res.message };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}

export async function handleCustomerOtpVerify(data: { email: string; otp: string }) {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.customerOtpVerify, {
      method: "POST",
      body: data,
      cache: "no-store"
    });

    if (!res?.status) {
      return {
        status: false,
        error: res?.message || "OTP verification failed!"
      };
    }

    return { status: true, message: res.message };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}
