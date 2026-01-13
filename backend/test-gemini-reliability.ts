import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash-latest' });

interface TestResult {
  testNumber: number;
  studentName: string;
  status: 'success' | 'failed';
  duration: number;
  error?: string;
}

async function testEmailGeneration(testNumber: number, studentName: string): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const prompt = `Write a brief approval email (80-100 words) from Dr. Academic Advisor, CSE Dept, CUET to ${studentName}.
Content: Approve registration for next semester. Mention L3T1 GPA: 3.75, CGPA: 3.70. Congratulate performance.
Format: "Dear ${studentName}," → body → "Best regards,\nDr. Academic Advisor\nCSE Department, CUET"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    const duration = Date.now() - startTime;

    if (!generatedText || generatedText.trim().length === 0) {
      return {
        testNumber,
        studentName,
        status: 'failed',
        duration,
        error: 'Empty response from Gemini'
      };
    }

    return {
      testNumber,
      studentName,
      status: 'success',
      duration
    };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      testNumber,
      studentName,
      status: 'failed',
      duration,
      error: error.message || 'Unknown error'
    };
  }
}

async function runReliabilityTest() {
  console.log('🧪 Testing Gemini API Reliability\n');
  console.log('Running 10 consecutive email generation requests...\n');

  const testStudents = [
    'Nusrat Jahan',
    'Tahsin Ahmed', 
    'Junain Uddin',
    'Rahul Dutta',
    'Taha Abdullah',
    'Farhan Khan',
    'Ayesha Siddiqua',
    'Mehedi Hasan',
    'Sadia Islam',
    'Karim Rahman'
  ];

  const results: TestResult[] = [];

  for (let i = 0; i < testStudents.length; i++) {
    process.stdout.write(`Test ${i + 1}/${testStudents.length}: ${testStudents[i]}... `);
    
    const result = await testEmailGeneration(i + 1, testStudents[i]);
    results.push(result);

    if (result.status === 'success') {
      console.log(`✅ ${(result.duration / 1000).toFixed(2)}s`);
    } else {
      console.log(`❌ ${(result.duration / 1000).toFixed(2)}s - ${result.error}`);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n📊 Results Summary:\n');
  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'failed').length;
  const successRate = (successCount / results.length) * 100;
  
  const successTimes = results.filter(r => r.status === 'success').map(r => r.duration);
  const avgTime = successTimes.length > 0 
    ? successTimes.reduce((a, b) => a + b, 0) / successTimes.length 
    : 0;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Successful: ${successCount} (${successRate.toFixed(1)}%)`);
  console.log(`❌ Failed: ${failCount} (${(100 - successRate).toFixed(1)}%)`);
  
  if (successTimes.length > 0) {
    console.log(`⏱️  Average Success Time: ${(avgTime / 1000).toFixed(2)}s`);
    console.log(`⏱️  Min Time: ${(Math.min(...successTimes) / 1000).toFixed(2)}s`);
    console.log(`⏱️  Max Time: ${(Math.max(...successTimes) / 1000).toFixed(2)}s`);
  }

  // Error analysis
  const failedResults = results.filter(r => r.status === 'failed');
  if (failedResults.length > 0) {
    console.log('\n🔍 Failed Tests Details:');
    failedResults.forEach(r => {
      console.log(`   Test ${r.testNumber} (${r.studentName}): ${r.error}`);
    });
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (successRate < 50) {
    console.log('   ⚠️  Low success rate! Check:');
    console.log('      1. Gemini API key validity');
    console.log('      2. API quota/billing status');
    console.log('      3. Network connectivity');
  } else if (successRate < 80) {
    console.log('   ⚠️  Moderate reliability. Consider:');
    console.log('      1. Implementing retry logic (2-3 attempts)');
    console.log('      2. Adding exponential backoff');
    console.log('      3. Monitoring API rate limits');
  } else {
    console.log('   ✅ Good reliability! Consider:');
    console.log('      1. Adding retry for failed requests');
    console.log('      2. Caching generated content for re-sends');
  }
}

runReliabilityTest().catch(console.error);
