import { OTP_CONFIG } from "@/config/constant";
import { ROLE } from "@/config/constants";
import { GmailMailService } from "@/config/mail";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, generateOtp, generateSignature } from "@/lib/utils";
import { Customer, CustomerRegisterSchema } from "@/models/Customer";
import { Otp } from "@/models/Otp";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import z from "zod";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const mailService = new GmailMailService({
  user: process.env.GMAIL_USER!,
  pass: process.env.GMAIL_APP_PASSWORD!
});

export const POST = asyncHandler(CustomerRegisterSchema, async (_, data: z.infer<typeof CustomerRegisterSchema>) => {
  const { name, email, provider, password, googleIdToken } = data;

  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer?.isEmailVerified) return apiResponse(false, 409, "Customer already exists with this email!");

  // If customer exists but email not verified, delete existing OTPs and customer record to allow fresh registration
  if (existingCustomer && !existingCustomer.isEmailVerified) {
    await Otp.deleteMany({ email });
    await Customer.deleteOne({ _id: existingCustomer._id });
  }

  // Google provider registration
  if (provider === "google") {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleIdToken as string,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) return apiResponse(false, 401, "Invalid Google token!");

    const customer = await Customer.create({
      name: payload.name || name,
      email: payload.email || email,
      provider: "google",
      isEmailVerified: payload.email_verified || false,
      image: payload.picture ? { publicId: "", secureUrl: payload.picture } : undefined
    });

    const token = generateSignature(
      { _id: customer._id, email: customer.email, role: ROLE.CUSTOMER },
      Number(process.env.JWT_ACCESS_TOKEN_TTL) || 86400
    );

    return apiResponse(true, 201, "Customer registered successfully!", { token });
  }

  // Email provider registration
  const hashedPassword = await bcrypt.hash(String(password), 10);

  const customer = await Customer.create({
    name,
    email,
    provider: "email",
    password: hashedPassword,
    isEmailVerified: false
  });

  // Generate OTP, hash it, and store in DB
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({ email, otpHash, purpose: "registration", expiresAt });

  // Send OTP email
  await mailService.sendOtp(email as string, otp, { expiryMinutes: OTP_CONFIG.EXPIRY_MINUTES });

  const token = generateSignature(
    { _id: customer._id, email: customer.email, role: ROLE.CUSTOMER },
    Number(process.env.JWT_ACCESS_TOKEN_TTL) || 86400
  );

  return apiResponse(true, 201, "OTP sent to your email. Please verify to activate your account!");
});
