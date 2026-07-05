"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function loginWithOAuthTokenAction(token: string) {
  if (!token) {
    return { success: false, error: "OAuth token parameter is missing." };
  }

  try {
    // Exchange token for session user data from backend
    const res = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (result.success && result.user) {
      const cookieStore = await cookies();
      cookieStore.set("session", JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        token: token
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return { success: true };
    }

    return { success: false, error: result.error || "Failed to retrieve session details." };
  } catch (err) {
    console.error("OAuth login action error:", err);
    return { success: false, error: "Authentication failed or network is unreachable." };
  }
}
