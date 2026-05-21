"use server";

import apiRoutes from "@/config/api-routes";
import { cacheTags } from "@/config/constant";
import apiClient from "@/lib/api-client";
import { GetFilters } from "@/lib/types";
import { updateTag } from "next/cache";

export async function getBrands(filters: GetFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  const url = `${apiRoutes.privateRoutes.admin.productManagement.brand.get}${query ? `?${query}` : ""}`;

  try {
    const res = await apiClient(url, {
      method: "GET",
      tags: [cacheTags.productBrands],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get brand list!",
      data: [],
    };
  }
}

export async function getBrandById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.brand.getById(id), {
      method: "GET",
      tags: [cacheTags.productBrands, `product-brand-${id}`],
      cache: "force-cache",
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get brand!",
      data: [],
    };
  }
}

export async function createBrand(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.brand.create, {
      method: "POST",
      body: data,
    });

    if (res?.data) updateTag(cacheTags.productBrands);

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create brand!",
      data: [],
    };
  }
}

export async function updateBrand(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.brand.update(id), {
      method: "PUT",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productBrands);
      updateTag(`product-brand-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update brand!",
      data: [],
    };
  }
}

export async function deleteBrand(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid category ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.brand.delete(id), {
      method: "DELETE",
    });

    if (res?.data) {
      updateTag(cacheTags.productBrands);
      updateTag(`product-brand-${id}`);
    }

    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete brand!",
      data: [],
    };
  }
}

export async function sortBrands(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.brand.sort, {
      method: "PATCH",
      body: data,
    });

    if (res?.data) {
      updateTag(cacheTags.productBrands);
    }

    return res;
  } catch (error) {
    console.log("Error 2:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to shorts product brands",
      data: [],
    };
  }
}
