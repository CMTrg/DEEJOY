import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
    
      const verificationLink = `http://localhost:3000/verify-email?token=${token}`; // Replace with your actual frontend link
    
      const mailOptions = {
        from: `"DJOY" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `
          <h3>Email Verification</h3>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">${verificationLink}</a>
        `,
      };
    
      await transporter.sendMail(mailOptions);
};