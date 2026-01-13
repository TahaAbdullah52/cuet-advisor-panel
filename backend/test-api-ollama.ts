import 'dotenv/config';
import { generateApprovalEmail } from './src/services/gemini.service';

/**
 * Test the same flow as the API endpoint without needing auth
 */
async function testAPIFlow() {
  console.log('🧪 Testing API Flow with Ollama\n');
  console.log('📌 AI_SERVICE =', process.env.AI_SERVICE);
  console.log('📌 OLLAMA_BASE_URL =', process.env.OLLAMA_BASE_URL);
  console.log('📌 OLLAMA_MODEL =', process.env.OLLAMA_MODEL);
  console.log('');
  
  const testCase = {
    studentName: 'Junain Uddin',
    latestTerm: 'L3T1',
    latestGPA: 3.79,
    overallCGPA: 3.73,
    decision: 'approved' as const
  };
  
  console.log(`📧 Generating ${testCase.decision} email for ${testCase.studentName}...`);
  console.log(`   Term: ${testCase.latestTerm}, GPA: ${testCase.latestGPA}, CGPA: ${testCase.overallCGPA}`);
  console.log('');
  
  const startTime = Date.now();
  
  try {
    // This is the same function called by the API endpoint
    const email = await generateApprovalEmail(
      testCase.studentName,
      testCase.latestTerm,
      testCase.latestGPA,
      testCase.overallCGPA,
      testCase.decision
    );
    
    const duration = Date.now() - startTime;
    console.log(`\n✅ Generated in ${(duration / 1000).toFixed(2)}s\n`);
    console.log('─'.repeat(80));
    console.log(email);
    console.log('─'.repeat(80));
    console.log('\n✅ API flow test successful!');
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.log(`\n❌ Failed after ${(duration / 1000).toFixed(2)}s`);
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testAPIFlow().catch(console.error);
