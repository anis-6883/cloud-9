import { deleteFromCloudinary } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Admin, AdminUpdateZodSchema } from "@/models/Admin";
import TempFile from "@/models/TempFile";
import { NextRequest } from "next/server";
import z from "zod";

// Get admin profile
export const GET = asyncHandler(async (req: NextRequest) => {
  const admin = await Admin.findOne({ _id: req.user?._id }).select("-password -updatedAt");

  return apiResponse(true, 200, "Admin profile fetched successfully!", admin);
}, true);

// Update admin profile
export const PUT = asyncHandler(
  AdminUpdateZodSchema,
  async (req: NextRequest, data: z.infer<typeof AdminUpdateZodSchema>) => {
    if (data?.image?.publicId) {
      const isExist = await TempFile.findOne({ key: data.image.publicId });

      if (isExist) {
        const [admin] = await Promise.all([Admin.findById(req.user._id), TempFile.deleteOne({ key: data.image.publicId })]);

        if (admin?.image?.publicId) await deleteFromCloudinary(admin.image.publicId);
      }
    }

    await Admin.findByIdAndUpdate(req.user._id, data);

    return apiResponse(true, 200, "Admin profile updated successfully!");
  },
  true
);
