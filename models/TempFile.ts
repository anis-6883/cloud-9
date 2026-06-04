import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

export interface ITempFile extends Document {
  key: string;
  url: string;
}

const TempFileSchema: Schema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

TempFileSchema.index({ key: 1 });
TempFileSchema.index({ url: 1 });

const TempFile = mongoose.models.TempFile || mongoose.model<ITempFile>("TempFile", TempFileSchema, "temp_files");

const uploadFileSchema = z.object({
  folderName: z.string().trim().optional()
});

const imgDeleteSchema = z
  .object({
    url: z.string().trim()
  })
  .superRefine((data, ctx) => {
    if (!data.url) {
      ctx.addIssue({
        code: "custom",
        message: "Required!",
        path: ["url"]
      });
    }
  });

export { imgDeleteSchema, TempFile, uploadFileSchema };
