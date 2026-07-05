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

const defaultPackages = [
  {
    key: "minor",
    name: "Academic Capstone Pack",
    description: "Perfect for students needing a clean, fully documented boilerplate code template for capstone evaluation.",
    originalPrice: 15000,
    standardPrice: 12000,
    promoPrice: 10000,
    features: [
      "Complete Source Code (Github Repository Access)",
      "Step-by-step Setup instructions README.md",
      "Standard Project Synopsis Template (Word/PDF)",
      "Local SQLite/PostgreSQL Database setup scripts",
      "Standard environment configurations & lockfiles",
      "1-Hour dedicated remote setup & debugging support"
    ],
    popular: false,
    cta: "Acquire Capstone",
    glow: "none"
  },
  {
    key: "major",
    name: "Advanced Major Project Pack",
    description: "Ideal for comprehensive final year engineering presentations, standard capstone deliverables, and viva defense.",
    originalPrice: 18000,
    standardPrice: 15000,
    promoPrice: 12000,
    features: [
      "All Academic Capstone Deliverables",
      "Full Dashboard web app template codebase",
      "Complete Software Requirement Specs (SRS) & UML diagrams",
      "Pre-configured Docker & Docker Compose container files",
      "Project Presentation Slides (PPT) & Video setup guide",
      "External Examiner Viva prep Q&A guide sheet",
      "3-Hours total virtual pairing & deployment support"
    ],
    popular: true,
    cta: "Explore Major Packages",
    glow: "iris"
  },
  {
    key: "research",
    name: "Research & PhD Capstone Pack",
    description: "Designed for highly complex multi-agent swarms, PhD level research implementations, and academic thesis projects.",
    originalPrice: 22000,
    standardPrice: 18000,
    promoPrice: 15000,
    features: [
      "All Advanced SaaS Deliverables",
      "Custom scoped feature builds & AI agent sandbox logic",
      "Vercel, AWS, or GCP production cloud deployment scripts",
      "Comprehensive Project Report & LaTeX research paper draft",
      "Multi-model API routing configurations (Ollama/OpenAI)",
      "Direct WhatsApp/Slack access to Lead Engineer",
      "8-Hours dedicated virtual engineering pairing sessions"
    ],
    popular: false,
    cta: "Initiate Thesis Scope",
    glow: "ember"
  }
];

export async function getPackagesAction() {
  try {
    let packages = await prisma.package.findMany({
      orderBy: { createdAt: "asc" }
    });

    if (packages.length === 0) {
      await Promise.all(
        defaultPackages.map((pkg) =>
          prisma.package.create({
            data: pkg
          })
        )
      );
      packages = await prisma.package.findMany({
        orderBy: { createdAt: "asc" }
      });
    }

    const orderMap: Record<string, number> = { minor: 0, major: 1, research: 2 };
    const sorted = packages
      .map((p) => ({
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
      }))
      .sort((a, b) => (orderMap[a.key] ?? 99) - (orderMap[b.key] ?? 99));

    return { 
      success: true, 
      packages: sorted
    };
  } catch (error) {
    console.error("Database Fetch Packages Error Log:", error);
    return { success: false, error: "Database authentication failed or network is unreachable." };
  }
}
