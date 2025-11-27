export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
// REMOVED: import { Resend } from "resend"
// ADDED: Nodemailer
import * as nodemailer from "nodemailer" 
import type { CustomerData } from "@/components/customer-data-modal"
import type { HearingTestResult } from "@/lib/hearing-test-data"

interface TestResultRequest {
  customerData: CustomerData
  testResults: HearingTestResult
  leftEarResults: { frequency: number; threshold: number }[]
  rightEarResults: { frequency: number; threshold: number }[]
}

export async function POST(request: Request) {
  try {
    const body: TestResultRequest = await request.json()
    const { customerData, testResults, leftEarResults, rightEarResults } = body

    if (!customerData || !testResults) {
      console.error(" Missing customer data or test results")
      return NextResponse.json({ error: "Missing customer data or test results" }, { status: 400 })
    }
    
    // --- NODEMAILER CREDENTIAL CHECK ---
    const gmailUser = process.env.GMAIL_USER
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
    const recipientEmail = process.env.RESEND_RECIPIENT_EMAIL || "adhamemad.oracle@gmail.com"

    if (!gmailUser || !gmailAppPassword) {
        console.error(" GMAIL_USER or GMAIL_APP_PASSWORD is not configured")
        return NextResponse.json(
          {
            error: "Email credentials not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to Netlify environment variables.",
            setupRequired: true,
          },
          { status: 500 }
        );
    }
    
    if (!recipientEmail) {
      console.error(" RESEND_RECIPIENT_EMAIL is not configured")
      return NextResponse.json(
        {
          error: "Email recipient not configured",
          details: "Please add RESEND_RECIPIENT_EMAIL to Netlify environment variables",
          setupRequired: true,
        },
        { status: 500 },
      )
    }

    // --- NODEMAILER TRANSPORTER SETUP ---
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser, 
            pass: gmailAppPassword, // The 16-character App Password
        },
    });

    // START OF NEW/UPDATED LOGIC: Calculate overall score and define variables
    // Calculate overall score based on all frequency results
    const leftEarThresholds = leftEarResults.map(r => r.threshold);
    const rightEarThresholds = rightEarResults.map(r => r.threshold);
    
    const allThresholds = [...leftEarThresholds, ...rightEarThresholds];
    // Average threshold across all data points
    const avgThreshold = allThresholds.reduce((sum, t) => sum + t, 0) / allThresholds.length;
    // Calculate the overall score percentage (1 is perfect, 0 is worst)
    const overallScorePercentage = Math.round((1 - avgThreshold) * 100);

    // Get the main assessment classification (e.g., "Severe Loss")
    const mainAssessmentClassification = testResults.overallAssessment.replace(/-/g, " ");

    // Format date
    const testDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Create beautiful HTML email (Content is unchanged)
    // FIX: Wrapped the HTML content in backticks (`) to form a valid template literal
    const htmlContent = 
