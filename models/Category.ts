import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

export interface ICategory extends Document {
  name: string;
  image: {
    publicId: string;
    secureUrl: string;
  };
  slug: string;
  position: number;
  status: boolean;
  softDeleted: boolean;
}

const CategorySchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    image: {
      publicId: { type: String, trim: true },
      secureUrl: { type: String, trim: true }
    },
    position: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    softDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema, "categories");

// Validation Schema
const CategoryZodSchema = z.object({
  name: stringField({ required: true }),
  slug: stringField({ required: true }),
  image: z
    .object({
      publicId: stringField({ required: false }),
      secureUrl: stringField({ required: false })
    })
    .optional(),
  status: z.boolean().optional()
});

// Update Schema
const CategoryUpdateZodSchema = CategoryZodSchema.partial();

// Export
export { Category, CategoryUpdateZodSchema, CategoryZodSchema };
