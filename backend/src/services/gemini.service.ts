import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateApprovalEmailWithOllama, checkOllamaStatus } from './ollama.service';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_SERVICE = process.env.AI_SERVICE || 'ollama'; // Default to Ollama (free, no limits)

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Generate approval/disapproval email content using Gemini AI
 * @param studentName - Name of the student
 * @param latestTerm - Latest completed term (e.g., "L3T1")
 * @param latestGPA - GPA from latest term
 * @param overallCGPA - Overall CGPA
 * @param decision - "approved" or "rejected"
 * @param advisorName - Name of the advisor (default: "Dr. Academic Advisor")
 * @returns Generated email content
 */
export const generateApprovalEmail = async (
  studentName: string,
  latestTerm: string,
  latestGPA: number,
  overallCGPA: number,
  decision: 'approved' | 'rejected',
  advisorName: string = 'Dr. Academic Advisor'
): Promise<string> => {
  // Use Ollama if configured (free, no limits, runs locally)
  if (AI_SERVICE === 'ollama') {
    console.log('📝 Using Ollama (local model) for email generation...');
    console.log('🔍 AI_SERVICE =', AI_SERVICE);
    const ollamaAvailable = await checkOllamaStatus();
    console.log('🔍 Ollama status check result:', ollamaAvailable);
    
    if (ollamaAvailable) {
      try {
        console.log('🚀 Calling Ollama with:', { studentName, latestTerm, latestGPA, overallCGPA, decision, advisorName });
        const result = await generateApprovalEmailWithOllama(studentName, latestTerm, latestGPA, overallCGPA, decision, advisorName);
        console.log('✅ Ollama generated email successfully, length:', result.length);
        return result;
      } catch (error: any) {
        console.error('❌ Ollama failed with error:', error);
        console.error('Error stack:', error.stack);
        // Continue to Gemini fallback
      }
    } else {
      console.warn('⚠️  Ollama not available, falling back to Gemini');
    }
  }

  // Use Gemini API (has quota limits)
  console.log('📝 Using Gemini API for email generation...');
  
  try {
    const prompt = decision === 'approved'
      ? `Write a brief approval email (80-100 words) from ${advisorName}, CSE Dept, CUET to ${studentName}.
Content: Approve registration for next semester. Mention ${latestTerm} GPA: ${latestGPA}, CGPA: ${overallCGPA}. Congratulate performance.
Format: "Dear ${studentName}," → body → "Best regards,\n${advisorName}\nCSE Department, CUET"`
      : `Write a brief email (80-100 words) from ${advisorName}, CSE Dept, CUET to ${studentName}.
Content: Registration needs review. Mention ${latestTerm} GPA: ${latestGPA}, CGPA: ${overallCGPA}. Suggest meeting to discuss improvement plan.
Format: "Dear ${studentName}," → body → "Best regards,\n${advisorName}\nCSE Department, CUET"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();

    return generatedText;

  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // Handle specific errors
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key configuration');
    }
    
    if (error.message?.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    if (error.message?.includes('network') || error.message?.includes('ECONNREFUSED')) {
      throw new Error('Network error connecting to Gemini API');
    }
    
    // Generic fallback
    throw new Error('Failed to generate email content. Please try again.');
  }
};
