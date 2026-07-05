const { prisma } = require('../db');

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

async function getPackages(req, res) {
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

    const orderMap = { minor: 0, major: 1, research: 2 };
    const sorted = packages
      .map(p => ({
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

    return res.json({ success: true, packages: sorted });
  } catch (err) {
    console.error("Get packages error:", err);
    return res.status(500).json({ success: false, error: "Failed to read pricing packages." });
  }
}

async function createPackage(req, res) {
  const { key, name, description, originalPrice, standardPrice, promoPrice, features, popular, cta, glow } = req.body;

  if (!key || !name || !description) {
    return res.status(400).json({ success: false, error: "Validation failed: Key, name, and description are required." });
  }

  try {
    const existing = await prisma.package.findUnique({
      where: { key: key.toLowerCase().trim() }
    });
    if (existing) {
      return res.status(400).json({ success: false, error: "Validation failed: A package with this key already exists." });
    }

    const newPkg = await prisma.package.create({
      data: {
        key: key.toLowerCase().trim(),
        name,
        description,
        originalPrice: Number(originalPrice) || 0,
        standardPrice: Number(standardPrice) || 0,
        promoPrice: Number(promoPrice) || 0,
        features: Array.isArray(features) ? features : [],
        popular: Boolean(popular),
        cta: cta || "Acquire Package",
        glow: glow || "none"
      }
    });

    return res.status(201).json({ success: true, package: newPkg });
  } catch (err) {
    console.error("Create package error:", err);
    return res.status(500).json({ success: false, error: "Failed to create pricing package." });
  }
}

async function updatePackage(req, res) {
  const { id, name, description, originalPrice, standardPrice, promoPrice, features, popular, cta, glow } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: "Validation failed: Missing package ID." });
  }

  try {
    const updated = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        originalPrice: Number(originalPrice),
        standardPrice: Number(standardPrice),
        promoPrice: Number(promoPrice),
        features: Array.isArray(features) ? features : [],
        popular: Boolean(popular),
        cta,
        glow
      }
    });

    return res.json({ success: true, package: updated });
  } catch (err) {
    console.error("Update package error:", err);
    return res.status(500).json({ success: false, error: "Failed to update pricing package." });
  }
}

module.exports = { getPackages, createPackage, updatePackage };
