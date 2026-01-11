// Check API key status
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function checkAPIKey() {
  console.log('🔍 API Key Check\n');
  console.log('Key found:', !!GEMINI_API_KEY);
  console.log('Key value:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 20)}...` : 'NOT FOUND');
  console.log('Key length:', GEMINI_API_KEY?.length || 0);
  
  console.log('\n📝 Instructions:');
  console.log('1. Go to: https://aistudio.google.com/app/apikey');
  console.log('2. Create or regenerate your API key');
  console.log('3. Make sure "Generative Language API" is enabled');
  console.log('4. Update GEMINI_API_KEY in .env file');
  
  if (!GEMINI_API_KEY) {
    console.log('\n❌ ERROR: GEMINI_API_KEY not found in environment');
    return;
  }
  
  // Try simple fetch to check key validity
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  
  try {
    console.log('\n🌐 Testing API endpoint...');
    const response = await fetch(url);
    console.log('Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data: any = await response.json();
      console.log('\n✅ API Key is valid!');
      console.log('Available models:', data.models?.length || 0);
      if (data.models) {
        console.log('\nFirst 5 models:');
        data.models.slice(0, 5).forEach((m: any) => {
          console.log(`  - ${m.name}`);
        });
      }
    } else {
      const error = await response.text();
      console.log('\n❌ API Error:', error);
    }
  } catch (error: any) {
    console.log('\n❌ Network error:', error.message);
  }
}

checkAPIKey();
