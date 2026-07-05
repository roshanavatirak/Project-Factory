require('dotenv').config();
require('./redis');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const { verifyToken } = require('./middleware/auth');
const authController = require('./controllers/auth');
const inquiryController = require('./controllers/inquiry');
const adminController = require('./controllers/admin');
const packagesController = require('./controllers/packages');

app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/session', verifyToken, authController.getSession);
app.post('/api/auth/verify', authController.verifyEmail);
app.post('/api/auth/forgot', authController.requestPasswordReset);
app.post('/api/auth/reset', authController.resetPassword);

// OAuth API Routes
app.get('/api/auth/google', authController.googleRedirect);
app.get('/api/auth/google/callback', authController.googleCallback);
app.get('/api/auth/github', authController.githubRedirect);
app.get('/api/auth/github/callback', authController.githubCallback);

app.post('/api/inquiry/submit', inquiryController.submitInquiry);
app.get('/api/inquiry/list', verifyToken, inquiryController.getInquiries);
app.get('/api/invoice', verifyToken, inquiryController.generateInvoice);

app.get('/api/packages', packagesController.getPackages);

app.get('/api/admin/stats', verifyToken, adminController.verifyAdminRole, adminController.getStats);
app.get('/api/admin/users', verifyToken, adminController.verifyAdminRole, adminController.getUsers);
app.post('/api/admin/users/role', verifyToken, adminController.verifyAdminRole, adminController.updateUserRole);
app.post('/api/admin/users/delete', verifyToken, adminController.verifyAdminRole, adminController.deleteUser);
app.post('/api/admin/inquiries/status', verifyToken, adminController.verifyAdminRole, adminController.updateInquiryStatus);
app.post('/api/admin/inquiries/delete', verifyToken, adminController.verifyAdminRole, adminController.deleteInquiry);
app.post('/api/admin/packages/create', verifyToken, adminController.verifyAdminRole, packagesController.createPackage);
app.post('/api/admin/packages/update', verifyToken, adminController.verifyAdminRole, packagesController.updatePackage);

app.use((err, req, res, next) => {
  console.error("Unhandled global server error:", err);
  res.status(500).json({ success: false, error: "An unhandled error occurred on the API server." });
});

app.listen(PORT, () => {
  console.log(`Standalone Express API Server listening on port ${PORT}`);
});
