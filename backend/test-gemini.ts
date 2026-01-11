// Quick test script for Gemini API
import 'dotenv/config';
import { generateApprovalEmail } from './src/services/gemini.service';

async function testGemini() {
  console.log('🧪 Testing Gemini API...\n');
  
  try {
    const result = await generateApprovalEmail(
      'Md. Rafiul Islam',
      'L3T1',
      3.75,
      3.56,
      'approved'
    );
    
    console.log('✅ Success! Generated email:\n');
    console.log('─'.repeat(60));
    console.log(result);
    console.log('─'.repeat(60));
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
