import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Mock authorization: Replace with actual database lookup
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password123"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          };
        }
        // If validation fails, return null
        return null;
      },
    }),
  ],
  pages: {
    // Custom sign-in page if needed, for now we will just use the default or modal
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise false
      return !!auth;
    },
  },
});
