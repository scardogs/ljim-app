import nodemailer from "nodemailer";

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send registration approval email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.approvalLink - Registration approval link
 */
export const sendApprovalEmail = async ({ to, name, approvalLink }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "LJIM Admin"} <${
        process.env.EMAIL_USER
      }>`,
      to,
      subject: "Your Admin Access Request Has Been Approved! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Approved</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2D3748;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #2B6CB0;
              color: #ffffff !important;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #2C5282;
            }
            .info-box {
              background-color: #EBF8FF;
              border-left: 4px solid #3182CE;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E2E8F0;
              font-size: 14px;
              color: #718096;
              text-align: center;
            }
            .warning {
              background-color: #FFFAF0;
              border-left: 4px solid #DD6B20;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Registration Approved!</h1>
              <p style="color: #718096; font-size: 16px;">Lift Jesus International Ministries</p>
            </div>

            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Great news! Your request for admin access has been approved by our team.</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>Next Steps:</strong></p>
                <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Click the button below to complete your registration</li>
                  <li>Create a secure password for your account</li>
                  <li>Start managing the LJIM platform</li>
                </ol>
              </div>

              <div style="text-align: center;">
                <a href="${approvalLink}" class="button">
                  Complete Registration
                </a>
              </div>

              <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This link will expire in <strong>7 days</strong></li>
                  <li>For security, please complete your registration soon</li>
                  <li>If the button doesn't work, copy and paste this link: <br>
                    <code style="background: #fff; padding: 5px; display: inline-block; margin-top: 5px; word-break: break-all;">${approvalLink}</code>
                  </li>
                </ul>
              </div>

              <p>If you did not request admin access, please ignore this email or contact us immediately.</p>
            </div>

            <div class="footer">
              <p>This email was sent by LJIM Admin System<br>
              Please do not reply to this email</p>
              <p style="margin-top: 10px; font-size: 12px;">
                © ${new Date().getFullYear()} Lift Jesus International Ministries. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${name},

Great news! Your request for admin access to the LJIM platform has been approved.

To complete your registration, please visit the following link:
${approvalLink}

Important:
- This link will expire in 7 days
- Please complete your registration soon for security purposes
- If you did not request admin access, please ignore this email

Thank you,
LJIM Admin Team

---
This is an automated email. Please do not reply.
© ${new Date().getFullYear()} Lift Jesus International Ministries
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Approval email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw new Error(`Failed to send approval email: ${error.message}`);
  }
};

/**
 * Send registration rejection email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.reason - Rejection reason
 */
export const sendRejectionEmail = async ({ to, name, reason }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "LJIM Admin"} <${
        process.env.EMAIL_USER
      }>`,
      to,
      subject: "Update on Your Admin Access Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Request Update</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2D3748;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .info-box {
              background-color: #FFF5F5;
              border-left: 4px solid #E53E3E;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E2E8F0;
              font-size: 14px;
              color: #718096;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Admin Access Request Update</h1>
              <p style="color: #718096; font-size: 16px;">Lift Jesus International Ministries</p>
            </div>

            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Thank you for your interest in becoming an admin for the LJIM platform.</p>
              
              <p>After careful review, we are unable to approve your request at this time.</p>

              ${
                reason
                  ? `
                <div class="info-box">
                  <p style="margin: 0;"><strong>Reason:</strong></p>
                  <p style="margin: 10px 0 0 0;">${reason}</p>
                </div>
              `
                  : ""
              }

              <p>If you believe this is an error or would like to discuss this decision, please contact our admin team directly.</p>

              <p>Thank you for your understanding.</p>
            </div>

            <div class="footer">
              <p>This email was sent by LJIM Admin System<br>
              Please do not reply to this email</p>
              <p style="margin-top: 10px; font-size: 12px;">
                © ${new Date().getFullYear()} Lift Jesus International Ministries. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Dear ${name},

Thank you for your interest in becoming an admin for the LJIM platform.

After careful review, we are unable to approve your request at this time.

${reason ? `Reason: ${reason}` : ""}

If you believe this is an error or would like to discuss this decision, please contact our admin team directly.

Thank you for your understanding.

LJIM Admin Team

---
This is an automated email. Please do not reply.
© ${new Date().getFullYear()} Lift Jesus International Ministries
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Rejection email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending rejection email:", error);
    throw new Error(`Failed to send rejection email: ${error.message}`);
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("Email configuration error:", error);
    return { success: false, message: error.message };
  }
};
