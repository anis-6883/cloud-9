import routes from "@/config/routes";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

type NestedRoutes = string | { [key: string]: NestedRoutes | ((...args: any[]) => string) };

function extractRoutes(obj: NestedRoutes): string[] {
  const links: string[] = [];

  for (const value of Object.values(obj as Record<string, NestedRoutes>)) {
    if (typeof value === "string") {
      links.push(value);
    } else if (typeof value === "function") {
      continue;
    } else if (typeof value === "object" && value !== null) {
      links.push(...extractRoutes(value));
    }
  }

  return links;
}

function isAdminRoute(pathname: string): boolean {
  const adminRoutes = extractRoutes(routes.privateRoutes.admin);
  return adminRoutes.some((route: string) => pathname.startsWith(route));
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    const isAdmin = isAdminRoute(pathname);

    if (isAdmin && !token) {
      return NextResponse.redirect(new URL(routes.publicRoutes.home, req.url));
    }

    if (pathname.startsWith(routes.publicRoutes.adminLogin) && token) {
      return NextResponse.redirect(new URL(routes.privateRoutes.admin.dashboard, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true
    }
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|fonts|default|$).*)"]
};
