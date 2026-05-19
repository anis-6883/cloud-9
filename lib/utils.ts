import { clsx, type ClassValue } from "clsx";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { StringFieldOptions } from "./types";

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

export function apiResponse<T = undefined>(status: boolean, statusCode: number = 200, message: string, data?: T, pagination?: T) {
  return NextResponse.json(
    {
      status,
      message,
      data,
      pagination
    },
    { status: statusCode }
  );
}

export function generateSignature<T extends object>(payload: T, expiresIn: number) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn });
}

export const stringField = (data: StringFieldOptions = {}) => {
  let schema: z.ZodTypeAny = z
    .string("Value must be a string!")
    .trim()
    .superRefine((val, ctx) => {
      if (data?.required && !val && val.trim() !== "") {
        ctx.addIssue({
          code: "custom",
          message: "Required!"
        });
      }

      if (!isNaN(Number(val)) && !data?.allowNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Provide a valid string!"
        });
      }

      if (data?.isEmail && !z.email().safeParse(val).success) {
        ctx.addIssue({
          code: "custom",
          message: "Provide a valid email!"
        });
      }

      if (data?.minLength && val.length < data.minLength) {
        ctx.addIssue({
          code: "custom",
          message: `Minimum ${data.minLength} characters required!`
        });
      }

      if (data?.maxLength && val.length > data.maxLength) {
        ctx.addIssue({
          code: "custom",
          message: `Maximum ${data.maxLength} characters required!`
        });
      }

      if (data?.isUrl && !z.url().safeParse(val).success) {
        ctx.addIssue({
          code: "custom",
          message: "Provide a valid URL!"
        });
      }
    });

  if (!data?.required) {
    schema = schema.optional();
  }

  return schema;
};

export type NestedRoutes = string | { [key: string]: NestedRoutes | ((...args: any[]) => string) };

export function extractRoutes(obj: NestedRoutes): string[] {
  const links: string[] = [];

  for (const value of Object.values(obj as Record<string, NestedRoutes>)) {
    if (typeof value === "string") {
      links.push(value);
    } else if (typeof value === "function") {
      // skip functions because we cannot statically extract dynamic route
      continue;
    } else if (typeof value === "object" && value !== null) {
      links.push(...extractRoutes(value));
    }
  }

  return links;
}
