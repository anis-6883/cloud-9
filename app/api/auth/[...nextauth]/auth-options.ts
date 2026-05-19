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
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // Call your backend API here instead of parsing JSON
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        const data = await res.json();

        if (!res.ok || !data) return null; // Invalid credentials

        return data; // Must include { token, email, name } or whatever you need
      }
    })
  ]
};
