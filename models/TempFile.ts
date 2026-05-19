import mongoose, { Document, Schema } from "mongoose";

export interface ITempFile extends Document {
  key: string;
  url: string;
}

const TempFileSchema: Schema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TempFileSchema.index({ key: 1 });
TempFileSchema.index({ url: 1 });

const TempFile = mongoose.models.TempFile || mongoose.model<ITempFile>("TempFile", TempFileSchema, "temp_files");

export default TempFile;
