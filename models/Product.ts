import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

// Product Interface
interface IProduct extends Document {
  name: string;
  image: {
    publicId: string;
    secureUrl: string;
  };
  shortDesc: string;
  price: number;
  hasDiscount: boolean;
  discountPctAmount: number;
  discountPrice: number;
  status: boolean;
  softDeleted: boolean;
}

// Product Model Schema
const ProductSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: {
      publicId: { type: String, trim: true, required: true },
      secureUrl: { type: String, trim: true, required: true }
    },
    shortDesc: { type: String, trim: true, required: true },
    price: { type: Number, required: true },
    hasDiscount: { type: Boolean, default: false },
    discountPctAmount: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    softDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema, "products");

// Product Create Validation Schema
const ProductZodSchema = z.object({
  name: stringField({ required: true }),
  image: z.object(
    {
      publicId: stringField({ required: true }),
      secureUrl: stringField({ required: true })
    },
    {
      error: "Value must be an object and must contain publicId and secureUrl!"
    }
  ),
  shortDesc: stringField({ required: true }),
  price: z.number("price must be a number!").min(0, "price must be greater than or equal to 0!"),
  hasDiscount: z.boolean().optional(),
  discountPctAmount: z
    .number("discountPctAmount must be a number!")
    .min(0, "discountPctAmount must be greater than or equal to 0!")
    .max(100, "discountPctAmount must be less than or equal to 100!")
    .optional(),
  discountPrice: z.number("discountPrice must be a number!").min(0, "discountPrice must be greater than or equal to 0!").optional(),
  status: z.boolean().optional()
});

// Product Update Validation Schema
const ProductUpdateZodSchema = ProductZodSchema.partial();

// Export
export { Product, ProductUpdateZodSchema, ProductZodSchema };
export type { IProduct };
