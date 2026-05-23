"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient, { ApiResponse } from "@/lib/api-client";
import { updateTag } from "next/cache";

export async function getAdminProfile(): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.profile, {
      method: "GET",
      tags: [cacheTags.adminProfile],
    });

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to get admin profile",
      data: null,
      statusCode: 500,
    };
  }
}

export async function updateAdminPassword(data: any): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.changePassword, {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to update admin password",
      data: null,
      statusCode: 500,
    };
  }
}

export async function updateAdminProfile(data: any): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.profile, {
      method: "PUT",
      body: data,
      cache: "no-store",
    });

    if (res?.data) {
      updateTag(cacheTags.adminProfile);
    }

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to update admin profile",
      data: null,
      statusCode: 500,
    };
  }
}
