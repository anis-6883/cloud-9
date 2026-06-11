import { ORDER_STATUS, PAYMENT_STATUS, REFUND_STATUS } from "@/config/constant";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { Order, UpdateOrderStatusZodSchema } from "@/models/Order";
import { Payment } from "@/models/Payment";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { z } from "zod";

export const PUT = asyncHandler(
  UpdateOrderStatusZodSchema,
  async (req: NextRequest, data: z.infer<typeof UpdateOrderStatusZodSchema>, params: { id: string }) => {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid order ID format!");
    }

    const order = await Order.findById(id);
    if (!order) return apiResponse(false, 404, "Order not found!");

    const updateData: any = { status: data.status };
    if (data.status === ORDER_STATUS.CANCELLED) {
      updateData.cancelledBy = data.cancelledBy;
      updateData.cancellationReason = data.cancellationReason;

      const payment = await Payment.findOne({ order: order._id });

      if (payment) {
        const isBeforeConfirmed = order.status === ORDER_STATUS.PENDING;

        if (isBeforeConfirmed && payment.status === PAYMENT_STATUS.PENDING) {
          payment.status = PAYMENT_STATUS.CANCELLED;
          await payment.save();
        } else if (isBeforeConfirmed && payment.status === PAYMENT_STATUS.PAID) {
          payment.anyRefund = true;
          payment.refundStatus = REFUND_STATUS.PENDING;
          payment.refundAmount = payment.amount;
          await payment.save();
        }
      }
    } else {
      updateData.$unset = { cancelledBy: 1, cancellationReason: 1 }; // set as null
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

    return apiResponse(true, 200, "Order status has been updated successfully!", updatedOrder);
  },
  true
);
