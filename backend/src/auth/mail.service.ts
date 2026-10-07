import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'yashgupta5532@gmail.com',
        pass: process.env.EMAIL_PASS || 'ekgx lyox vqbr ulsk',
      },
    });
  }

  
  async sendSignupOtp(to: string, otp: string) {
    const mailOptions = {
      from: '"New Shree Ganpati Diesel Service" <' + (process.env.EMAIL_USER || 'yashgupta5532@gmail.com') + '>',
      to,
      subject: 'Verify Your Email - Ganpati Diesel Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; text-align: center; background-color: #ffffff;">
          
          <h2 style="color: #0B1B2B; font-size: 24px; margin-top: 20px; margin-bottom: 15px;">Welcome to New Shree Ganpati!</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Thank you for signing up. Please verify your email address using the following One-Time Password (OTP):
          </p>
          
          <div style="background-color: #f8fafc; border: 2px dashed #94a3b8; color: #0f172a; font-size: 36px; font-weight: 900; text-align: center; padding: 20px 30px; border-radius: 12px; margin: 20px auto 30px auto; letter-spacing: 12px; width: fit-content;">
            ${otp}
          </div>
          
          <img src="https://media.tenor.com/H_agTFXnkAYAAAAM/tow-tow-truck.gif" alt="Tow Truck Animation" style="width: 180px; margin: 0 auto 30px auto; display: block;" />

          <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
            This OTP is valid for <strong>15 minutes</strong>.
          </p>
          <p style="color: #a0aec0; font-size: 12px;">
            If you did not initiate this registration, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 14px; color: #4a5568; font-weight: bold;">New Shree Ganpati Diesel Service</p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetOtp(to: string, otp: string) {
    const mailOptions = {
      from: '"New Shree Ganpati Diesel Service" <' + (process.env.EMAIL_USER || 'yashgupta5532@gmail.com') + '>',
      to,
      subject: 'Password Reset OTP - Ganpati Diesel Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; text-align: center; background-color: #ffffff;">
          
          <h2 style="color: #0B1B2B; font-size: 24px; margin-top: 20px; margin-bottom: 15px;">Password Reset Request</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            You requested to reset your password. Use the following One-Time Password (OTP) to proceed:
          </p>
          
          <div style="background-color: #f8fafc; border: 2px dashed #94a3b8; color: #0f172a; font-size: 36px; font-weight: 900; text-align: center; padding: 20px 30px; border-radius: 12px; margin: 20px auto 30px auto; letter-spacing: 12px; width: fit-content;">
            ${otp}
          </div>
          
          <img src="https://media.tenor.com/H_agTFXnkAYAAAAM/tow-tow-truck.gif" alt="Tow Truck Animation" style="width: 180px; margin: 0 auto 30px auto; display: block;" />

          <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
            This OTP is valid for <strong>15 minutes</strong>.
          </p>
          <p style="color: #a0aec0; font-size: 12px;">
            If you did not request a password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 14px; color: #4a5568; font-weight: bold;">New Shree Ganpati Diesel Service</p>
        </div>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }
}
