// sort by position by given array of ids
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, stringField } from "@/lib/utils";
import { Category } from "@/models/Category";
import { z } from "zod";

const SortZodSchema = z.object({
  ids: z.array(stringField({ required: true }), { error: "Ids must be an array of strings & reqiured!" })
});

export const PATCH = asyncHandler(
  SortZodSchema,
  async (_, data: z.infer<typeof SortZodSchema>) => {
    const { ids } = data;

    if (!ids || ids.length === 0) {
      return apiResponse(false, 400, "No ids provided!");
    }

    // Prepare bulk operations for optimized updates
    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position: index + 1 } }
      }
    }));

    // Execute all updates in a single database call
    await Category.bulkWrite(bulkOps, { ordered: false });

    return apiResponse(true, 200, "Team members sorted successfully!");
  },
  true
);
