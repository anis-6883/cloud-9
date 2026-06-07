import { deleteFromCloudinary } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Customer, CustomerUpdateZodSchema } from "@/models/Customer";
import { TempFile } from "@/models/TempFile";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";

// Get a customer
export const GET = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingCustomer = await Customer.findById(id, { password: 0, updatedAt: 0, softDeleted: 0 });
  if (!existingCustomer) return apiResponse(false, 404, "Customer not found!");

  return apiResponse(true, 200, "Customer fetched successfully!", existingCustomer);
}, true);

// Update a customer
export const PUT = asyncHandler(
  CustomerUpdateZodSchema,
  async (req: NextRequest, data: z.infer<typeof CustomerUpdateZodSchema>, params: { id: string }) => {
    const { id } = params;
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) return apiResponse(false, 404, "Customer not found!");

    if (data?.password) {
      const hashedPassword = await bcrypt.hash(String(data.password), 10);
      data.password = hashedPassword;
    }

    await Customer.findByIdAndUpdate(id, { ...data }, { new: true });

    // Delete old image if new image is uploaded
    if (data.image?.publicId && data.image.publicId !== existingCustomer.image?.publicId) {
      await TempFile.deleteOne({ key: data.image.publicId });

      if (existingCustomer?.image?.publicId) await deleteFromCloudinary(existingCustomer.image.publicId);
    }

    return apiResponse(true, 200, "Customer has been updated successfully!");
  },
  true
);

// Delete a customer
export const DELETE = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const existingCustomer = await Customer.findById(id);
  if (!existingCustomer) return apiResponse(false, 404, "Customer not found!");

  await Customer.findByIdAndUpdate(id, { softDeleted: true });

  return apiResponse(true, 200, "Customer has been deleted successfully!");
}, true);