`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #f3f4f6; }
          .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1); }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #0369a1 0%, #06b6d4 50%, #0d9488 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
          }
          .header h1 { font-size: 36px; font-weight: 700; margin-bottom: 10px; position: relative; z-index: 1; }
          .header p { font-size: 16px; opacity: 0.95; position: relative; z-index: 1; }
          
          /* Main content */
          .content { padding: 50px 40px; }
          
          /* Customer info box */
          .customer-info {
            background: linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 100%);
            border-left: 5px solid #0369a1;
            padding: 25px;
            margin-bottom: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(3, 105, 161, 0.1);
          }
          .customer-info h3 { color: #0369a1; font-size: 18px; margin-bottom: 20px; font-weight: 600; }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .info-item { }
          .info-label { font-weight: 600; color: #0369a1; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .info-value { color: #111827; font-size: 16px; font-weight: 500; }
          
          /* Results section */
          .results-section {
            background: white;
            padding: 40px;
            margin-bottom: 30px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          .results-section h2 { color: #111827; font-size: 24px; margin-bottom: 25px; border-bottom: 3px solid #06b6d4; padding-bottom: 15px; font-weight: 700; }
          
          /* Assessment box */
          .assessment-box {
            background: linear-gradient(135deg, #ecf0f1 0%, #f8f9fa 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
            border: 2px solid #0369a1;
          }
          .assessment-status { font-size: 28px; font-weight: 700; color: #0369a1; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
          .assessment-desc { font-size: 15px; color: #4b5563; font-weight: 500; }
          
          /* Frequency results */
          .frequency-results {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 25px;
          }
          .ear-results {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 25px;
            border-radius: 12px;
            border-left: 5px solid #06b6d4;
          }
          .ear-results h3 { color: #06b6d4; font-size: 18px; margin-bottom: 20px; text-align: center; font-weight: 700; }
          .frequency-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .frequency-item:last-child { border-bottom: none; }
          .freq-label { font-size: 13px; font-weight: 600; color: #374151; }
          .freq-bar {
            width: 45%;
            height: 10px;
            background: #e5e7eb;
            border-radius: 5px;
            overflow: hidden;
            margin: 0 12px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
          }
          .freq-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #0369a1 0%, #06b6d4 50%, #0d9488 100%);
            border-radius: 5px;
          }
          .freq-value { font-size: 13px; font-weight: 700; color: #0369a1; min-width: 40px; text-align: right; }
          
          /* Recommendations */
          .recommendations {
            background: linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%);
            border-left: 5px solid #0d9488;
            padding: 25px;
            border-radius: 12px;
            margin-top: 25px;
            box-shadow: 0 4px 6px rgba(13, 148, 136, 0.1);
          }
          .recommendations h3 { color: #0d9488; font-size: 18px; margin-bottom: 15px; font-weight: 700; }
          .recommendations ul { padding-left: 20px; }
          .recommendations li { margin-bottom: 10px; font-size: 14px; color: #374151; line-height: 1.6; }
          
          /* Footer */
          .footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 40px;
            text-align: center;
            font-size: 13px;
          }
          .footer p { margin-bottom: 10px; opacity: 0.9; }
          .footer a { color: #06b6d4; text-decoration: none; font-weight: 600; }
          .footer .disclaimer { margin-top: 25px; padding-top: 25px; border-top: 1px solid #374151; font-style: italic; color: #9ca3af; line-height: 1.8; }
          
          /* Responsive */
          @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
            .frequency-results { grid-template-columns: 1fr; }
            .header h1 { font-size: 28px; }
            .header, .content, .results-section, .customer-info, .recommendations, .footer { padding: 25px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Al-Barakat Hearing Care</h1>
            <p>Your Professional Hearing Test Results</p>
          </div>
          
          <div class="content">
            <div class="customer-info">
              <h3>Patient Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${customerData.name}</div>
                </div>
                <br>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">${customerData.age} years old</div>
                </div>
                <br>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${customerData.gender.charAt(0).toUpperCase() + customerData.gender.slice(1)}</div>
                </div>
                <br>
                <div class="info-item">
                  <div class="info-label">Mobile</div>
                  <div class="info-value">${customerData.mobile}</div>
                </div>
                <br>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${customerData.email}</div>
                </div>
                <br>
                <div class="info-item">
                  <div class="info-label">Nearest Location</div>
                  <div class="info-value">${customerData.selectedBranch?.city || "Not specified"}</div>
                </div>
              </div>
            </div>
            
            <div class="results-section">
              <h2>Test Results & Assessment</h2>
              
              <div class="assessment-box">
                <div class="assessment-status">${mainAssessmentClassification}</div>

                <div class="assessment-desc">${testResults.overallAssessment === "normal" ? "Your hearing test shows normal hearing levels." : "Your hearing test may indicate hearing concerns."}</div>
                
                <p style="font-size: 16px; margin-top: 15px; font-weight: 600; color: #4b5563;">Overall Good Hearing Score: ${overallScorePercentage}%</p>
              </div>
              <div class="frequency-results">
                <div class="ear-results">
                  <h3>👂 LEFT EAR</h3>
                  ${leftEarResults
                    .map(
                      (result) => `
                    <div class="frequency-item">
                      <span class="freq-label">${result.frequency} Hz</span>
                      <div class="freq-bar">
                        <div class="freq-bar-fill" style="width: ${(1 - result.threshold) * 100}%"></div>
                      </div>
                      <span class="freq-value">${Math.round((1 - result.threshold) * 100)}%</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
                
                <div class="ear-results">
                  <h3>👂 RIGHT EAR</h3>
                  ${rightEarResults
                    .map(
                      (result) => `
                    <div class="frequency-item">
                      <span class="freq-label">${result.frequency} Hz</span>
                      <div class="freq-bar">
                        <div class="freq-bar-fill" style="width: ${(1 - result.threshold) * 100}%"></div>
                      </div>
                      <span class="freq-value">${Math.round((1 - result.threshold) * 100)}%</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              
              <div class="recommendations">
                <h3>📋 Recommended Actions</h3>
                <ul>
                  ${testResults.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Hearing Test Completed:</strong> ${testDate}</p>
            <p>Al-Barakat Hearing Care Centers | Professional Hearing Healthcare</p>
            <div class="disclaimer">
              <p>⚠️ IMPORTANT DISCLAIMER: This online hearing test is a preliminary screening tool and does not replace a comprehensive audiological evaluation. Please consult with our certified audiologists for accurate diagnosis and personalized treatment recommendations.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // --- NODEMAILER SEND CALL ---
    const data = await transporter.sendMail({
      // The 'from' address MUST be your GMAIL_USER for Gmail's security to allow it
      from: `Al-Barakat Hearing Care <${gmailUser}>`, 
      to: recipientEmail,
      replyTo: customerData.email,
      subject: `Hearing Test Results - ${customerData.name}`,
      html: htmlContent,
    })

    console.log(" Hearing test results email sent successfully to", recipientEmail, "with ID:", data.messageId)

    return NextResponse.json({
      success: true,
      message: "Test results sent successfully",
      id: data.messageId,
      recipientEmail,
    })
  } catch (error: any) {
    console.error("[v0] Error sending test results email:", error.message)
    return NextResponse.json(
      {
        error: "Failed to send test results email",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}