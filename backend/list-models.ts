// List available Gemini models
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log('🔍 Listing available Gemini models...\n');
  console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Try a simple test with gemini-pro
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello');
    const response = result.response;
    console.log('\n✅ API Key is valid!');
    console.log('Test response:', response.text());
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check if API key is valid: https://aistudio.google.com/app/apikey');
    console.error('2. Ensure Gemini API is enabled');
    console.error('3. Try regenerating the API key');
  }
}

listModels();
