import 'dotenv/config';
import { generateApprovalEmail } from './src/services/gemini.service';
import { sendApprovalEmail } from './src/services/email.service';

// Test data for a student
const testStudent = {
  name: 'Md. Rafiul Islam',
  email: 'u2104040@student.cuet.ac.bd',
  latestTerm: 'L3T1',
  latestGPA: 3.75,
  overallCGPA: 3.56,
  decision: 'approved' as 'approved' | 'rejected'
};

async function testEmailSending() {
  console.log('🔄 Testing Email Service...\n');
  console.log('Student Details:');
  console.log('- Name:', testStudent.name);
  console.log('- Email:', testStudent.email);
  console.log('- Latest Term:', testStudent.latestTerm);
  console.log('- Latest GPA:', testStudent.latestGPA);
  console.log('- Overall CGPA:', testStudent.overallCGPA);
  console.log('- Decision:', testStudent.decision.toUpperCase());
  console.log('\n---\n');

  try {
    // Step 1: Generate email content using Gemini
    console.log('📝 Step 1: Generating email content with Gemini AI...');
    const emailContent = await generateApprovalEmail(
      testStudent.name,
      testStudent.latestTerm,
      testStudent.latestGPA,
      testStudent.overallCGPA,
      testStudent.decision
    );

    console.log('✅ Email content generated successfully!\n');
    console.log('Generated Content:');
    console.log('---');
    console.log(emailContent);
    console.log('---\n');

    // Step 2: Send email using Nodemailer
    console.log('📧 Step 2: Sending email to', testStudent.email, '...');
    const emailSent = await sendApprovalEmail(
      testStudent.email,
      testStudent.name,
      emailContent,
      testStudent.decision
    );

    if (emailSent) {
      console.log('\n✅ SUCCESS! Email sent successfully!');
      console.log('📬 Check inbox:', testStudent.email);
    }

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testEmailSending();
