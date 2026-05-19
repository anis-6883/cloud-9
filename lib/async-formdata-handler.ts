import dbConnect from "@/config/database";
import { JsonWebTokenError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticate } from "./authenticate";
import { apiResponse, extractFormData } from "./utils";

export type FormDataApiHandler<T, P = Record<string, string>> = (
  req: NextRequest,
  data: T,
  formData: FormData,
  params: P
) => Promise<NextResponse>;

export function asyncFormDataHandler<T, P = Record<string, string>>(
  schema: z.ZodSchema<T> | null,
  handler: FormDataApiHandler<T, P>,
  checkAuth: boolean = false
): (req: NextRequest, context: { params: Promise<P> }) => Promise<NextResponse> {
  return async (req: NextRequest, context: { params: Promise<P> }) => {
    try {
      await dbConnect();

      if (checkAuth) {
        const { error, data } = await authenticate(req);
        if (error) return error;
        req.user = data;
      }

      // Await params from context
      const params = await context.params;

      // Parse FormData
      const formData = await req.formData();

      let validatedData: T;

      if (schema) {
        // Extract text fields for validation
        const textData = extractFormData<Record<string, unknown>>(formData);

        // Validate text data with Zod schema
        validatedData = schema.parse(textData);
      } else {
        // If no schema, pass empty object as validated data
        validatedData = {} as T;
      }

      // Pass params to handler
      return await handler(req, validatedData, formData, params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.issues.reduce(
          (acc, issue) => {
            const field = issue.path.join(".") || "general";
            acc[field] = issue.message;
            return acc;
          },
          {} as Record<string, string>
        );

        return apiResponse(false, 400, "Request validation failed!", details);
      }

      if (error instanceof JsonWebTokenError) {
        return apiResponse(false, 401, "Unauthorized Token!");
      }
      return apiResponse(false, 500, "Something went wrong!");
    }
  };
}
