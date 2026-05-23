import { deleteMultipleFromCloudinary } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { TempFile } from "@/models/TempFile";

// Get total temp images
export const GET = asyncHandler(async () => {
  const totalTempImages = await TempFile.countDocuments();

  return apiResponse(true, 200, `Total temp images fetched successfully!`, { totalTempImages });
});

// Delete all temp images from cloudinary
export const DELETE = asyncHandler(async () => {
  const tempImages = await TempFile.find().select("key");
  const publicIds = tempImages.map(file => file.key);

  if (publicIds.length === 0) return apiResponse(false, 400, "No temp images found!");

  const [result] = await Promise.all([deleteMultipleFromCloudinary(publicIds), TempFile.deleteMany({ key: { $in: publicIds } })]);
  const deletedCount = Object.values(result.deleted).filter(value => value === "deleted").length;

  return apiResponse(true, 200, `${deletedCount}/${publicIds.length} Temp images has been deleted successfully!`);
});
