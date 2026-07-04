import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Verification failed: Missing inquiry ID parameters.", { status: 400 });
  }

  try {
    // 1. Fetch inquiry details from Supabase database
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return new Response("Record not found: Checked database inquiry parameters, no match found.", { status: 404 });
    }

    // 2. Instantiate PDF Document structure
    const doc = new PDFDocument({ 
      size: "A4", 
      margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });

    // Buffer chunk array to hold data streams
    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));

    // 3. Render Invoice Layout (Huly Midnight-inspired print layout: clean, high contrast)
    
    // Header Logo and Title
    doc.fillColor("#090a0c").rect(0, 0, 595, 120).fill(); // Title block banner
    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("PROJECT FACTORY", 50, 45, { characterSpacing: 1 });
    doc.fontSize(10).font("Helvetica").text("ENGINEERED SOFTWARE ASSETS", 50, 75, { characterSpacing: 2 });
    
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("INVOICE", 400, 50, { align: "right" });
    
    // Metadata fields
    doc.fillColor("#333333").fontSize(10).font("Helvetica-Bold").text("Billed To:", 50, 150);
    doc.font("Helvetica").text(`Client Name: ${inquiry.name}`, 50, 170);
    doc.text(`Email Address: ${inquiry.email}`, 50, 185);
    doc.text(`Organization: ${inquiry.org || "Individual Scoper"}`, 50, 200);

    doc.font("Helvetica-Bold").text("Invoice Details:", 350, 150);
    doc.font("Helvetica").text(`Invoice ID: PF-${inquiry.id.slice(0, 8).toUpperCase()}`, 350, 170);
    doc.text(`Issued Date: ${inquiry.createdAt.toLocaleDateString()}`, 350, 185);
    doc.text(`Status: ${inquiry.status.toUpperCase()}`, 350, 200);

    // Horizontal table divider
    doc.strokeColor("#4a4b50").lineWidth(1).moveTo(50, 230).lineTo(545, 230).stroke();

    // Table headers
    doc.font("Helvetica-Bold").text("Description", 50, 250);
    doc.text("Complexity", 320, 250, { width: 100, align: "center" });
    doc.text("Amount (USD)", 445, 250, { width: 100, align: "right" });

    // Table divider
    doc.strokeColor("#cccccc").moveTo(50, 268).lineTo(545, 268).stroke();

    // Table content values
    doc.font("Helvetica").text(`${inquiry.domain.toUpperCase()} Custom Project Architecture`, 50, 285, { width: 250 });
    doc.text(inquiry.complexity.toUpperCase(), 320, 285, { width: 100, align: "center" });
    doc.text(`$${inquiry.estimatedPrice}.00`, 445, 285, { width: 100, align: "right" });

    // Table summary sections
    doc.strokeColor("#4a4b50").moveTo(50, 320).lineTo(545, 320).stroke();

    doc.font("Helvetica-Bold").fontSize(12).text("Total Balance Due:", 300, 340, { width: 140, align: "right" });
    doc.text(`$${inquiry.estimatedPrice}.00`, 445, 340, { width: 100, align: "right" });

    // Payment notice info box
    doc.fillColor("#f7f7f9").rect(50, 420, 495, 70).fill();
    doc.fillColor("#090a0c").font("Helvetica-Bold").fontSize(10).text("Acquisition Notes:", 65, 435);
    doc.font("Helvetica").fontSize(9).text("This is an estimated scoping receipt. Our representative will contact you with deployment details and Slack channels. Payment links will follow validation.", 65, 455, { width: 460 });

    // Footer
    doc.fillColor("#999999").fontSize(8).text("Authorized signature by Project Factory Operations. Data Protection Active.", 50, 750, { align: "center" });

    // End Document stream write
    doc.end();

    // 4. Return PDF Stream response
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${inquiry.id.slice(0, 8)}.pdf`,
      },
    });

  } catch (error) {
    console.error("PDF Invoice API Route Error Log:", error);
    return new Response("Internal Server Error: Failed to generate PDF Invoice document.", { status: 500 });
  }
}
