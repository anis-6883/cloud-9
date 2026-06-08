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
      quantity: number;
      price: number;
      hasDiscount: boolean;
      discountPctAmount: number;
      discountPrice: number;
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
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        hasDiscount: { type: Boolean, default: false },
        discountPctAmount: { type: Number, default: 0 },
        discountPrice: { type: Number, default: 0 }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    cancelledBy: { type: String, enum: Object.values(CANCELLED_BY) },
    cancellationReason: { type: String, trim: true },
    refundStatus: { type: String, enum: Object.values(REFUND_STATUS) }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema, "Orders");

// Order Verify Validation Schema
const OrderVerifySchema = z.object({
  email: stringField({ required: true, isEmail: true }),
  Order: stringField({ required: true, allowNumber: true, minLength: 6, maxLength: 6 })
});

// Export
export { Order, OrderVerifySchema };
export type { IOrder };
