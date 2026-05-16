import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isRouteActive = (pathname: string, url: string) => {
  const current = pathname.split("/").filter(Boolean);
  const target = url.split("/").filter(Boolean);

  // Dashboard must match EXACTLY
  if (url === "/admin/dashboard") {
    return pathname === url;
  }

  // Exact match
  if (target.length === current.length) {
    return target.every((seg, i) => seg === current[i]);
  }

  // Section match (products -> products/edit/123)
  return target.length < current.length && target.every((seg, i) => seg === current[i]);
};
