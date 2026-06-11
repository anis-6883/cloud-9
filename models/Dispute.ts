import { DISPUTE_REASON, DISPUTE_STATUS } from "@/config/constant";
import { stringField } from "@/lib/utils";
import mongoose, { Document, Schema, Types } from "mongoose";
import z from "zod";

// Dispute Interface
export interface IDispute extends Document {
  order: Types.ObjectId;
  customer: Types.ObjectId;
  reason: DISPUTE_REASON;
  description: string;
  evidenceImage?: {
    publicId: string;
    secureUrl: string;
  }[];
  status: DISPUTE_STATUS;
  resolution?: "none" | "refund" | "replacement" | "store_credit";
  refundAmount?: number;
  resolvedAt?: Date;
}

// Dispute Model
const DisputeSchema: Schema = new mongoose.Schema(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    customer: { type: Types.ObjectId, ref: "Customer", required: true },

    reason: { type: String, enum: Object.values(DISPUTE_REASON), required: true },
    description: { type: String, required: true, trim: true },
    evidenceImage: [
      {
        publicId: { type: String, trim: true },
        secureUrl: { type: String, trim: true }
      }
    ],

    status: { type: String, enum: Object.values(DISPUTE_STATUS), default: DISPUTE_STATUS.OPENED },

    resolution: {
      type: String,
      enum: ["none", "refund", "replacement", "store_credit"],
      default: "none"
    },

    refundAmount: { type: Number, default: 0 },
    resolvedAt: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Dispute = mongoose.models.Dispute || mongoose.model<IDispute>("Dispute", DisputeSchema, "disputes");

// Dispute Verify Validation Schema
const DisputeVerifySchema = z.object({
  orderId: stringField({ required: true, allowNumber: true, minLength: 6, maxLength: 24 }),
  customerId: stringField({ required: true, allowNumber: true, minLength: 6, maxLength: 24 })
});

export { Dispute, DisputeVerifySchema };
