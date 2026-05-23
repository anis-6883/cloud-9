"use server";

import apiRoutes from "@/config/api-routes";
import apiClient, { ApiResponse } from "@/lib/api-client";

export async function uploadImage(file: File, folder: string): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folderName", folder);

    const res = await apiClient(apiRoutes.publicRoutes.uploadImage, {
      method: "POST",
      body: formData,
      cache: "no-store",
      isFormData: true,
    });

    if (!res?.data) return { status: false, message: res?.message || "Failed to upload image!", data: null, statusCode: 500 };

    return res;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}

export async function uploadMultipleImages(files: File[], folder: string): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folder);

    const res = await apiClient(apiRoutes.publicRoutes.uploadMultipleImages, {
      method: "POST",
      body: formData,
      cache: "no-store",
      isFormData: true,
    });

    if (!res?.data) return { status: false, message: res?.message || "Failed to upload images!", data: null, statusCode: 500 };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload images!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}

export async function deleteImageByKey(key?: string): Promise<ApiResponse> {
  if (!key) return { status: false, message: "Image key is required!", data: null, statusCode: 500 };

  try {
    const res = await apiClient(apiRoutes.publicRoutes.deleteImage, {
      method: "DELETE",
      body: { key },
      cache: "no-store",
    });

    if (!res?.data) return { status: false, message: res?.message || "Failed to delete image!", data: null, statusCode: 500 };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}

export async function deleteImageByURL(url?: string): Promise<ApiResponse> {
  if (!url) return { status: false, message: "Image URL is required!", data: null, statusCode: 500 };

  try {
    const res = await apiClient(apiRoutes.publicRoutes.deleteImageByURL, {
      method: "DELETE",
      body: { url },
      cache: "no-store",
    });
    if (!res?.data) return { status: false, message: res?.message || "Failed to delete image!", data: null, statusCode: 500 };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}

// get total temp images
export async function getTotalTempImages(): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.getTempImagesCount, {
      method: "GET",
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        message: res?.message || "Failed to fetch temp images count!",
        data: null,
        statusCode: 500,
      };
    }

    return res.data; // { totalTempImages }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch temp images count!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}

// delete all temp images
export async function deleteAllTempImages(): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.publicRoutes.deleteAllTempImages, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!res?.data) {
      return {
        status: false,
        message: res?.message || "Failed to delete temp images!",
        data: null,
        statusCode: 500,
      };
    }

    return res.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete temp images!";
    return { status: false, message: errorMessage, data: null, statusCode: 500 };
  }
}
