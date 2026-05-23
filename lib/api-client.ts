import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";

type FetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  tags?: string[];
  cache?: RequestCache;
  isFormData?: boolean;
  revalidate?: number | false;
  credentials?: RequestCredentials;
};

export type ApiResponse<TData = any> = { data: TData | null; status: boolean; message: string; statusCode: number };

async function apiClient<TResponse = any, TBody = undefined>(
  url: string,
  options: FetchOptions<TBody> = {}
): Promise<ApiResponse<TResponse>> {
  const { method = "GET", body, isFormData = false, credentials } = options;

  try {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.token;

    const baseURL = process.env.NEXTAUTH_URL!;

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData && body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseURL}${url}`, {
      method,
      headers,
      body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
      credentials: credentials || "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        data: data?.data || null,
        status: false,
        message: data?.message || "Something went wrong",
        statusCode: res.status,
      };
    }

    return {
      data: data?.data || null,
      status: true,
      message: data?.message || "Success",
      statusCode: res.status,
    };
  } catch (error: any) {
    return {
      data: null,
      status: false,
      message: error.message || "Unexpected error",
      statusCode: 500,
    };
  }
}

export default apiClient;
