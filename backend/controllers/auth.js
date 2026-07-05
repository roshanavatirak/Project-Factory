const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { prisma } = require('../db');
const { redisClient } = require('../redis');

const smtpUser = process.env.SMTP_USER || "roshanawatirak@gmail.com";
const smtpPass = (process.env.SMTP_PASS || "grsv apfi pgch nfat").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

async function sendVerificationEmail(email, name, token) {
  // Attempt to delegate email delivery to Redis Queue
  if (redisClient && redisClient.isOpen) {
    try {
      const payload = JSON.stringify({ type: "verification", email, name, token });
      await redisClient.lPush("email_queue", payload);
      console.log(`Verification email successfully queued to Redis for: ${email}`);
      return;
    } catch (redisErr) {
      console.error("Redis email enqueueing failed, falling back to SMTP:", redisErr);
    }
  }

  // Direct SMTP fallback
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"Project Factory" <${smtpUser}>`,
    to: email,
    subject: "Verify your Project Factory Account 🚀",
    html: `
      <div style="font-family: sans-serif; background-color: #090a0c; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #4a4b50;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5683da; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">PROJECT<span style="color: #ffffff;">FACTORY</span></h1>
          <p style="color: #95979e; font-size: 14px; margin-top: 5px;">Verify Your Workspace Email</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Activate your account, ${name}!</h2>
        <p style="color: #a9a9aa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          You successfully signed up on Project Factory. Click the button below to verify your email and activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #5683da; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #95979e; font-size: 11px; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} Project Factory. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendResetEmail(email, name, token) {
  // Attempt to delegate email delivery to Redis Queue
  if (redisClient && redisClient.isOpen) {
    try {
      const payload = JSON.stringify({ type: "reset-password", email, name, token });
      await redisClient.lPush("email_queue", payload);
      console.log(`Password reset email successfully queued to Redis for: ${email}`);
      return;
    } catch (redisErr) {
      console.error("Redis email enqueueing failed, falling back to SMTP:", redisErr);
    }
  }

  // Direct SMTP fallback
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Project Factory" <${smtpUser}>`,
    to: email,
    subject: "Reset your Project Factory Password 🔑",
    html: `
      <div style="font-family: sans-serif; background-color: #090a0c; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #4a4b50;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff8964; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">PROJECT<span style="color: #ffffff;">FACTORY</span></h1>
          <p style="color: #95979e; font-size: 14px; margin-top: 5px;">Reset Workspace Key</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Forgot Password Request</h2>
        <p style="color: #a9a9aa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset the password for your developer account, ${name}. Click the button below to specify your new credentials. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #ff8964; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
            Set New Password
          </a>
        </div>
        <p style="color: #95979e; font-size: 11px; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} Project Factory. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function register(req, res) {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: "Validation failed: Name, email, and password are required." });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (existing) {
      return res.status(400).json({ success: false, error: "Account exists: A user with this email address is already registered." });
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: phone.trim().replace(/[\s\-\(\)\.]/g, "") }
      });
      if (existingPhone) {
        return res.status(400).json({ success: false, error: "Account exists: A user with this mobile number is already registered." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        phone: phone ? phone.trim().replace(/[\s\-\(\)\.]/g, "") : null,
        role: "student",
        emailVerified: false,
        verificationToken
      }
    });

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (smtpErr) {
      console.error("Nodemailer dispatch failed:", smtpErr);
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Validation failed: Email/Mobile and password are required." });
  }

  const lookupVal = email.toLowerCase().trim().includes("@")
    ? email.toLowerCase().trim()
    : email.trim().replace(/[\s\-\(\)\.]/g, "");

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: lookupVal },
          { phone: lookupVal }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "Authentication failed: Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: "Authentication failed: Invalid credentials." });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ success: false, error: "Verification required: Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "An internal database authentication error occurred." });
  }
}

async function getSession(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User session expired or invalid." });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Session error:", err);
    return res.status(500).json({ success: false, error: "An error occurred retrieving session details." });
  }
}

async function verifyEmail(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "Verification failed: Token parameter is missing." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "Verification failed: The verification token is invalid or has expired." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ success: false, error: "Database error occurred during verification." });
  }
}

async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Validation failed: Email address is required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.json({ success: true, message: "If the email is registered, a password reset link has been dispatched." });
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    try {
      await sendResetEmail(user.email, user.name, resetToken);
    } catch (smtpErr) {
      console.error("Password reset email failed:", smtpErr);
    }

    return res.json({ success: true, message: "If the email is registered, a password reset link has been dispatched." });
  } catch (err) {
    console.error("Request reset error:", err);
    return res.status(500).json({ success: false, error: "Internal server error occurred." });
  }
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, error: "Validation failed: Required fields are missing." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: "Validation failed: Password must be at least 6 characters long." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "Reset failed: The password reset link is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, error: "Internal server error occurred." });
  }
}

// OAuth Helper to link or create user by email
async function handleOAuthUser(email, name) {
  const sanitizedEmail = email.toLowerCase().trim();
  let user = await prisma.user.findUnique({
    where: { email: sanitizedEmail }
  });

  if (user) {
    // If account exists, guarantee it is verified
    if (!user.emailVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      });
    }
  } else {
    // Create new profile with secure random password key
    const dummyPassword = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(dummyPassword, 10);
    user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: name || "OAuth Developer",
        role: "student",
        emailVerified: true
      }
    });
  }

  // Generate session JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '7d' }
  );

  return token;
}

// Google OAuth redirect logic
async function googleRedirect(req, res) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/auth/login?error=Google%20OAuth%20Credentials%20Not%20Configured`);
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ")
  };

  const qs = new URLSearchParams(options).toString();
  return res.redirect(`${rootUrl}?${qs}`);
}

