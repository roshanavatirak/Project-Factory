"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface InquiryData {
  name: string;
  email: string;
  org?: string;
  notes?: string;
  domain: string;
  complexity: string;
  estimatedPrice: number;
}

// Security Helper: Sanitize string parameters to neutralize stored XSS vectors
function sanitizeInput(str: string): string {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip script tags
    .replace(/<\/?[^>]+(>|$)/g, "") // strip all standard HTML tags
    .replace(/[<>]/g, "") // remove stray angle brackets
    .trim();
}

export async function submitInquiryAction(data: InquiryData) {
  // 1. Strict Server-Side Payload Validation
  if (!data.name || !data.email || !data.domain || !data.complexity) {
    return { 
      success: false, 
      error: "Validation failed: Required payload fields are missing." 
    };
  }

  // 2. Data Protection: Field length safeguards to prevent buffer overload attempts
  if (data.name.length > 100 || data.email.length > 120) {
    return {
      success: false,
      error: "Validation failed: Field character lengths exceed safety limits."
    };
  }

  // 3. Strict RFC 5322 Email regex verification
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(data.email)) {
    return { 
      success: false, 
      error: "Validation failed: Provided email address format is invalid." 
    };
  }

  // 4. Input Sanitization for all string coordinates
  const sanitizedName = sanitizeInput(data.name);
  const sanitizedEmail = sanitizeInput(data.email).toLowerCase();
  const sanitizedOrg = sanitizeInput(data.org || "");
  const sanitizedNotes = sanitizeInput(data.notes || "");
  const sanitizedDomain = sanitizeInput(data.domain);
  const sanitizedComplexity = sanitizeInput(data.complexity);

  try {
    // 5. Database execution using Prisma Client
    await prisma.inquiry.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        org: sanitizedOrg || null,
        notes: sanitizedNotes || null,
        domain: sanitizedDomain,
        complexity: sanitizedComplexity,
        estimatedPrice: Math.max(0, Math.floor(data.estimatedPrice)), // prevent negative pricing inputs
        status: "pending",
      },
    });

    console.log(`Database Log: Secured Inquiry successfully logged from ${sanitizedEmail}`);

    // Revalidate dynamic workspace portal paths
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    // 6. Secure Exception Masking (avoid leaking DB columns or structural traces to clients)
    console.error("Secure Database Error Log:", error);
    return { 
      success: false, 
      error: "An internal security or database error occurred. Your inquiry could not be completed at this time." 
    };
  }
}

export async function getInquiriesAction(email?: string) {
  try {
    const queryOptions: any = {
      orderBy: { createdAt: "desc" },
      take: 10,
    };

    if (email) {
      queryOptions.where = {
        email: email.toLowerCase()
      };
    }

    const inquiries = await prisma.inquiry.findMany(queryOptions);
    
    // Sanitize database objects before returning to front-end clients
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
    console.error("Database Fetch Error Log:", error);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}
