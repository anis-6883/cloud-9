import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  dialCode: string;
  phone: string;
  role: string;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    image: { type: String, trim: true },
    dialCode: { type: String, trim: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

// Validation Schema
const UserZodSchema = z.object({
  name: stringField({ required: true }),
  email: stringField({ required: true }),
  password: stringField({ required: true }),
  image: z
    .object({
      publicId: stringField(),
      secureUrl: stringField(),
    })
    .optional(),
  dialCode: stringField({ allowNumber: true }),
  phone: stringField({ allowNumber: true }),
  role: z.enum(["admin", "user"]),
});

// Update Schema
const UserUpdateZodSchema = UserZodSchema.partial();

// Export
export { User, UserUpdateZodSchema, UserZodSchema };
export type { IUser };
