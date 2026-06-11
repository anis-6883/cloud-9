"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function uploadImage(file: File, folder: string) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folderName", folder);

    const res = await apiClient(apiRoutes.publicRoutes.uploadImage, {
      method: "POST",
      body: formData,
      cache: "no-store",
      isFormData: true
    });

    if (!res?.data) return { status: false, error: res?.error || "Failed to upload image!" };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload image!";
    return { status: false, error: errorMessage };
  }
}

export async function uploadMultipleImages(files: File[], folder: string) {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("folder", folder);

    const res = await apiClient(apiRoutes.publicRoutes.uploadMultipleImages, {
      method: "POST",
      body: formData,
      cache: "no-store",
      isFormData: true
    });

    if (!res?.data) return { status: false, error: res?.error || "Failed to upload images!" };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload images!";
    return { status: false, error: errorMessage };
  }
}

export async function deleteImageByKey(key?: string) {
  if (!key) return { status: false, error: "Image key is required!" };

  try {
    const res = await apiClient(apiRoutes.publicRoutes.deleteImage, {
      method: "DELETE",
      body: { key },
      cache: "no-store"
    });

    if (!res?.data) return { status: false, error: res?.error || "Failed to delete image!" };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image!";
    return { status: false, error: errorMessage };
  }
}

export async function deleteImageByURL(url?: string) {
  if (!url) return { status: false, error: "Image URL is required!" };

  try {
    const res = await apiClient(apiRoutes.publicRoutes.deleteImageByURL, {
      method: "DELETE",
      body: { url },
      cache: "no-store"
    });

    if (!res?.data) return { status: false, error: res?.error || "Failed to delete image!" };

    return res?.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete image!";
    return { status: false, error: errorMessage };
  }
}
