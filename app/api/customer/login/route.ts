import { ROLE } from "@/config/constants";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, generateSignature } from "@/lib/utils";
import { Customer, CustomerLoginSchema } from "@/models/Customer";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import z from "zod";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const POST = asyncHandler(CustomerLoginSchema, async (_, data: z.infer<typeof CustomerLoginSchema>) => {
  const { email, provider, password, googleIdToken } = data;

  // Google provider login
  if (provider === "google") {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleIdToken as string,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) return apiResponse(false, 401, "Invalid Google token!");

    const customer = await Customer.findOne({ email: payload.email, provider: "google" });
    if (!customer) return apiResponse(false, 404, "Customer not found with this Google account!");

    const token = generateSignature({ _id: customer._id, role: ROLE.CUSTOMER }, Number(process.env.JWT_ACCESS_TOKEN_TTL) || 86400);

    return apiResponse(true, 200, "Customer logged in successfully!", { token });
  }

  // Email provider login
  const customer = await Customer.findOne({ email, provider: "email" });
  if (!customer) return apiResponse(false, 404, "Customer not found with this email!");

  const isPasswordValid = await bcrypt.compare(String(password), customer.password);
  if (!isPasswordValid) return apiResponse(false, 401, "Invalid password!");

  const token = generateSignature({ _id: customer._id, role: ROLE.CUSTOMER }, Number(process.env.JWT_ACCESS_TOKEN_TTL) || 86400);

  return apiResponse(true, 200, "Customer logged in successfully!", { token });
});
