import { getCloudinaryFolderName } from "@/config/cloudinary";
import { clsx, type ClassValue } from "clsx";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { StringFieldOptions } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function extractPublicId(url: string) {
  const mainFolderName = await getCloudinaryFolderName();

  const publicId = url.match(new RegExp(`${mainFolderName}/[^?]+`))?.[0]?.replace(/\.[^/.]+$/, "");
  return publicId;
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

      if (data?.enum && !data.enum.includes(val)) {
        ctx.addIssue({
          code: "custom",
          message: `Value must be one of [${data.enum.join(" | ")}]!`
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

export const extractFormData = <T extends Record<string, unknown> = Record<string, unknown>>(formData: FormData): T => {
  const textData: Record<string, unknown> = {};
  const arrays: Record<string, unknown[]> = {};

  formData.forEach((value, key) => {
    if (!(value instanceof File)) {
      const arrayMatch = key.match(/^(.+)\[(\d+)\]\.?(.*)$/);

      if (arrayMatch) {
        const [, arrayName, index, nestedKey] = arrayMatch;
        const idx = parseInt(index, 10);

        if (!arrays[arrayName]) {
          arrays[arrayName] = [];
        }

        if (nestedKey) {
          if (!arrays[arrayName][idx]) {
            arrays[arrayName][idx] = {};
          }
          (arrays[arrayName][idx] as Record<string, unknown>)[nestedKey] = value;
        } else {
          arrays[arrayName][idx] = value;
        }
      } else {
        textData[key] = value;
      }
    }
  });

  Object.entries(arrays).forEach(([key, value]) => {
    textData[key] = value;
  });

  return textData as T;
};

export function slugify(input: string): string {
  if (!input) return input;

  return input
    .normalize("NFKD") // split accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/[\s_-]+/g, "-") // collapse spaces/underscores to -
    .replace(/^-+|-+$/g, ""); // trim leading/trailing -
}

export const makePaginate = <T>(docs: T[], page: number, limit: number, skip: number, total: number) => {
  const hasNext = total > skip + Number(limit);
  const hasPrev = Number(page) > 1;

  return {
    docs,
    pagination: {
      page: +page,
      limit: +limit,
      totalPage: Math.ceil(total / Number(limit)),
      totalDocs: total,
      hasNext,
      hasPrev
    }
  };
};

export function generateOtp(): string {
  const { randomInt } = require("crypto");
  return String(randomInt(100000, 999999));
}

export const generateSlug = (text: string): string => {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  const suffix = Array.from({ length: 15 }, () => Math.random().toString(36)[2])
    .join("")
    .toUpperCase();

  return `${slug}-${suffix}`;
};
