import { handleAdminLogin } from "@/actions/admin/auth-actions";
import { handleCustomerLogin } from "@/actions/customer/auth-actions";
import routes from "@/config/routes";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: routes.publicRoutes.adminLogin
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30 // Expire in 30 Days
  },
  callbacks: {
    async jwt(data: any) {
      if (data?.account?.provider === "credentials") {
        if (data?.user) {
          return {
            token: data?.user?.data?.token
          };
        }
      }

      if (data?.trigger === "update") {
        if (data.session) {
          return data.session;
        }
      }

      return data?.token;
    },
    async session({ session, token }) {
      return {
        expires: session.expires,
        ...token
      };
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const formData = new FormData();
          formData.append("email", credentials.email);
          formData.append("password", credentials.password);

          const res = await handleAdminLogin(formData);

          if (res && !res.error && res.token) {
            return {
              data: {
                token: res.token
              }
            } as any;
          }
          return null;
        } catch (error) {
          console.error("Error in Next-Auth authorize:", error);
          return null;
        }
      }
    }),
    CredentialsProvider({
      id: "customer-credentials",
      name: "Customer Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const formData = new FormData();
          formData.append("email", credentials.email);
          formData.append("password", credentials.password);
          formData.append("provider", "email");

          const res = await handleCustomerLogin(formData);

          if (res && !res.error && res.token) {
            return {
              data: {
                token: res.token
              }
            } as any;
          }
          return null;
        } catch (error) {
          console.error("Error in Customer Next-Auth authorize:", error);
          return null;
        }
      }
    })
  ]
};
