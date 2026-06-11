import type { SendMailOptions, SentMessageInfo, Transporter } from "nodemailer";
import nodemailer from "nodemailer";

export interface GmailMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
  replyTo?: string;
}

export interface GmailMailConfig {
  user: string; // Your Gmail address
  pass: string; // App password (NOT your regular Gmail password)
  defaultFrom?: string; // Optional default from address
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
}

export class GmailMailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(config: GmailMailConfig) {
    if (!config.user || !config.pass) {
      throw new Error("Gmail user and app password are required");
    }

    this.defaultFrom = config.defaultFrom || config.user;

    // Create transporter with Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.pass // App password
      }
    });
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error: any) {
      console.error("SMTP connection verification failed:", error.message);
      return false;
    }
  }

  /**
   * Send a single email
   */
  async send(options: GmailMailOptions): Promise<SendResult> {
    try {
      const mailOptions: SendMailOptions = {
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(", ") : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc) : undefined,
        attachments: options.attachments,
        replyTo: options.replyTo
      };

      const info: SentMessageInfo = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error: any) {
      console.error("Email send error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send multiple emails in parallel
   */
  async sendBatch(emails: GmailMailOptions[]): Promise<{ success: boolean; results: SendResult[]; failed: number }> {
    const results = await Promise.allSettled(emails.map(email => this.send(email)));

    const successful = results.filter(r => r.status === "fulfilled" && r.value.success);
    const failed = results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && !r.value.success));

    return {
      success: failed.length === 0,
      results: results.map(r => (r.status === "fulfilled" ? r.value : { success: false, error: "Promise rejected" })),
      failed: failed.length
    };
  }

  /**
   * Send OTP/verification code email
   */
  async sendOtp(
    to: string,
    otpCode: string,
    options?: {
      expiryMinutes?: number;
      from?: string;
    }
  ): Promise<SendResult> {
    const expiryMinutes = options?.expiryMinutes || 10;
    const appName = process.env.APP_NAME || "Our Application";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ea4335; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${appName}</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Verification Code</h2>
              <p style="color: #4b5563; line-height: 1.5; margin-bottom: 30px;">
                Please use the following code to verify your account. This code will expire in ${expiryMinutes} minutes.
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otpCode}</span>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
                For security reasons, never share this code with anyone.
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Verification Code: ${otpCode}\n\nThis code will expire in ${expiryMinutes} minutes.\n\nIf you didn't request this code, please ignore this email.`;

    return this.send({
      to,
      subject: `Verification Code for ${appName}`,
      html,
      text,
      from: options?.from
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    userData: { name: string; [key: string]: any },
    options?: {
      from?: string;
      dashboardUrl?: string;
    }
  ): Promise<SendResult> {
    const appName = process.env.APP_NAME || "Our Application";
    const dashboardUrl = options?.dashboardUrl || "https://yourapp.com/dashboard";
    const name = userData.name || "there";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #34a853; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to ${appName}! 🎉</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
              <p style="color: #4b5563; line-height: 1.5; margin-bottom: 20px;">
                Thank you for joining ${appName}! We're thrilled to have you on board.
              </p>
              <p style="color: #4b5563; line-height: 1.5; margin-bottom: 30px;">
                Get started by exploring your dashboard and setting up your profile.
              </p>
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${dashboardUrl}" style="background-color: #34a853; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to,
      subject: `Welcome to ${appName}! 🎉`,
      html,
      from: options?.from
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    options?: {
      from?: string;
      resetUrl?: string;
      expiryHours?: number;
    }
  ): Promise<SendResult> {
    const appName = process.env.APP_NAME || "Our Application";
    const expiryHours = options?.expiryHours || 24;
    const resetUrl = options?.resetUrl || `https://yourapp.com/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #fbbc04; padding: 30px 20px; text-align: center;">
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Password Reset Request</h1>
            </div>
            <div style="padding: 40px 30px;">
              <p style="color: #4b5563; line-height: 1.5; margin-bottom: 20px;">
                We received a request to reset your password for your ${appName} account.
              </p>
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${resetUrl}" style="background-color: #4285f4; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; word-break: break-all; color: #4285f4; font-size: 12px;">
                ${resetUrl}
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ea4335; padding: 15px; margin-top: 20px;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  <strong>⚠️ Security note:</strong> This link will expire in ${expiryHours} hours.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to,
      subject: `Reset Your ${appName} Password`,
      html,
      from: options?.from
    });
  }

  /**
   * Send a simple test email
   */
  async sendTestEmail(to: string, options?: { from?: string }): Promise<SendResult> {
    return this.send({
      to,
      subject: "Test Email from Nodemailer + Gmail",
      html: "<h1>Test Email</h1><p>This is a test email sent using Nodemailer and Gmail SMTP.</p>",
      text: "This is a test email sent using Nodemailer and Gmail SMTP.",
      from: options?.from
    });
  }
}
