"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function handleAdminLogin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { status: false, error: "Email and password are required!" };
    }

    const res = await apiClient(apiRoutes.publicRoutes.adminSignIn, {
      method: "POST",
      body: { email, password },
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        error: res?.message || "Invalid credentials!",
      };
    }

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred!";
    return { status: false, error: errorMessage };
  }
}
