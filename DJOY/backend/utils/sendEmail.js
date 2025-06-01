import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DJOY" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your DJOY Verification Code",
    html: `
      <h3>Email Verification</h3>
      <p>Use the following verification code to verify your email address:</p>
      <h2 style="color: #333;">${code}</h2>
      <p>Enter this code in the app to complete your registration.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Email sending failed:", error.response || error.message || error);
    throw new Error("Email sending failed");
  }
};

/**
 * Sends a password reset email with a secure link.
 * @param {string} email - The recipient's email address.
 * @param {string} token - The reset token.
 */
export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DJOY Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your DJOY Password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:8px;">
        <h2 style="color:#1976d2;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your DJOY password. Click the button below to proceed:</p>
        <a 
          href="${resetLink}" 
          target="_blank" 
          rel="noopener noreferrer"
          style="
            display:inline-block;
            padding:12px 20px;
            margin-top:10px;
            background-color:#1976d2;
            color:#ffffff;
            text-decoration:none;
            border-radius:5px;
            font-weight:bold;"
        >
          Reset Password
        </a>
        <p style="margin-top:20px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#888;font-size:12px;">This link will expire in 15 minutes.</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
        <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} DJOY. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Email sending failed:", error.response || error.message || error);
    throw new Error("Failed to send password reset email.");
  }
};