// Google OAuth callback endpoint
async function googleCallback(req, res) {
  const code = req.query.code;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    return res.redirect(`${frontendUrl}/auth/login?error=OAuth%20Code%20Missing`);
  }

  try {
    const rootUrl = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
      grant_type: "authorization_code"
    };

    const tokenRes = await fetch(rootUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(values).toString()
    });

    if (!tokenRes.ok) {
      throw new Error(`Google token exchange failed: ${tokenRes.statusText}`);
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!userRes.ok) {
      throw new Error(`Google user retrieval failed: ${userRes.statusText}`);
    }

    const { email, name } = await userRes.json();
    if (!email) {
      throw new Error("No email returned from Google user profile.");
    }

    const token = await handleOAuthUser(email, name);
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return res.redirect(`${frontendUrl}/auth/login?error=Google%20Authentication%20Failed`);
  }
}

// GitHub OAuth redirect logic
async function githubRedirect(req, res) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/auth/login?error=GitHub%20OAuth%20Credentials%20Not%20Configured`);
  }

  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
    scope: "user:email"
  };

  const qs = new URLSearchParams(options).toString();
  return res.redirect(`${rootUrl}?${qs}`);
}

// GitHub OAuth callback endpoint
async function githubCallback(req, res) {
  const code = req.query.code;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    return res.redirect(`${frontendUrl}/auth/login?error=OAuth%20Code%20Missing`);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback"
      }).toString()
    });

    if (!tokenRes.ok) {
      throw new Error(`GitHub token exchange failed: ${tokenRes.statusText}`);
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "Project-Factory-Backend"
      }
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user retrieval failed: ${userRes.statusText}`);
    }

    const userData = await userRes.json();
    let email = userData.email;
    const name = userData.name || userData.login;

    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "User-Agent": "Project-Factory-Backend"
        }
      });
      if (emailRes.ok) {
        const emailsList = await emailRes.json();
        const primaryVerified = emailsList.find(e => e.primary && e.verified);
        if (primaryVerified) {
          email = primaryVerified.email;
        } else if (emailsList.length > 0) {
          email = emailsList[0].email;
        }
      }
    }

    if (!email) {
      throw new Error("No verified email returned from GitHub profile.");
    }

    const token = await handleOAuthUser(email, name);
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return res.redirect(`${frontendUrl}/auth/login?error=GitHub%20Authentication%20Failed`);
  }
}

module.exports = {
  register,
  login,
  getSession,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback
};
