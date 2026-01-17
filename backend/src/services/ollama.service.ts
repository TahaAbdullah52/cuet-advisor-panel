import 'dotenv/config';
import axios from 'axios';

// Ollama Configuration
// ====================
// IMPORTANT: Each developer can use their own Ollama model!
// 
// To use a different model:
// 1. Check your installed models: ollama list
// 2. Update OLLAMA_MODEL in .env file with YOUR model name
// 3. Examples: llama3:latest, mistral:latest, qwen2.5:7b, etc.
// 
// No need to share GGUF files - just share model names!
// See backend/OLLAMA_SETUP.md for detailed instructions.

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-7b-flirty:latest';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export const generateApprovalEmailWithOllama = async (
  studentName: string,
  latestTerm: string,
  latestGPA: number,
  overallCGPA: number,
  decision: 'approved' | 'rejected',
  advisorName: string = 'Dr. Academic Advisor'
): Promise<string> => {
  try {
    const prompt = decision === 'approved'
      ? `Write a brief professional approval email (80-100 words) from ${advisorName}, CSE Department, CUET to ${studentName}.

Content to include:
- Approve registration for next semester
- Mention ${latestTerm} GPA: ${latestGPA}
- Overall CGPA: ${overallCGPA}
- Congratulate on performance

Format:
Dear ${studentName},
[Body of approval message]
Best regards,
${advisorName}
CSE Department, CUET

Write only the email, no additional commentary.`
      : `Write a brief professional email (80-100 words) from ${advisorName}, CSE Department, CUET to ${studentName}.

Content to include:
- Registration needs review/discussion
- Mention ${latestTerm} GPA: ${latestGPA}
- Overall CGPA: ${overallCGPA}
- Suggest meeting to discuss improvement plan

Format:
Dear ${studentName},
[Body with constructive feedback]
Best regards,
${advisorName}
CSE Department, CUET

Write only the email, no additional commentary.`;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 500, // Maximum tokens to generate (prevents truncation)
        stop: ["---", "Note:", "P.S."], // Stop sequences to prevent extra content
      }
    }, {
      timeout: 60000
    });

    const data = response.data as OllamaResponse;
    
    console.log('📝 Ollama response metadata:', {
      model: data.model,
      done: data.done,
      responseLength: data.response?.length || 0,
      created_at: data.created_at
    });
    
    if (!data.response || data.response.trim().length === 0) {
      throw new Error('Empty response from Ollama');
    }
    
    const trimmedResponse = data.response.trim();
    console.log('📧 Generated email preview (first 100 chars):', trimmedResponse.substring(0, 100));
    console.log('📧 Generated email preview (last 100 chars):', trimmedResponse.substring(trimmedResponse.length - 100));
    
    // Check if response seems complete (should end with signature)
    const endsWithSignature = /Best regards|Sincerely|Regards/i.test(trimmedResponse.slice(-200));
    if (!endsWithSignature) {
      console.warn('⚠️ Email might be truncated - no signature found at end');
    }

    return trimmedResponse;

  } catch (error: any) {
    console.error('Ollama API error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      throw new Error('Ollama is not running. Please start Ollama service.');
    }
    
    if (error.response?.status === 404 || error.message?.includes('404') || error.message?.includes('model')) {
      throw new Error(`Model ${OLLAMA_MODEL} not found. Please pull it first: ollama pull ${OLLAMA_MODEL}`);
    }
    
    throw new Error(`Failed to generate email content with Ollama: ${error.message}`);
  }
};

export const checkOllamaStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const listOllamaModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 });
    
    if (response.status !== 200) {
      return [];
    }
    
    const data = response.data as any;
    return data.models?.map((m: any) => m.name) || [];
  } catch (error) {
    return [];
  }
};
