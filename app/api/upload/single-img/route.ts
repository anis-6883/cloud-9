import { deleteFromCloudinary, getCloudinaryFolderName, uploadToCloudinary } from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse, extractPublicId } from "@/lib/utils";
import { imgDeleteSchema, TempFile, uploadFileSchema } from "@/models/TempFile";
import { NextRequest } from "next/server";
import z from "zod";

// Upload single image file in cloudinary
export const POST = asyncFormDataHandler(
  uploadFileSchema,
  async (req: NextRequest, data: z.infer<typeof uploadFileSchema>, formData: FormData) => {
    const { valid, error } = fileValidator(formData.get("image") as File, {
      required: true
    });

    if (!valid) return apiResponse(false, 400, error!);

    const mainFolderName = await getCloudinaryFolderName();
    const folderName = `${mainFolderName}/${data.folderName ?? "default"}`;

    // Upload to cloudinary
    const { public_id, secure_url } = await uploadToCloudinary(formData.get("image") as File, {
      folder: folderName
    });

    // Save temp file in database
    TempFile.create({
      key: public_id,
      url: secure_url
    }).catch(error => {
      console.error("Failed to save temp file in database:", error);
    });

    return apiResponse(true, 200, "File has been uploaded successfully!", {
      publicId: public_id,
      secureUrl: secure_url
    });
  }
);

// Delete single image file from cloudinary
export const DELETE = asyncHandler(imgDeleteSchema, async (_, data: z.infer<typeof imgDeleteSchema>) => {
  const { url } = data;

  const publicId = await extractPublicId(String(url));
  if (!publicId) return apiResponse(false, 400, "Invalid image key!");

  const { result }: { result: string } = await deleteFromCloudinary(publicId);
  if (result !== "ok") return apiResponse(false, 400, "Failed to delete file from cloudinary!");

  return apiResponse(true, 200, "File has been deleted successfully!");
});
