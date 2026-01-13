import 'dotenv/config';
import { generateApprovalEmailWithOllama, checkOllamaStatus, listOllamaModels } from './src/services/ollama.service';

async function testOllama() {
  console.log('🧪 Testing Ollama Email Generation\n');
  
  // Check status
  console.log('1️⃣  Checking Ollama status...');
  const isAvailable = await checkOllamaStatus();
  console.log(`   ${isAvailable ? '✅ Ollama is running' : '❌ Ollama is not running'}\n`);
  
  if (!isAvailable) {
    console.log('Please start Ollama first!');
    return;
  }
  
  // List models
  console.log('2️⃣  Available models:');
  const models = await listOllamaModels();
  models.forEach(model => console.log(`   - ${model}`));
  console.log('');
  
  // Test email generation
  console.log('3️⃣  Testing email generation...\n');
  
  const testCases = [
    {
      name: 'Junain Uddin',
      term: 'L3T1',
      gpa: 3.79,
      cgpa: 3.73,
      decision: 'approved' as const
    },
    {
      name: 'Rahul Dutta',
      term: 'L2T2',
      gpa: 2.95,
      cgpa: 3.02,
      decision: 'rejected' as const
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`📧 Generating ${testCase.decision} email for ${testCase.name}...`);
    const startTime = Date.now();
    
    try {
      const email = await generateApprovalEmailWithOllama(
        testCase.name,
        testCase.term,
        testCase.gpa,
        testCase.cgpa,
        testCase.decision
      );
      
      const duration = Date.now() - startTime;
      console.log(`✅ Generated in ${(duration / 1000).toFixed(2)}s\n`);
      console.log('─'.repeat(60));
      console.log(email);
      console.log('─'.repeat(60));
      console.log('');
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log('\n✅ Ollama test complete!');
  console.log('\n💡 Benefits of using Ollama:');
  console.log('   - ✅ Runs locally (no internet needed)');
  console.log('   - ✅ Free forever (no API costs)');
  console.log('   - ✅ No rate limits or quotas');
  console.log('   - ✅ Fast response times');
  console.log('   - ✅ Privacy (data never leaves your machine)');
}

testOllama().catch(console.error);
