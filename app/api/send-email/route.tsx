import { NextResponse } from "next/server"
import { Resend } from "resend"

// تمت إزالة تهيئة Resend من هذا المكان (Top-Level)
// حتى لا يتم تشغيله أثناء عملية البناء في Next.js/Netlify.

export async function POST(request: Request) {
  try {
    // 1. استخراج المتغيرات أولاً للتأكد من وجودها
    const apiKey = process.env.RESEND_API_KEY
    const recipientEmail = process.env.RESEND_RECIPIENT_EMAIL

    // 2. التحقق من مفاتيح البيئة (Environment Variables)
    if (!apiKey || !recipientEmail) {
      // Netlify يخبرنا أن هذا هو سبب فشل البناء
      console.error("[v0] CRITICAL: Missing RESEND_API_KEY or RESEND_RECIPIENT_EMAIL in environment.")
      return NextResponse.json(
        {
          error: "Email service not configured. Please add RESEND_API_KEY and RESEND_RECIPIENT_EMAIL to Netlify Environment variables.",
          setupRequired: true,
        },
        { status: 500 },
      )
    }

    // 3. تهيئة Resend داخل الدالة (يتم تنفيذه فقط عند الطلب)
    const resend = new Resend(apiKey)
    
    // 4. استخراج بيانات الطلب
    const { name, email, message } = await request.json()

    // 5. التحقق من الحقول المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields (name, email, message)" }, { status: 400 })
    }

    // 6. إرسال الإيميل
    const data = await resend.emails.send({
      from: "HearClear Contact <onboarding@resend.dev>", // Resend verified sender
      to: [recipientEmail],
      replyTo: email, // Customer's email for easy reply
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
    })

    console.log("[v0] Email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: data.id,
    })
  } catch (error: any) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 },
    )
  }
}