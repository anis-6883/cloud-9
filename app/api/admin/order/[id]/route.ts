import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

// Get a single order with related customer and payment details
export const GET = asyncHandler(async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid order ID format!");
  }

  const orderId = new mongoose.Types.ObjectId(id);

  const orderData = await Order.aggregate([
    {
      $match: { _id: orderId }
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
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "order",
        as: "payment"
      }
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true
      }
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
        },
        payment: {
          $cond: {
            if: "$payment",
            then: {
              _id: "$payment._id",
              method: "$payment.method",
              status: "$payment.status",
              transactionId: "$payment.transactionId",
              paidAt: "$payment.paidAt",
              amount: "$payment.amount",
              anyRefund: "$payment.anyRefund",
              refundStatus: "$payment.refundStatus",
              refundAmount: "$payment.refundAmount",
              refundedAt: "$payment.refundedAt",
              refundReason: "$payment.refundReason"
            },
            else: null
          }
        }
      }
    }
  ]);

  if (!orderData || orderData.length === 0) {
    return apiResponse(false, 404, "Order not found!");
  }

  return apiResponse(true, 200, "Order fetched successfully!", orderData[0]);
}, true);
