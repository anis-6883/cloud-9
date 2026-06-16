"use server";

import apiRoutes from "@/config/api-routes";
import apiClient from "@/lib/api-client";

export async function getCustomers() {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.manageCustomer.get, {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer list!",
      data: []
    };
  }
}

export async function getCustomerById(id: string) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.manageCustomer.getById(id), {
      method: "GET",
      cache: "no-store"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to get customer!",
      data: null
    };
  }
}

export async function createCustomer(data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.manageCustomer.create, {
      method: "POST",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create customer!",
      data: null
    };
  }
}

export async function updateCustomer(id: string, data: any) {
  try {
    const res = await apiClient(apiRoutes.privateRoutes.admin.manageCustomer.update(id), {
      method: "PUT",
      body: data
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update customer!",
      data: null
    };
  }
}

export async function deleteCustomer(id: string | undefined) {
  try {
    if (!id) throw new Error("Invalid customer ID!");
    const res = await apiClient(apiRoutes.privateRoutes.admin.manageCustomer.delete(id), {
      method: "DELETE"
    });
    return res;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete customer!",
      data: null
    };
  }
}
