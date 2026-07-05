"use server";

import { cookies } from "next/headers";

interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

interface LoginData {
  identifier: string;
  password?: string;
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function signupAction(data: SignupData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error("Signup proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function loginAction(data: LoginData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.identifier, password: data.password })
    });
    
    const result = await res.json();
    if (result.success && result.token) {
      const cookieStore = await cookies();
      cookieStore.set("session", JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        token: result.token
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }
    return result;
  } catch (err) {
    console.error("Login proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}

export async function getSessionAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return { success: false };
  }

  try {
    const sessionUser = JSON.parse(sessionCookie.value);
    if (!sessionUser.token) {
      return { success: false };
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: {
        "Authorization": `Bearer ${sessionUser.token}`
      }
    });
    
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function verifyEmailAction(token: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    return await res.json();
  } catch (err) {
    console.error("Verify email proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    console.error("Request reset proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });
    return await res.json();
  } catch (err) {
    console.error("Reset password proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}
