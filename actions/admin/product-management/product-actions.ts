"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function getProducts(page: number = 1, limit: number = 10) {
  try {
    const url = `${apiRoutes.privateRoutes.admin.productManagement.product.get}?page=${page}&limit=${limit}`;
    const res = await apiClient(url, {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product list!",
      data: { docs: [], pagination: {} }
    };
  }
}

export async function getProductById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.product.getById(id), {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get product!",
      data: null
    };
  }
}

export async function createProduct(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.product.create, {
      method: "POST",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create product!",
      data: null
    };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.product.update(id), {
      method: "PUT",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update product!",
      data: null
    };
  }
}

export async function deleteProduct(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid product ID!");
    const res = await apiClient(apiRoutes.privateRoutes.admin.productManagement.product.delete(id), {
      method: "DELETE"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete product!",
      data: null
    };
  }
}
