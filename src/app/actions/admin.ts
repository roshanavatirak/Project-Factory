"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Internal helper to verify the calling session has the "admin" role
async function verifyAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    const user = JSON.parse(sessionCookie.value);
    if (user && user.role === "admin") {
      return user;
    }
  } catch {
    return null;
  }
  return null;
}

// 1. Fetch system statistics
export async function adminGetStatsAction() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalInquiries = await prisma.inquiry.count();
    
    // Sum of estimated revenue
    const revenueAggregation = await prisma.inquiry.aggregate({
      _sum: {
        estimatedPrice: true
      }
    });
    const estRevenue = revenueAggregation._sum.estimatedPrice || 0;

    // Count of pending inquiries
    const pendingInquiries = await prisma.inquiry.count({
      where: { status: "pending" }
    });

    // Count of projects
    const totalProjects = await prisma.project.count();

    return {
      success: true,
      stats: {
        totalUsers,
        totalInquiries,
        estRevenue,
        pendingInquiries,
        totalProjects
      }
    };
  } catch (error) {
    console.error("Admin stats aggregation error:", error);
    return { success: false, error: "Failed to load admin statistics." };
  }
}

// 2. Fetch all registered users
export async function adminGetUsersAction() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    const safeUsers = users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString()
    }));

    return { success: true, users: safeUsers };
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return { success: false, error: "Failed to retrieve student directory." };
  }
}

// 3. Fetch all inquiries
export async function adminGetInquiriesAction() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" }
    });

    const safeInquiries = inquiries.map((inq) => ({
      id: inq.id,
      name: inq.name,
      email: inq.email,
      org: inq.org || "",
      notes: inq.notes || "",
      domain: inq.domain,
      complexity: inq.complexity,
      estimatedPrice: inq.estimatedPrice,
      status: inq.status,
      createdAt: inq.createdAt.toISOString()
    }));

    return { success: true, inquiries: safeInquiries };
  } catch (error) {
    console.error("Admin fetch inquiries error:", error);
    return { success: false, error: "Failed to retrieve inquiry logs." };
  }
}

// 4. Update user role
export async function adminUpdateUserRoleAction(userId: string, newRole: string) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  if (userId === admin.id) {
    return { success: false, error: "Validation failed: You cannot alter your own admin status." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Admin role update error:", error);
    return { success: false, error: "Failed to modify user role." };
  }
}

// 5. Update inquiry status
export async function adminUpdateInquiryStatusAction(inquiryId: string, newStatus: string) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status: newStatus }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Admin status update error:", error);
    return { success: false, error: "Failed to update inquiry status." };
  }
}

// 6. Delete user account
export async function adminDeleteUserAction(userId: string) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  if (userId === admin.id) {
    return { success: false, error: "Validation failed: You cannot delete your own account." };
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Admin user delete error:", error);
    return { success: false, error: "Failed to delete user profile." };
  }
}

// 7. Delete inquiry record
export async function adminDeleteInquiryAction(inquiryId: string) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    await prisma.inquiry.delete({
      where: { id: inquiryId }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Admin inquiry delete error:", error);
    return { success: false, error: "Failed to purge inquiry record." };
  }
}

// 8. Fetch all packages (for administration)
export async function adminGetPackagesAction() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "asc" }
    });

    const safePackages = packages.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      description: p.description,
      originalPrice: p.originalPrice,
      standardPrice: p.standardPrice,
      promoPrice: p.promoPrice,
      features: p.features,
      popular: p.popular,
      cta: p.cta,
      glow: p.glow,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return { success: true, packages: safePackages };
  } catch (error) {
    console.error("Admin fetch packages error:", error);
    return { success: false, error: "Failed to retrieve package catalogs." };
  }
}

// 9. Update package details
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
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const updated = await prisma.package.update({
      where: { id: packageId },
      data: {
        name: data.name,
        description: data.description,
        originalPrice: data.originalPrice !== undefined ? Math.floor(data.originalPrice) : undefined,
        standardPrice: data.standardPrice !== undefined ? Math.floor(data.standardPrice) : undefined,
        promoPrice: data.promoPrice !== undefined ? Math.floor(data.promoPrice) : undefined,
        features: data.features,
        popular: data.popular,
        cta: data.cta,
        glow: data.glow,
      }
    });

    revalidatePath("/pricing");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      package: {
        id: updated.id,
        key: updated.key,
        name: updated.name,
        description: updated.description,
        originalPrice: updated.originalPrice,
        standardPrice: updated.standardPrice,
        promoPrice: updated.promoPrice,
        features: updated.features,
        popular: updated.popular,
        cta: updated.cta,
        glow: updated.glow,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("Admin update package error:", error);
    return { success: false, error: "Failed to update package details." };
  }
}

// 10. Create a new package
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
  const admin = await verifyAdminSession();
  if (!admin) {
    return { success: false, error: "Unauthorized: Admin privileges required." };
  }

  try {
    const existing = await prisma.package.findUnique({
      where: { key: data.key.toLowerCase().trim() }
    });
    if (existing) {
      return { success: false, error: "Validation failed: A package with this key already exists." };
    }

    const created = await prisma.package.create({
      data: {
        key: data.key.toLowerCase().trim(),
        name: data.name,
        description: data.description,
        originalPrice: Math.floor(data.originalPrice),
        standardPrice: Math.floor(data.standardPrice),
        promoPrice: Math.floor(data.promoPrice),
        features: data.features,
        popular: data.popular || false,
        cta: data.cta || "Acquire Package",
        glow: data.glow || "none",
      }
    });

    revalidatePath("/pricing");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      package: {
        id: created.id,
        key: created.key,
        name: created.name,
        description: created.description,
        originalPrice: created.originalPrice,
        standardPrice: created.standardPrice,
        promoPrice: created.promoPrice,
        features: created.features,
        popular: created.popular,
        cta: created.cta,
        glow: created.glow,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      }
    };
  } catch (error) {
    console.error("Admin create package error:", error);
    return { success: false, error: "Failed to create package catalog tier." };
  }
}
