import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

/**
 * Generate approval/disapproval email content using Gemini AI
 * @param studentName - Name of the student
 * @param latestTerm - Latest completed term (e.g., "L3T1")
 * @param latestGPA - GPA from latest term
 * @param overallCGPA - Overall CGPA
 * @param decision - "approved" or "rejected"
 * @returns Generated email content
 */
export const generateApprovalEmail = async (
  studentName: string,
  latestTerm: string,
  latestGPA: number,
  overallCGPA: number,
  decision: 'approved' | 'rejected'
): Promise<string> => {
  try {
    // Build prompt based on decision
    const tone = decision === 'approved' 
      ? 'congratulatory and encouraging'
      : 'constructive and supportive';

    const prompt = `You are Dr. Academic Advisor from the Department of Computer Science & Engineering at Chittagong University of Engineering & Technology (CUET).

Generate a formal, personalized academic email to ${decision === 'approved' ? 'approve' : 'inform about disapproval of'} a student's semester registration.

Student Details:
- Name: ${studentName}
- Latest Completed Semester: ${latestTerm}
- Latest Semester GPA: ${latestGPA}
- Overall CGPA: ${overallCGPA}
- Decision: ${decision.toUpperCase()}

Email Requirements:
1. Start with "Dear ${studentName},"
2. Use a ${tone} tone
3. Reference their specific academic performance (${latestTerm} GPA: ${latestGPA}, Overall CGPA: ${overallCGPA})
${decision === 'approved' 
  ? '4. Congratulate them on their performance\n5. Approve their registration for the next semester\n6. Encourage continued excellence'
  : '4. Express concern about their academic performance\n5. Explain that their registration needs reconsideration\n6. Suggest improvement steps (attend office hours, form study groups, seek tutoring)\n7. Offer support and guidance'
}
7. Keep it professional and concise (150-200 words)
8. End with:
   "Best regards,
   Dr. Academic Advisor
   Department of Computer Science & Engineering
   Chittagong University of Engineering & Technology"

Generate ONLY the email content, no subject line or additional text.`;

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
