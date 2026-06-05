import { deleteFromCloudinary } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Product, ProductUpdateZodSchema } from "@/models/Product";
import { TempFile } from "@/models/TempFile";
import { NextRequest } from "next/server";
import { z } from "zod";

// Get a product
export const GET = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingProduct = await Product.findById(id, { updatedAt: 0, softDeleted: 0 });
  if (!existingProduct) return apiResponse(false, 404, "Product not found!");

  return apiResponse(true, 200, "Product fetched successfully!", existingProduct);
}, true);

// Update a product
export const PUT = asyncHandler(
  ProductUpdateZodSchema,
  async (req: NextRequest, data: z.infer<typeof ProductUpdateZodSchema>, params: { id: string }) => {
    const { id } = params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) return apiResponse(false, 404, "Product not found!");

    await Product.findByIdAndUpdate(id, { ...data }, { new: true });

    // Delete old image if new image is uploaded
    if (data.image?.publicId && data.image.publicId !== existingProduct.image.publicId) {
      await TempFile.deleteOne({ key: data.image.publicId });

      if (existingProduct?.image?.publicId) await deleteFromCloudinary(existingProduct.image.publicId);
    }

    return apiResponse(true, 200, "Product has been updated successfully!");
  },
  true
);

// Delete a product
export const DELETE = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingProduct = await Product.findById(id);
  if (!existingProduct) return apiResponse(false, 404, "Product not found!");

  await Product.findByIdAndUpdate(id, { softDeleted: true });

  return apiResponse(true, 200, "Product has been deleted successfully!");
}, true);
