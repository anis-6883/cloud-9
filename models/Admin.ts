import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  dialCode: string;
  phone: string;
}

const AdminSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    image: { type: String, trim: true },
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

// Validation Schema
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

// Update Schema
const AdminUpdateZodSchema = AdminZodSchema.partial();

// Export
export { Admin, AdminUpdateZodSchema, AdminZodSchema };
export type { IAdmin };
