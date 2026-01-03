const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"GlobeTrotter" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: 'Your Password Reset OTP - GlobeTrotter',
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f9f9f9; border-radius: 12px; text-align: center;">
        <h2 style="color: #6366f1;">GlobeTrotter</h2>
        <h3>Password Reset Request</h3>
        <p>Use this OTP to reset your password:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #6366f1; background: #fff; padding: 20px; border-radius: 8px; display: inline-block; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <small style="color: #999;">© 2026 GlobeTrotter. All rights reserved.</small>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };