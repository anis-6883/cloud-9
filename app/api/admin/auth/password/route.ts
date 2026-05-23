import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Admin, adminPasswordChangeSchema } from "@/models/Admin";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = asyncHandler(
  adminPasswordChangeSchema,
  async (req: NextRequest, data: z.infer<typeof adminPasswordChangeSchema>) => {
    const { oldPassword, newPassword } = data;

    const admin = await Admin.findById(req.user._id);

    const isPasswordValid = await bcrypt.compare(String(oldPassword), admin.password);
    if (!isPasswordValid) return apiResponse(false, 400, "Old password is incorrect!");

    const isSame = await bcrypt.compare(String(newPassword), admin.password);
    if (isSame) return apiResponse(false, 400, "New password cannot be same as old password!");

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);

    await Admin.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword });

    return apiResponse(true, 200, "Admin password updated successfully!");
  },
  true
);
