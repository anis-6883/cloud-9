import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      email?: string;
      token?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface Session extends DefaultSession {
    user?: DefaultSession["user"] | null;
    token?: string;
    expires?: number | string;
  }

  interface User extends DefaultUser {
    token?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    email?: string;
    role?: string;
    exp?: number;
  }
}
