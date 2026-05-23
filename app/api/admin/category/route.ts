import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, slugify } from "@/lib/utils";
import { Category, CategoryZodSchema } from "@/models/Category";
import { NextRequest } from "next/server";
import z from "zod";

// Get all categories
export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || "";

  const query: Record<string, any> = search
    ? {
        $or: [{ name: { $regex: new RegExp(search, "i") } }],
        softDeleted: false
      }
    : { softDeleted: false };

  const data = await Category.aggregate([
    {
      $match: query
    },
    {
      $sort: {
        position: 1
      }
    },
    {
      $project: {
        position: 0,
        updatedAt: 0,
        softDeleted: 0
      }
    }
  ]);

  return apiResponse(true, 200, "Categories has been fetched successfully!", data);
}, true);

// Create a category
export const POST = asyncHandler(
  CategoryZodSchema,
  async (_, data: z.infer<typeof CategoryZodSchema>) => {
    const slugExist = await Category.findOne({ slug: slugify(data.slug as string) });
    if (slugExist) return apiResponse(false, 409, "Slug already exists!");

    await Category.create({ ...data, slug: slugify(data.slug as string) });

    return apiResponse(true, 201, "Category has been created successfully!");
  },
  true
);
