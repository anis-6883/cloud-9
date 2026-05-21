import { deleteFromCloudinary } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, slugify } from "@/lib/utils";
import { Category, CategoryUpdateZodSchema } from "@/models/Category";
import TempFile from "@/models/TempFile";
import { NextRequest } from "next/server";
import { z } from "zod";

// Get a category
export const GET = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingCategory = await Category.findById(id, { position: 0, updatedAt: 0, softDeleted: 0 });
  if (!existingCategory) return apiResponse(false, 404, "Category not found!");

  return apiResponse(true, 200, "Category fetched successfully!", existingCategory);
}, true);

// Update a category
export const PUT = asyncHandler(
  CategoryUpdateZodSchema,
  async (req: NextRequest, data: z.infer<typeof CategoryUpdateZodSchema>, params: { id: string }) => {
    const { id } = params;
    const existingCategory = await Category.findById(id);
    if (!existingCategory) return apiResponse(false, 404, "Category not found!");

    if (existingCategory.slug === slugify(data?.slug as string)) return apiResponse(false, 400, "Slug already exists!");

    await Category.findByIdAndUpdate(id, { ...data }, { new: true });

    // Delete old image if new image is uploaded
    if (data.image?.publicId && data.image.publicId !== existingCategory.image.publicId) {
      await TempFile.deleteOne({ key: data.image.publicId });

      if (existingCategory?.image?.publicId) await deleteFromCloudinary(existingCategory.image.publicId);
    }

    return apiResponse(true, 200, "Category has been updated successfully!");
  },
  true
);

// Delete a category
export const DELETE = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingCategory = await Category.findById(id);
  if (!existingCategory) return apiResponse(false, 404, "Category not found!");

  await Category.findByIdAndUpdate(id, { softDeleted: true });

  return apiResponse(true, 200, "Category has been deleted successfully!");
}, true);
