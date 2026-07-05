const { prisma } = require('../db');

function verifyAdminRole(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied: Administrator privileges required." });
  }
  next();
}

async function getStats(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    const totalInquiries = await prisma.inquiry.count();
    
    const acceptedInquiries = await prisma.inquiry.findMany({
      where: { status: "accepted" },
      select: { estimatedPrice: true }
    });
    const totalRevenue = acceptedInquiries.reduce((acc, inq) => acc + inq.estimatedPrice, 0);

    const pendingInquiries = await prisma.inquiry.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalInquiries,
        totalRevenue,
        pendingCount: pendingInquiries.length
      },
      recentPending: pendingInquiries.map(inq => ({
        ...inq,
        createdAt: inq.createdAt.toISOString(),
        updatedAt: inq.updatedAt.toISOString(),
      }))
    });
  } catch (err) {
    console.error("Get admin stats error:", err);
    return res.status(500).json({ success: false, error: "Failed to read database statistics." });
  }
}

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        phone: u.phone,
        name: u.name,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }))
    });
  } catch (err) {
    console.error("Get admin users error:", err);
    return res.status(500).json({ success: false, error: "Failed to retrieve user directory." });
  }
}

async function updateUserRole(req, res) {
  const { targetUserId, newRole } = req.body;

  if (!targetUserId || !newRole) {
    return res.status(400).json({ success: false, error: "Validation failed: User ID and new role are required." });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole }
    });

    return res.json({ success: true, user: { id: updated.id, email: updated.email, role: updated.role } });
  } catch (err) {
    console.error("Update role error:", err);
    return res.status(500).json({ success: false, error: "Failed to modify user access level." });
  }
}

async function updateInquiryStatus(req, res) {
  const { targetInquiryId, newStatus } = req.body;

  if (!targetInquiryId || !newStatus) {
    return res.status(400).json({ success: false, error: "Validation failed: Inquiry ID and status are required." });
  }

  try {
    const updated = await prisma.inquiry.update({
      where: { id: targetInquiryId },
      data: { status: newStatus }
    });

    return res.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error("Update inquiry status error:", err);
    return res.status(500).json({ success: false, error: "Failed to change inquiry status." });
  }
}

async function deleteUser(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: "Validation failed: Missing user ID." });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
    return res.json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ success: false, error: "Failed to delete user." });
  }
}

async function deleteInquiry(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: "Validation failed: Missing inquiry ID." });
  }

  try {
    await prisma.inquiry.delete({
      where: { id }
    });
    return res.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (err) {
    console.error("Delete inquiry error:", err);
    return res.status(500).json({ success: false, error: "Failed to delete inquiry." });
  }
}

module.exports = {
  verifyAdminRole,
  getStats,
  getUsers,
  updateUserRole,
  updateInquiryStatus,
  deleteUser,
  deleteInquiry
};
