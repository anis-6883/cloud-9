import { PAYMENT_METHOD_TYPE, PAYMENT_STATUS, REFUND_STATUS } from "@/config/constant";
import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema, Types } from "mongoose";
import z from "zod";

// Payment Interface
export interface IPayment extends Document {
  order: Types.ObjectId;
  amount: number;
  method: PAYMENT_METHOD_TYPE;
  status: PAYMENT_STATUS;
  transactionId?: string;
  paidAt?: Date;

  anyRefund?: boolean;
  refundStatus?: REFUND_STATUS;
  refundAmount?: number;
  refundedAt?: Date;
}

// Payment Model
const PaymentSchema: Schema = new mongoose.Schema(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: Object.values(PAYMENT_METHOD_TYPE), required: true },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    transactionId: { type: String, trim: true },
    paidAt: { type: Date },
    anyRefund: { type: Boolean, default: false },
    refundStatus: { type: String, enum: Object.values(REFUND_STATUS) },
    refundAmount: { type: Number, default: 0 },
    refundedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema, "payments");

// Payment Verify Validation Schema (used for generic payment confirmation workflows)
// Note: kept minimal and aligned with OrderVerifySchema style.
const PaymentVerifySchema = z.object({
  transactionId: stringField({ required: true, allowNumber: true, minLength: 6 }),
  orderId: stringField({ required: true, allowNumber: true, minLength: 6, maxLength: 24 })
});

// Export
export { Payment, PaymentVerifySchema };
