import { OTP_CONFIG } from "@/config/constant";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Customer } from "@/models/Customer";
import { Otp, OtpVerifySchema } from "@/models/Otp";
import bcrypt from "bcrypt";
import z from "zod";

export const POST = asyncHandler(OtpVerifySchema, async (_, data: z.infer<typeof OtpVerifySchema>) => {
  const { email, otp } = data;

  // Find the latest OTP record for this email
  const otpRecord = await Otp.findOne({ email, purpose: "registration" }).sort({ createdAt: -1 });
  if (!otpRecord) return apiResponse(false, 400, "OTP expired or not found!");

  // Check attempt limit
  if (otpRecord.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: otpRecord._id });
    return apiResponse(false, 429, "Too many attempts. Please request a new OTP.");
  }

  // Verify OTP hash
  const isMatch = await bcrypt.compare(otp as string, otpRecord.otpHash);

  if (!isMatch) {
    // Increment attempts
    await Otp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
    const remaining = OTP_CONFIG.MAX_ATTEMPTS - otpRecord.attempts - 1;
    return apiResponse(false, 400, `Invalid OTP! ${remaining} attempt(s) remaining.`);
  }

  // OTP is valid — mark email as verified
  const customer = await Customer.findOneAndUpdate({ email }, { isEmailVerified: true }, { new: true });

  if (!customer) {
    return apiResponse(false, 404, "Customer not found!");
  }

  // Delete all OTP records for this email + purpose (one-time use)
  await Otp.deleteMany({ email, purpose: "registration" });

  return apiResponse(true, 200, "Email verified successfully!");
});
