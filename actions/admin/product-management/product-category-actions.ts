"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function getProductCategories(isActive: boolean = false) {
  const url = isActive
    ? `${apiRoutes.privateRoutes.admin.productManagement.productCategory.get}?status=true`
    : apiRoutes.privateRoutes.admin.productManagement.productCategory.get;

  try {
    const res = await apiClient(url, {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category list!",
      data: []
    };
  }
}

export async function getProductCategoryById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.getById(id), {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get category!",
      data: []
    };
  }
}

export async function createProductCategory(data: any) {
  try {
    const res = await apiClient("/api/admin/category", {
      method: "POST",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create category!",
      data: []
    };
  }
}

export async function updateProductCategory(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.update(id), {
      method: "PUT",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update category!",
      data: []
    };
  }
}

export async function sortProductCategories(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.sort, {
      method: "PATCH",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to sort product categories!",
      data: []
    };
  }
}

export async function deleteProductCategory(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid category ID!");

    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.productCategory.delete(id), {
      method: "DELETE"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete category!",
      data: []
    };
  }
}
