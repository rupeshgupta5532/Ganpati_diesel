const fs = require('fs');
const file = 'src/auth/mail.service.ts';
let code = fs.readFileSync(file, 'utf8');

const sendSignupOtpCode = `
  async sendSignupOtp(to: string, otp: string) {
    const mailOptions = {
      from: '"New Shree Ganpati Diesel Service" <' + (process.env.EMAIL_USER || 'yashgupta5532@gmail.com') + '>',
      to,
      subject: 'Verify Your Email - Ganpati Diesel Service',
      html: \`
        <div style="font-family: Arial, sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0B1B2B; text-align: center;">Welcome to New Shree Ganpati!</h2>
          <p>Hello,</p>
          <p>Thank you for signing up. Please verify your email address using the following One-Time Password (OTP):</p>
          <div style="background-color: #F5A623; color: #0B1B2B; font-size: 24px; font-weight: bold; text-align: center; padding: 10px; border-radius: 4px; margin: 20px 0; letter-spacing: 4px;">
            \${otp}
          </div>
          <p>This OTP is valid for <strong>15 minutes</strong>.</p>
          <p>If you did not initiate this registration, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">New Shree Ganpati Diesel Service</p>
        </div>
      \`
    };

    return this.transporter.sendMail(mailOptions);
  }
`;

if (!code.includes('sendSignupOtp')) {
  code = code.replace(
    /async sendPasswordResetOtp/,
    `${sendSignupOtpCode}\n\n  async sendPasswordResetOtp`
  );
  fs.writeFileSync(file, code);
}
