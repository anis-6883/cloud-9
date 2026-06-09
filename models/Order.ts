import { CANCELLED_BY, ORDER_STATUS, REFUND_STATUS } from "@/config/constant";
import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema, Types } from "mongoose";
import z from "zod";

// Order Interface
interface IOrder extends Document {
  customer: Types.ObjectId;
  items: [
    {
      product: Types.ObjectId;
      name: string;
      image: {
        publicId: string;
        secureUrl: string;
      };
      quantity: number;
      finalPrice: number;
      hasDiscount: boolean;
      discountPctAmount: number;
    }
  ];
  totalAmount: number;
  status: ORDER_STATUS;
  cancelledBy?: CANCELLED_BY;
  cancellationReason?: string;
  refundStatus?: REFUND_STATUS;
}

// Order Model
const OrderSchema: Schema = new mongoose.Schema(
  {
    customer: { type: Types.ObjectId, ref: "Customer", required: true },
    items: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: {
          publicId: { type: String, trim: true, required: true },
          secureUrl: { type: String, trim: true, required: true }
        },
        quantity: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
        hasDiscount: { type: Boolean, default: false },
        discountPctAmount: { type: Number, default: 0 }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    cancelledBy: { type: String, enum: Object.values(CANCELLED_BY) },
    cancellationReason: { type: String, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema, "orders");

// Checkout Schema
const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: stringField({ required: true, minLength: 24 }),
        quantity: z
          .number("quantity must be a number!")
          .int("quantity must be an integer!")
          .min(1, "quantity must be at least 1")
          .max(10, "quantity must be at most 10")
      })
    )
    .min(1, "items must contain at least one product")
    .nonempty()
});

// Export
export { CheckoutSchema, Order };
export type { IOrder };
