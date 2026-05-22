import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Category } from "@/models/Category";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  const data = await Category.find({}, { name: 1, slug: 1, image: 1 }).sort({ position: "asc" });

  return apiResponse(true, 200, "Categories has been fetched successfully!", data);
});
