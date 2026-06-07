import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, makePaginate } from "@/lib/utils";
import { Product, ProductZodSchema } from "@/models/Product";
import { NextRequest } from "next/server";
import z from "zod";

// Get all products
export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const skip: number = (Number(page) - 1) * Number(limit);
  const query: Record<string, any> = search
    ? {
        $or: [
          { employeeId: { $regex: new RegExp(search, "i") } },
          { name: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } }
        ],
        softDeleted: false
      }
    : { softDeleted: false };

  let [docs, total] = await Promise.all([
    Product.aggregate([
      {
        $match: query
      },
      {
        $sort: {
          createdAt: -1
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
          updatedAt: 0,
          softDeleted: 0
        }
      }
    ]),
    Product.countDocuments(query)
  ]);

  const data = makePaginate(docs, Number(page), Number(limit), skip, total);

  return apiResponse(true, 200, "Products has been fetched successfully!", data);
}, true);

// Create a product
export const POST = asyncHandler(
  ProductZodSchema,
  async (_, data: z.infer<typeof ProductZodSchema>) => {
    await Product.create(data);

    return apiResponse(true, 201, "Product has been created successfully!");
  },
  true
);
