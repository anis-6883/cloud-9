import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password } = body;

  if (email === "shariard58@gmail.com" && password === "12345") {
    // REAL JWT TOKEN
    const token = jwt.sign(
      {
        name: "Shariar Mahmud",
        email: "shariard58@gmail.com"
      },
      "my-secret-key",
      {
        expiresIn: "1h"
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        id: "1",
        name: "Shariar Mahmud",
        email,
        token
      }
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid credentials"
    },
    {
      status: 401
    }
  );
}
