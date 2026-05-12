import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        try {
          const res = await fetch("http://localhost:3000/api/demo-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          const data = await res.json();

          if (!res.ok) {
            return null;
          }

          return data.data;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  pages: {
    // Custom sign-in page if needed, for now we will just use the default or modal
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
});
