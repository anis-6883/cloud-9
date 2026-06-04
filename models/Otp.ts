import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

// OTP Interface
interface IOtp extends Document {
  email: string;
  otpHash: string;
  purpose: "registration" | "password_reset";
  attempts: number;
  expiresAt: Date;
}

// OTP Model
const OtpSchema: Schema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, required: true, enum: ["registration", "password_reset"], default: "registration" },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL index: MongoDB auto-deletes when expiresAt is reached
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema, "otps");

// OTP Verify Validation Schema
const OtpVerifySchema = z.object({
  email: stringField({ required: true, isEmail: true }),
  otp: stringField({ required: true, allowNumber: true, minLength: 6, maxLength: 6 })
});

// Export
export { Otp, OtpVerifySchema };
export type { IOtp };
