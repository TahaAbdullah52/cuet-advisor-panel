// Test different model names
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('API Key exists:', !!GEMINI_API_KEY);

const modelNames = [
  'gemini-2.0-flash-exp',
  'gemini-exp-1206', 
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

async function testModels() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
  
  for (const modelName of modelNames) {
    try {
      console.log(`\n🧪 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      console.log(`✅ ${modelName} WORKS!`);
      console.log('Response:', result.response.text());
      break;  // Stop after first success
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message.substring(0, 100));
    }
  }
}

testModels();
