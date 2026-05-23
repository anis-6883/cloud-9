import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

// Admin Model Interface
interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image: {
    publicId: string;
    secureUrl: string;
  };
  dialCode: string;
  phone: string;
}

// Admin Model Schema
const AdminSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    image: {
      publicId: { type: String, trim: true },
      secureUrl: { type: String, trim: true }
    },
    dialCode: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

AdminSchema.index({ email: 1 }, { unique: true });

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema, "admins");

// Admin Create Validation Schema
const AdminZodSchema = z.object({
  name: stringField({ required: true }),
  email: stringField({ required: true }),
  password: stringField({ required: true }),
  image: z
    .object({
      publicId: stringField(),
      secureUrl: stringField()
    })
    .optional(),
  dialCode: stringField({ allowNumber: true }),
  phone: stringField({ allowNumber: true })
});

// Admin Update Validation Schema
const AdminUpdateZodSchema = AdminZodSchema.partial();

// Admin Login Validation Schema
const adminLoginSchema = z.object({
  email: stringField({ required: true, isEmail: true }),
  password: stringField({ required: true, allowNumber: true })
});

// Admin Password Change Validation Schema
const adminPasswordChangeSchema = z
  .object({
    oldPassword: stringField({ required: true, allowNumber: true }),
    newPassword: stringField({ required: true, minLength: 6, allowNumber: true }),
    confirmPassword: stringField({ required: true, allowNumber: true })
  })
  .refine(data => data.newPassword !== data.oldPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"]
  });

// Export
export { Admin, adminLoginSchema, adminPasswordChangeSchema, AdminUpdateZodSchema, AdminZodSchema };
export type { IAdmin };
