import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

// Customer Interface
interface ICustomer extends Document {
  name: string;
  email: string;
  provider: "email" | "google" | "facebook" | "apple";
  password?: string;
  isEmailVerified?: boolean;
  image?: {
    publicId: string;
    secureUrl: string;
  };
  dialCode?: string;
  phone?: string;
  dob?: Date;
  status?: boolean;
  softDeleted?: boolean;
}

// Customer Model
const CustomerSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true, enum: ["email", "google", "facebook", "apple"] },
    password: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    image: {
      publicId: { type: String, trim: true },
      secureUrl: { type: String, trim: true }
    },
    dialCode: { type: String, trim: true },
    phone: { type: String, trim: true },
    dob: { type: Date },
    status: { type: Boolean, default: true },
    softDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

CustomerSchema.index({ email: 1 }, { unique: true });

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema, "customers");

// Customer Base Object Schema (without refinements, allows .pick()/.partial())
const CustomerZodBaseSchema = z.object({
  name: stringField({ required: true }),
  email: stringField({ required: true, isEmail: true }),
  provider: stringField({ required: true, enum: ["email", "google"] }),
  password: stringField({ allowNumber: true }),
  image: z
    .object({
      publicId: stringField(),
      secureUrl: stringField()
    })
    .optional(),
  dialCode: stringField({ allowNumber: true }),
  phone: stringField({ allowNumber: true }),
  dob: stringField(),
  status: z.boolean().optional()
});

// Customer Validation Schema (with refinements)
const CustomerZodSchema = CustomerZodBaseSchema.superRefine((data, ctx) => {
  if (data.provider === "email" && !data.password) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password is required when provider is email!"
    });
  }
});

// Customer Update Validation Schema (derived from base, no refinements)
const CustomerUpdateZodSchema = CustomerZodBaseSchema.partial();

// Customer Register Validation Schema
const CustomerRegisterSchema = CustomerZodBaseSchema.pick({ name: true, email: true, provider: true, password: true })
  .extend({ googleIdToken: stringField() })
  .superRefine((data, ctx: z.RefinementCtx) => {
    if (data.provider === "google" && !data.googleIdToken) {
      ctx.addIssue({
        code: "custom",
        path: ["googleIdToken"],
        message: "Google ID token is required when provider is google!"
      });
    }
  });

// Customer Login Validation Schema
const CustomerLoginSchema = CustomerZodBaseSchema.pick({ email: true, provider: true, password: true })
  .extend({ googleIdToken: stringField() })
  .superRefine((data, ctx) => {
    if (data.provider === "google" && !data.googleIdToken) {
      ctx.addIssue({
        code: "custom",
        path: ["googleIdToken"],
        message: "Google ID token is required when provider is google!"
      });
    }
  });

// Export
export { Customer, CustomerLoginSchema, CustomerRegisterSchema, CustomerUpdateZodSchema, CustomerZodSchema };
export type { ICustomer };
