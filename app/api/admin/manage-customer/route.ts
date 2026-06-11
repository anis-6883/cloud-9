import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Customer, CustomerZodSchema } from "@/models/Customer";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import z from "zod";

// Get all customers
export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const skip: number = (Number(page) - 1) * Number(limit);
  const query: Record<string, any> = search
    ? {
        $or: [{ name: { $regex: new RegExp(search, "i") } }, { email: { $regex: new RegExp(search, "i") } }],
        softDeleted: false
      }
    : { softDeleted: false };

  const data = await Customer.aggregate([
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
        password: 0,
        updatedAt: 0,
        softDeleted: 0
      }
    }
  ]);

  return apiResponse(true, 200, "Customers has been fetched successfully!", data);
}, true);

// Create a customer
export const POST = asyncHandler(
  CustomerZodSchema,
  async (_, data: z.infer<typeof CustomerZodSchema>) => {
    const emailExist = await Customer.findOne({ email: data.email });
    if (emailExist) return apiResponse(false, 409, "Email already exists!");

    const hashedPassword = await bcrypt.hash(String(data.password), 10);
    await Customer.create({ ...data, password: hashedPassword, isEmailVerified: true });

    return apiResponse(true, 201, "Customer has been created successfully!");
  },
  true
);
