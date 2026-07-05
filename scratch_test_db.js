const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function main() {
  try {
    console.log("Deleting existing packages to reset...");
    await prisma.package.deleteMany();
    console.log("Seeding packages...");
    await Promise.all(
      defaultPackages.map((pkg) =>
        prisma.package.create({
          data: pkg
        })
      )
    );
    console.log("Reseeding completed successfully!");
  } catch (err) {
    console.error("Reseeding error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
