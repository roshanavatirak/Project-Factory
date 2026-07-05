const { prisma } = require('../db');
const PDFDocument = require('pdfkit');

function sanitizeInput(str) {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

async function submitInquiry(req, res) {
  const { name, email, org, notes, domain, complexity, estimatedPrice } = req.body;

  if (!name || !email || !domain || !complexity) {
    return res.status(400).json({ success: false, error: "Validation failed: Required fields are missing." });
  }

  const sanitizedName = sanitizeInput(name);
  const sanitizedEmail = sanitizeInput(email).toLowerCase();
  const sanitizedOrg = sanitizeInput(org || "");
  const sanitizedNotes = sanitizeInput(notes || "");
  const sanitizedDomain = sanitizeInput(domain);
  const sanitizedComplexity = sanitizeInput(complexity);

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        org: sanitizedOrg || null,
        notes: sanitizedNotes || null,
        domain: sanitizedDomain,
        complexity: sanitizedComplexity,
        estimatedPrice: Math.max(0, Math.floor(Number(estimatedPrice) || 0)),
        status: "pending"
      }
    });

    return res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error("Submit inquiry error:", err);
    return res.status(500).json({ success: false, error: "An internal server error occurred logging inquiry." });
  }
}

async function getInquiries(req, res) {
  const { email } = req.query;

  try {
    const queryOptions = {
      orderBy: { createdAt: "desc" }
    };

    if (req.user.role !== "admin") {
      queryOptions.where = { email: req.user.email.toLowerCase() };
    } else if (email) {
      queryOptions.where = { email: email.toLowerCase() };
    }

    const inquiries = await prisma.inquiry.findMany(queryOptions);

    return res.json({
      success: true,
      inquiries: inquiries.map(inq => ({
        ...inq,
        createdAt: inq.createdAt.toISOString(),
        updatedAt: inq.updatedAt.toISOString(),
      }))
    });
  } catch (err) {
    console.error("Get inquiries error:", err);
    return res.status(500).json({ success: false, error: "An error occurred retrieving inquiries." });
  }
}

async function generateInvoice(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Verification failed: Missing ID parameters.");
  }

  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id }
    });

    if (!inquiry) {
      return res.status(404).send("Record not found.");
    }

    if (req.user.role !== "admin" && req.user.email.toLowerCase() !== inquiry.email.toLowerCase()) {
      return res.status(403).send("Access denied.");
    }

    const doc = new PDFDocument({ 
      size: "A4", 
      margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${inquiry.id.slice(0, 8)}.pdf`);

    doc.pipe(res);

    doc.fillColor("#090a0c").rect(0, 0, 595, 120).fill();
    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("PROJECT FACTORY", 50, 45, { characterSpacing: 1 });
    doc.fontSize(10).font("Helvetica").text("ENGINEERED SOFTWARE ASSETS", 50, 75, { characterSpacing: 2 });
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("INVOICE", 400, 50, { align: "right" });

    doc.fillColor("#333333").fontSize(10).font("Helvetica-Bold").text("Billed To:", 50, 150);
    doc.font("Helvetica").text(`Client Name: ${inquiry.name}`, 50, 170);
    doc.text(`Email Address: ${inquiry.email}`, 50, 185);
    doc.text(`Organization: ${inquiry.org || "Individual Scoper"}`, 50, 200);

    doc.font("Helvetica-Bold").text("Invoice Details:", 350, 150);
    doc.font("Helvetica").text(`Invoice ID: PF-${inquiry.id.slice(0, 8).toUpperCase()}`, 350, 170);
    doc.text(`Issued Date: ${inquiry.createdAt.toLocaleDateString()}`, 350, 185);
    doc.text(`Status: ${inquiry.status.toUpperCase()}`, 350, 200);

    doc.strokeColor("#4a4b50").lineWidth(1).moveTo(50, 230).lineTo(545, 230).stroke();

    doc.font("Helvetica-Bold").text("Description", 50, 250);
    doc.text("Complexity", 320, 250, { width: 100, align: "center" });
    doc.text("Amount (INR)", 445, 250, { width: 100, align: "right" });

    doc.strokeColor("#cccccc").moveTo(50, 268).lineTo(545, 268).stroke();

    doc.font("Helvetica").text(`${inquiry.domain.toUpperCase()} Custom Project Architecture`, 50, 285, { width: 250 });
    doc.text(inquiry.complexity.toUpperCase(), 320, 285, { width: 100, align: "center" });
    doc.text(`₹${inquiry.estimatedPrice.toLocaleString("en-IN")}.00`, 445, 285, { width: 100, align: "right" });

    doc.strokeColor("#4a4b50").moveTo(50, 320).lineTo(545, 320).stroke();
    doc.font("Helvetica-Bold").fontSize(12).text("Total Balance Due:", 300, 340, { width: 140, align: "right" });
    doc.text(`₹${inquiry.estimatedPrice.toLocaleString("en-IN")}.00`, 445, 340, { width: 100, align: "right" });

    doc.fillColor("#f7f7f9").rect(50, 420, 495, 70).fill();
    doc.fillColor("#090a0c").font("Helvetica-Bold").fontSize(10).text("Acquisition Notes:", 65, 435);
    doc.font("Helvetica").fontSize(9).text("This is an estimated scoping receipt. Our representative will contact you with deployment details and Slack channels. Payment links will follow validation.", 65, 455, { width: 460 });

    doc.fillColor("#999999").fontSize(8).text("Authorized signature by Project Factory Operations. Data Protection Active.", 50, 750, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF generation failure:", err);
    return res.status(500).send("Internal Server Error.");
  }
}

module.exports = { submitInquiry, getInquiries, generateInvoice };
