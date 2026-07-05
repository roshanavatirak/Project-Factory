"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface InquiryData {
  name: string;
  email: string;
  org?: string;
  notes?: string;
  domain: string;
  complexity: string;
  estimatedPrice: number;
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (sessionCookie && sessionCookie.value) {
      const sessionUser = JSON.parse(sessionCookie.value);
      return sessionUser.token || "";
    }
  } catch {}
  return "";
}

export async function submitInquiryAction(data: InquiryData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/inquiry/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Submit inquiry proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function getInquiriesAction(email?: string) {
  try {
    const token = await getAuthToken();
    const url = email 
      ? `${BACKEND_URL}/api/inquiry/list?email=${encodeURIComponent(email)}`
      : `${BACKEND_URL}/api/inquiry/list`;

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    return await res.json();
  } catch (err) {
    console.error("Get inquiries proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function getPackagesAction() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/packages`);
    return await res.json();
  } catch (err) {
    console.error("Get packages proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}
