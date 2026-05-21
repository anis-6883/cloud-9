import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, makePaginate, slugify } from "@/lib/utils";
import { Category, CategoryZodSchema } from "@/models/Category";
import { NextRequest } from "next/server";
import z from "zod";

// Get all categories
export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const skip: number = (Number(page) - 1) * Number(limit);

  const query: Record<string, any> = search
    ? {
        $or: [{ name: { $regex: new RegExp(search, "i") } }],
        softDeleted: false
      }
    : { softDeleted: false };

  let [docs, total] = await Promise.all([
    Category.aggregate([
      {
        $match: query
      },
      {
        $sort: {
          position: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      },
      {
        $project: {
          position: 0,
          updatedAt: 0,
          softDeleted: 0
        }
      }
    ]),
    Category.countDocuments(query)
  ]);

  const data = makePaginate(docs, Number(page), Number(limit), skip, total);

  return apiResponse(true, 200, "Categories has been fetched successfully!", data);
}, true);

// Create a category
export const POST = asyncHandler(
  CategoryZodSchema,
  async (_, data: z.infer<typeof CategoryZodSchema>) => {
    const slugExist = await Category.findOne({ slug: slugify(data.slug as string) });
    if (slugExist) return apiResponse(false, 400, "Slug already exists!");

    await Category.create({ ...data, slug: slugify(data.slug as string) });

    return apiResponse(true, 200, "Category has been created successfully!");
  },
  true
);
