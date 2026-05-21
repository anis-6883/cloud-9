"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient, { type ApiResponse } from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

// ---------------- GET ----------------
export async function getTeamMembers(filters: GetFilters = {}): Promise<ApiResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.teamMember.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.manageTeamMember],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to get team member list!",
      data: null,
      statusCode: 500,
    };
  }
}

// ---------------- GET BY ID ----------------
export async function getTeamMemberById(id: string): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.teamMember.getById(id), {
      method: "GET",
      tags: [`${cacheTags.manageTeamMember}-${id}`],
      cache: "force-cache",
    });

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to get team member!",
      data: null,
      statusCode: 500,
    };
  }
}

// ---------------- CREATE ----------------
export async function createTeamMember(data: any): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.teamMember.create, {
      method: "POST",
      body: data,
    });

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to create team member!",
      data: null,
      statusCode: 500,
    };
  }
}

// ---------------- UPDATE ----------------
export async function updateTeamMember(id: string, data: any): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.teamMember.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.manageTeamMember);
      updateTag(`${cacheTags.manageTeamMember}-${id}`);
    }

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to update team member!",
      data: null,
      statusCode: 500,
    };
  }
}

// ---------------- DELETE ----------------
export async function deleteTeamMember(id: string): Promise<ApiResponse> {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.teamMember.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.manageTeamMember);
    }

    return res;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Failed to delete team member!",
      data: null,
      statusCode: 500,
    };
  }
}
