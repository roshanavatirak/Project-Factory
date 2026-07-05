"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

interface LoginData {
  identifier: string; // Email or Mobile Number
  password?: string;
}

// Input sanitizer helper
function sanitizeString(str: string): string {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

// Configure Nodemailer Transporter using SMTP credentials directly
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

// Helper to send Verification Email directly from Server Action
async function sendVerificationEmailDirect(email: string, name: string, token: string) {
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

// Helper to send Password Reset Email directly from Server Action
async function sendResetEmailDirect(email: string, name: string, token: string) {
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

export async function signupAction(data: SignupData) {
  if (!data.name || !data.email || !data.password) {
    return { success: false, error: "Validation failed: Name, email, and password are required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { success: false, error: "Validation failed: Invalid email format." };
  }

  if (data.password.length < 6) {
    return { success: false, error: "Validation failed: Password must be at least 6 characters long." };
  }

  const sanitizedName = sanitizeString(data.name);
  const sanitizedEmail = sanitizeString(data.email).toLowerCase();
  
  // Normalize phone number (strip spaces, hyphens, brackets, dots)
  let sanitizedPhone = data.phone 
    ? sanitizeString(data.phone).replace(/[\s\-\(\)\.]/g, "") 
    : null;
  
  if (sanitizedPhone === "") {
    sanitizedPhone = null;
  }

  try {
    // Check email availability
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });
    if (existingEmailUser) {
      return { success: false, error: "Account exists: A user with this email address is already registered." };
    }

    // Check phone availability if provided
    if (sanitizedPhone) {
      const existingPhoneUser = await prisma.user.findUnique({
        where: { phone: sanitizedPhone }
      });
      if (existingPhoneUser) {
        return { success: false, error: "Account exists: A user with this mobile number is already registered." };
      }
    }

    // Hash password & generate verification token
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomUUID();

    // Create user in database with default normal role "student" and emailVerified = false
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password: hashedPassword,
        role: "student",
        emailVerified: false,
        verificationToken,
      }
    });

    // Send Verification Email directly (Netlify serverless function support)
    try {
      await sendVerificationEmailDirect(user.email, user.name || "Developer", verificationToken);
      console.log(`Direct SMTP: Verification email successfully dispatched to ${user.email}`);
    } catch (smtpError) {
      console.error("Direct SMTP Dispatch Warning:", smtpError);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Signup Action Error Log:", error);
    return { success: false, error: "An internal security error occurred during account creation." };
  }
}

export async function loginAction(data: LoginData) {
  if (!data.identifier || !data.password) {
    return { success: false, error: "Validation failed: Email/Mobile and password are required." };
  }

  const sanitizedIdentifier = sanitizeString(data.identifier);
  
  // Normalize identifier if it is a phone number (i.e. not an email)
  const isEmail = sanitizedIdentifier.includes("@");
  const loginSearchIdentifier = isEmail
    ? sanitizedIdentifier.toLowerCase()
    : sanitizedIdentifier.replace(/[\s\-\(\)\.]/g, "");

  try {
    // 1. Fetch user by email OR phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginSearchIdentifier },
          { phone: loginSearchIdentifier }
        ]
      }
    });

    if (!user) {
      return { success: false, error: "Authentication failed: Invalid credentials." };
    }

    // 2. Validate password match
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Authentication failed: Invalid credentials." };
    }

    // 3. Block login if email is not verified
    if (!user.emailVerified) {
      return { 
        success: false, 
        error: "Verification required: Please verify your email using the link sent to your inbox before logging in." 
      };
    }

    // 4. Set Http-Only Session Cookie for Next.js routing persistence
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
    };
  } catch (error: any) {
    console.error("Login Action Error Log:", error);
    return { success: false, error: "An internal database authentication error occurred." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}

export async function getSessionAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return { success: false };
  }

  try {
    const sessionUser = JSON.parse(sessionCookie.value);
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      }
    });

    if (!user) {
      return { success: false };
    }

    return { success: true, user };
  } catch {
    return { success: false };
  }
}

export async function verifyEmailAction(token: string) {
  if (!token) {
    return { success: false, error: "Verification failed: Token parameters are missing." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return { success: false, error: "Verification failed: The verification token is invalid or has expired." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Verify Email Action Error Log:", error);
    return { success: false, error: "Database error occurred during email verification." };
  }
}

export async function requestPasswordResetAction(email: string) {
  if (!email) {
    return { success: false, error: "Validation failed: Email address is required." };
  }

  const sanitizedEmail = sanitizeString(email).toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (!user) {
      return { success: true, message: "If the email is registered, a password reset link has been dispatched." };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    // Send Password Reset Email directly (Netlify serverless function support)
    try {
      await sendResetEmailDirect(user.email, user.name || "Developer", resetToken);
      console.log(`Direct SMTP: Password reset email successfully dispatched to ${user.email}`);
    } catch (smtpError) {
      console.error("Direct SMTP Dispatch Warning:", smtpError);
    }

    return { success: true, message: "If the email is registered, a password reset link has been dispatched." };
  } catch (error) {
    console.error("Request Password Reset Error Log:", error);
    return { success: false, error: "Internal server error occurred requesting password reset." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  if (!token || !newPassword) {
    return { success: false, error: "Validation failed: Reset token and password are required fields." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Validation failed: Password must be at least 6 characters long." };
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
      return { success: false, error: "Reset failed: The password reset link is invalid or has expired." };
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

    return { success: true };
  } catch (error) {
    console.error("Reset Password Action Error Log:", error);
    return { success: false, error: "Internal server error occurred resetting password." };
  }
}
