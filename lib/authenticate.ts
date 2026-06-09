import { Admin } from "@/models/Admin";
import { Customer } from "@/models/Customer";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { apiResponse } from "./utils";

export async function authenticate(
  req: NextRequest,
  userContext: "Admin" | "Customer" = "Admin"
): Promise<{ data?: string; error?: NextResponse }> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: apiResponse(false, 401, "Unauthorized Token!")
      };
    }

    if (!process.env.NEXTAUTH_SECRET) throw new Error("NEXTAUTH_SECRET is not defined!");

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    if (typeof decoded === "string" || !decoded._id) {
      return {
        error: apiResponse(false, 401, "Invalid token format!")
      };
    }

    if (userContext === "Admin") {
      const admin = await Admin.findOne({ _id: decoded?._id });
      if (!admin) return { error: apiResponse(false, 401, "Admin not found!") };

      return { data: admin._id.toString() };
    }

    if (userContext === "Customer") {
      const customer = await Customer.findOne({ _id: decoded?._id });
      if (!customer) return { error: apiResponse(false, 401, "Customer not found!") };

      return { data: customer._id.toString() };
    }

    return { error: apiResponse(false, 401, "Invalid user context!") };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: apiResponse(false, 401, "Token expired!") };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return { error: apiResponse(false, 401, "Invalid token!") };
    }

    return { error: apiResponse(false, 401, "Authentication failed!") };
  }
}
