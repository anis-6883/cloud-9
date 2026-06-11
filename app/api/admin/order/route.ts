import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, makePaginate } from "@/lib/utils";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

// Get all orders with pagination and search
export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const skip: number = (Number(page) - 1) * Number(limit);
  const query: Record<string, any> = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    const isObjectId = mongoose.Types.ObjectId.isValid(search);

    // Find customers whose name or email matches the search query
    const customers = await Customer.find({
      $or: [{ name: { $regex: new RegExp(search, "i") } }, { email: { $regex: new RegExp(search, "i") } }]
    }).select("_id");
    const customerIds = customers.map(c => c._id);

    const searchConditions: any[] = [
      { status: { $regex: new RegExp(search, "i") } },
      { customer: { $in: customerIds } },
      { "items.name": { $regex: new RegExp(search, "i") } }
    ];

    if (isObjectId) {
      searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    query.$or = searchConditions;
  }

  const [docs, total] = await Promise.all([
    Order.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true
        }
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
          items: 1,
          totalAmount: 1,
          status: 1,
          cancelledBy: 1,
          cancellationReason: 1,
          createdAt: 1,
          updatedAt: 1,
          customer: {
            $cond: {
              if: "$customer",
              then: {
                _id: "$customer._id",
                name: "$customer.name",
                email: "$customer.email",
                image: "$customer.image",
                phone: "$customer.phone",
                dialCode: "$customer.dialCode"
              },
              else: null
            }
          }
        }
      }
    ]),
    Order.countDocuments(query)
  ]);

  const data = makePaginate(docs, Number(page), Number(limit), skip, total);

  return apiResponse(true, 200, "Orders have been fetched successfully!", data);
}, true);
