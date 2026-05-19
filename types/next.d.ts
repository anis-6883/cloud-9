import { AuthResult } from "@/lib/authenticate";
import "next/server";

declare module "next/server" {
  interface NextRequest {
    user?: AuthResult;
  }
}
