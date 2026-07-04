import dotenv from "dotenv";
import path from "path";
import { createClient } from "redis";
import nodemailer from "nodemailer";

// Load environment configurations
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const redisUrl = process.env.REDIS_URL;
const smtpUser = process.env.SMTP_USER || "roshanawatirak@gmail.com";
const smtpPass = process.env.SMTP_PASS || "grsv apfi pgch nfat";

if (!redisUrl) {
  console.error("Worker Error: REDIS_URL environment variable is missing.");
  process.exit(1);
}

// 1. Configure Nodemailer Transporter using Gmail App Credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass.replace(/\s+/g, ""), // strip formatting spaces from App Password
  },
});

// Verify email configuration on mount
transporter.verify((err, success) => {
  if (err) {
    console.error("Worker SMTP Verification Error:", err);
  } else {
    console.log("Worker SMTP Configuration: Google Mail SMTP channel ready.");
  }
});

// 2. Initialize Redis client dedicated to worker loop
const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  console.error("Worker Redis connection error:", err);
});

async function sendMail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: `"Project Factory" <${smtpUser}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent Success: Message ID ${info.messageId} sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Email Dispatch Error: Failed to send to ${to}:`, error);
    return false;
  }
}

// Render HTML Verification email template
function renderVerificationTemplate(name: string, token: string) {
  const verifyUrl = `http://localhost:3000/auth/verify?token=${token}`;
  return `
    <div style="font-family: sans-serif; background-color: #090a0c; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #4a4b50;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #5683da; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">PROJECT<span style="color: #ffffff;">FACTORY</span></h1>
        <p style="color: #95979e; font-size: 14px; margin-top: 5px;">Verify Your Workspace Email</p>
      </div>
      
      <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 20px;">Activate your account, ${name}!</h2>
      
      <p style="color: #a9a9aa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        You successfully signed up on Project Factory. To prevent unauthorized logins and secure your data, click the button below to verify your email.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #5683da; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(86, 131, 218, 0.4);">
          Verify Email Address
        </a>
      </div>

      <p style="color: #95979e; font-size: 13px; line-height: 1.6;">
        Or copy and paste this verification URL directly in your browser:<br/>
        <a href="${verifyUrl}" style="color: #5683da; text-decoration: underline;">${verifyUrl}</a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #4a4b50; margin: 30px 0;" />
      
      <p style="color: #95979e; font-size: 11px; text-align: center; margin: 0;">
        This is a secured verification dispatch from Upstash Redis Queue Worker.<br/>
        &copy; ${new Date().getFullYear()} Project Factory. All rights reserved.
      </p>
    </div>
  `;
}

// Render HTML Password Reset email template
function renderResetTemplate(name: string, token: string) {
  const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
  return `
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
        <a href="${resetUrl}" style="background-color: #ff8964; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(255, 137, 100, 0.4);">
          Set New Password
        </a>
      </div>

      <p style="color: #95979e; font-size: 13px; line-height: 1.6;">
        Or copy and paste this reset URL directly in your browser:<br/>
        <a href="${resetUrl}" style="color: #ff8964; text-decoration: underline;">${resetUrl}</a>
      </p>

      <p style="color: #95979e; font-size: 12px; margin-top: 20px;">
        If you did not initiate this request, you can safely ignore this email; your credentials will remain unchanged.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #4a4b50; margin: 30px 0;" />
      
      <p style="color: #95979e; font-size: 11px; text-align: center; margin: 0;">
        This is a secured verification dispatch from Upstash Redis Queue Worker.<br/>
        &copy; ${new Date().getFullYear()} Project Factory. All rights reserved.
      </p>
    </div>
  `;
}

async function startWorker() {
  console.log("Worker Queue: Initializing background queue listener...");
  await client.connect();
  console.log("Worker Queue: Connected to Upstash Redis.");

  while (true) {
    try {
      const job = await client.brPop("email_queue", 30);
      
      if (job) {
        console.log(`Worker Queue [Job Found]: Parsing queue item payload...`);
        const payload = JSON.parse(job.element);

        if (payload.type === "verification") {
          console.log(`Worker Dispatching: Sending verification email with link to ${payload.email}...`);
          const html = renderVerificationTemplate(payload.name, payload.token);
          await sendMail(payload.email, "Verify your Project Factory Account 🚀", html);
        } 
        else if (payload.type === "reset-password") {
          console.log(`Worker Dispatching: Sending password reset email with link to ${payload.email}...`);
          const html = renderResetTemplate(payload.name, payload.token);
          await sendMail(payload.email, "Reset your Project Factory Password 🔑", html);
        }
      }
    } catch (loopError) {
      console.error("Worker Loop warning, pausing 2s before retry:", loopError);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

startWorker().catch((err) => {
  console.error("Critical Worker Process Failure:", err);
  process.exit(1);
});
