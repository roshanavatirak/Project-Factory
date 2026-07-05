"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

export async function adminGetStatsAction() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
  } catch (err) {
    console.error("Admin stats proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminGetUsersAction() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
  } catch (err) {
    console.error("Admin users proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminGetInquiriesAction() {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/inquiry/list`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
  } catch (err) {
    console.error("Admin inquiries proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminUpdateUserRoleAction(userId: string, newRole: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/users/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ targetUserId: userId, newRole })
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin role update proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminUpdateInquiryStatusAction(inquiryId: string, newStatus: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ targetInquiryId: inquiryId, newStatus })
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin status update proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminDeleteUserAction(userId: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/users/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id: userId })
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin user delete proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminDeleteInquiryAction(inquiryId: string) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/inquiries/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id: inquiryId })
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/dashboard");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin inquiry delete proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminGetPackagesAction() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/packages`);
    return await res.json();
  } catch (err) {
    console.error("Admin fetch packages proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminUpdatePackageAction(
  packageId: string,
  data: {
    name?: string;
    description?: string;
    originalPrice?: number;
    standardPrice?: number;
    promoPrice?: number;
    features?: string[];
    popular?: boolean;
    cta?: string;
    glow?: string;
  }
) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/packages/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id: packageId, ...data })
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/pricing");
      revalidatePath("/contact");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin update package proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}

export async function adminCreatePackageAction(data: {
  key: string;
  name: string;
  description: string;
  originalPrice: number;
  standardPrice: number;
  promoPrice: number;
  features: string[];
  popular?: boolean;
  cta?: string;
  glow?: string;
}) {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BACKEND_URL}/api/admin/packages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (result.success) {
      revalidatePath("/pricing");
      revalidatePath("/contact");
      revalidatePath("/admin/dashboard");
    }
    return result;
  } catch (err) {
    console.error("Admin create package proxy error:", err);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}
