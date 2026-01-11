import 'dotenv/config';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration on startup
transporter.verify((error, _success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service ready to send messages');
  }
});

/**
 * Send approval email to student
 * @param studentEmail - Student's email address
 * @param studentName - Student's name
 * @param emailContent - Generated email content from Gemini
 * @param approvalStatus - "approved" or "rejected"
 * @returns Success status
 */
export const sendApprovalEmail = async (
  studentEmail: string,
  _studentName: string,
  emailContent: string,
  approvalStatus: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const subject = approvalStatus === 'approved' 
      ? '✅ Semester Registration Approved'
      : '⚠️ Semester Registration Requires Attention';

    const mailOptions: Mail.Options = {
      from: {
        name: 'CUET CSE Department',
        address: process.env.GMAIL_USER || '',
      },
      to: studentEmail,
      subject: subject,
      text: emailContent, // Plain text version
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="background-color: ${approvalStatus === 'approved' ? '#4CAF50' : '#FF9800'}; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0;">${approvalStatus === 'approved' ? '✅ Registration Approved' : '⚠️ Registration Status'}</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.8; margin: 0;">${emailContent}</pre>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #f1f1f1; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; text-align: center;">
            <p style="margin: 0;">This is an automated email from CUET Advisor Panel.</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    
    // Handle specific SMTP errors
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check Gmail credentials.');
    }
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error connecting to email service.');
    }
    
    if (error.responseCode === 550) {
      throw new Error('Invalid recipient email address.');
    }
    
    throw new Error('Failed to send email. Please try again later.');
  }
};

/**
 * Send bulk approval emails to multiple students
 * @param recipients - Array of student email data
 * @returns Results array with success/failure status
 */
export const sendBulkApprovalEmails = async (
  recipients: Array<{
    email: string;
    name: string;
    content: string;
    status: 'approved' | 'rejected';
  }>
): Promise<Array<{ email: string; success: boolean; error?: string }>> => {
  const results = [];

  for (const recipient of recipients) {
    try {
      await sendApprovalEmail(
        recipient.email,
        recipient.name,
        recipient.content,
        recipient.status
      );
      results.push({ email: recipient.email, success: true });
    } catch (error: any) {
      results.push({
        email: recipient.email,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};
