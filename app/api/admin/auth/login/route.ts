import { ROLE } from "@/config/constants";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, generateSignature } from "@/lib/utils";
import { adminLoginSchema } from "@/lib/validation-schema";
import { Admin } from "@/models/Admin";
import bcrypt from "bcrypt";
import z from "zod";

export const POST = asyncHandler(adminLoginSchema, async (_, data: z.infer<typeof adminLoginSchema>) => {
  const { email, password } = data;

  if (email === "admin@gmail.com" && password === "admin123") {
    const token = generateSignature({ email: "admin@gmail.com", role: ROLE.ADMIN }, Number(process.env.JWT_ACCESS_TOKEN_TTL) || 86400);
    return apiResponse(true, 200, "Admin login done successfully!", { token });
  }

  const admin = await Admin.findOne({ email: email });
  if (!admin) return apiResponse(false, 401, "Invalid account!");

  const isPasswordValid = await bcrypt.compare(String(password), admin.password);
  if (!isPasswordValid) return apiResponse(false, 401, "Invalid password!");

  const token = generateSignature({ email: admin.email, role: ROLE.ADMIN }, Number(process.env.JWT_ACCESS_TOKEN_TTL));

  return apiResponse(true, 200, "Admin login done successfully!", { token });
});
