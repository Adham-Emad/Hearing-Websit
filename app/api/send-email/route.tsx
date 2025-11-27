export const dynamic = "force-dynamic"; // prevents Next.js from running at build

import { NextResponse } from "next/server";
// 1. IMPORT NODEMAILER INSTEAD OF RESEND
import * as nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. DEFINE AND CHECK NODEMAILER ENVIRONMENT VARIABLES
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const recipientEmail = process.env.RESEND_RECIPIENT_EMAIL;

    if (!gmailUser || !gmailAppPassword) {
      console.error("[v0] GMAIL_USER or GMAIL_APP_PASSWORD is not configured");
      return NextResponse.json(
        {
          error: "Email credentials not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to environment variables.",
          setupRequired: true,
        },
        { status: 500 }
      );
    }
    
    // Check for the recipient email (still necessary)
    if (!recipientEmail) {
      console.error("[v0] RESEND_RECIPIENT_EMAIL is not configured");
      return NextResponse.json(
        {
          error: "Email recipient not configured. Please add RESEND_RECIPIENT_EMAIL to environment variables.",
          setupRequired: true,
        },
        { status: 500 }
      );
    }

    // 3. INITIALIZE NODEMAILER TRANSPORTER (SMTP Client)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser, // Your Gmail address
            pass: gmailAppPassword, // Your 16-character App Password
        },
    });

    // 4. SEND EMAIL USING NODEMAILER (Note: 'data' variable now contains Nodemailer response)
    const data = await transporter.sendMail({
      // The 'from' address MUST be your GMAIL_USER for Gmail's security to allow it
      from: `HearClear Contact <${gmailUser}>`, 
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0077be 0%, #005a8f 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0077be; border-radius: 4px; }
              .label { font-weight: bold; color: #0077be; margin-bottom: 5px; }
              .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; border: 1px solid #e0e0e0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">HearClear Website</p>
              </div>
              <div class="content">
                <div class="info-box">
                  <div class="label">From:</div>
                  <div>${name}</div>
                </div>
                <div class="info-box">
                  <div class="label">Email:</div>
                  <div><a href="mailto:${email}" style="color: #0077be; text-decoration: none;">${email}</a></div>
                </div>
                <div class="message-box">
                  <div class="label">Message:</div>
                  <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
                <div class="footer">
                  <p>This email was sent from the HearClear website contact form.</p>
                  <p>You can reply directly to this email to respond to ${name}.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("[v0] Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: data.messageId,
    });
  } catch (error: any) {
    console.error("[v0] Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}