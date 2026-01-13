import 'dotenv/config';
import axios from 'axios';

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
  decision: 'approved' | 'rejected'
): Promise<string> => {
  try {
    const prompt = decision === 'approved'
      ? `Write a brief professional approval email (80-100 words) from Dr. Academic Advisor, CSE Department, CUET to ${studentName}.

Content to include:
- Approve registration for next semester
- Mention ${latestTerm} GPA: ${latestGPA}
- Overall CGPA: ${overallCGPA}
- Congratulate on performance

Format:
Dear ${studentName},
[Body of approval message]
Best regards,
Dr. Academic Advisor
CSE Department, CUET

Write only the email, no additional commentary.`
      : `Write a brief professional email (80-100 words) from Dr. Academic Advisor, CSE Department, CUET to ${studentName}.

Content to include:
- Registration needs review/discussion
- Mention ${latestTerm} GPA: ${latestGPA}
- Overall CGPA: ${overallCGPA}
- Suggest meeting to discuss improvement plan

Format:
Dear ${studentName},
[Body with constructive feedback]
Best regards,
Dr. Academic Advisor
CSE Department, CUET

Write only the email, no additional commentary.`;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    }, {
      timeout: 60000
    });

    const data = response.data as OllamaResponse;
    
    if (!data.response || data.response.trim().length === 0) {
      throw new Error('Empty response from Ollama');
    }

    return data.response.trim();

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
