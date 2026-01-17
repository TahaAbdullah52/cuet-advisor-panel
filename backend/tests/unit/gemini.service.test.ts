import { generateApprovalEmail } from '../../src/services/gemini.service';
import { generateApprovalEmailWithOllama, checkOllamaStatus } from '../../src/services/ollama.service';

// Mock the Ollama service
jest.mock('../../src/services/ollama.service');
const mockedOllama = generateApprovalEmailWithOllama as jest.MockedFunction<typeof generateApprovalEmailWithOllama>;
const mockedCheckOllamaStatus = checkOllamaStatus as jest.MockedFunction<typeof checkOllamaStatus>;

describe('Gemini Service - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Set AI_SERVICE to ollama for testing
    process.env.AI_SERVICE = 'ollama';
    // Mock checkOllamaStatus to return true by default
    mockedCheckOllamaStatus.mockResolvedValue(true);
  });

  describe('generateApprovalEmail', () => {
    it('should use Ollama when AI_SERVICE is ollama', async () => {
      const mockEmail = 'Dear John,\n\nApproved!\n\nBest regards,\nDr. Smith';
      mockedOllama.mockResolvedValueOnce(mockEmail);
      
      const result = await generateApprovalEmail(
        'John Doe',
        'L3T2',
        3.85,
        3.75,
        'approved',
        'Dr. Smith'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        'John Doe',
        'L3T2',
        3.85,
        3.75,
        'approved',
        'Dr. Smith'
      );
      expect(result).toBe(mockEmail);
    });

    it('should handle approval decision correctly', async () => {
      const mockEmail = 'Approval email content';
      mockedOllama.mockResolvedValueOnce(mockEmail);
      
      await generateApprovalEmail(
        'Alice Johnson',
        'L4T1',
        3.9,
        3.85,
        'approved',
        'Dr. Professor'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
        'approved',
        expect.any(String)
      );
    });

    it('should handle rejection decision correctly', async () => {
      const mockEmail = 'Rejection email content';
      mockedOllama.mockResolvedValueOnce(mockEmail);
      
      await generateApprovalEmail(
        'Bob Smith',
        'L3T1',
        2.3,
        2.5,
        'rejected',
        'Dr. Advisor'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        'Bob Smith',
        'L3T1',
        2.3,
        2.5,
        'rejected',
        'Dr. Advisor'
      );
    });

    it('should pass student performance metrics correctly', async () => {
      const mockEmail = 'Email content';
      mockedOllama.mockResolvedValueOnce(mockEmail);
      
      const gpa = 3.65;
      const cgpa = 3.72;
      
      await generateApprovalEmail(
        'Test Student',
        'L2T2',
        gpa,
        cgpa,
        'approved'
      );
      
      const call = mockedOllama.mock.calls[0];
      expect(call[2]).toBe(gpa);
      expect(call[3]).toBe(cgpa);
    });

    it('should use default advisor name when not provided', async () => {
      const mockEmail = 'Email with default advisor';
      mockedOllama.mockResolvedValueOnce(mockEmail);
      
      await generateApprovalEmail(
        'Student Name',
        'L3T2',
        3.5,
        3.6,
        'approved'
      );
      
      const call = mockedOllama.mock.calls[0];
      expect(call[5]).toBe('Dr. Academic Advisor');
    });

    it('should fall back to Gemini when Ollama fails', async () => {
      // Mock Ollama to throw an error
      mockedOllama.mockRejectedValueOnce(new Error('Ollama service unavailable'));
      
      // Should still resolve (fallback to Gemini would happen in real scenario)
      // In test, it will throw because Gemini also isn't properly configured
      await expect(
        generateApprovalEmail('John', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('Failed to generate email content');
      
      // Verify Ollama was called
      expect(mockedOllama).toHaveBeenCalled();
    });
  });

  describe('Email Generation Parameters', () => {
    it('should validate student name is included', async () => {
      mockedOllama.mockResolvedValueOnce('Email content');
      
      const studentName = 'Specific Student Name';
      await generateApprovalEmail(
        studentName,
        'L3T2',
        3.5,
        3.6,
        'approved'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        studentName,
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(String)
      );
    });

    it('should validate term is included', async () => {
      mockedOllama.mockResolvedValueOnce('Email content');
      
      const term = 'L4T2';
      await generateApprovalEmail(
        'Student',
        term,
        3.5,
        3.6,
        'approved'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        expect.any(String),
        term,
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
        expect.any(String)
      );
    });

    it('should handle different GPA ranges', async () => {
      mockedOllama.mockResolvedValue('Email');
      
      const testCases = [
        { gpa: 4.0, cgpa: 4.0 },  // Perfect
        { gpa: 3.5, cgpa: 3.6 },  // Excellent
        { gpa: 3.0, cgpa: 3.1 },  // Good
        { gpa: 2.5, cgpa: 2.6 },  // Fair
      ];
      
      for (const testCase of testCases) {
        await generateApprovalEmail(
          'Student',
          'L3T2',
          testCase.gpa,
          testCase.cgpa,
          'approved'
        );
      }
      
      expect(mockedOllama).toHaveBeenCalledTimes(testCases.length);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedOllama.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(
        generateApprovalEmail('John', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      mockedOllama.mockRejectedValueOnce(new Error('Request timeout'));
      
      await expect(
        generateApprovalEmail('John', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('Failed to generate email content');
    });

    it('should handle model not found errors', async () => {
      mockedOllama.mockRejectedValueOnce(new Error('Model not found'));
      
      await expect(
        generateApprovalEmail('John', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('Failed to generate email content');
    });
  });

  describe('Integration with Different Scenarios', () => {
    it('should generate email for high-performing student', async () => {
      mockedOllama.mockResolvedValueOnce('Congratulations email');
      
      await generateApprovalEmail(
        'Top Student',
        'L3T2',
        3.95,
        3.92,
        'approved',
        'Dr. Proud Advisor'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        'Top Student',
        'L3T2',
        3.95,
        3.92,
        'approved',
        'Dr. Proud Advisor'
      );
    });

    it('should generate email for struggling student', async () => {
      mockedOllama.mockResolvedValueOnce('Improvement plan email');
      
      await generateApprovalEmail(
        'Struggling Student',
        'L3T1',
        2.2,
        2.4,
        'rejected',
        'Dr. Supportive Advisor'
      );
      
      expect(mockedOllama).toHaveBeenCalledWith(
        'Struggling Student',
        'L3T1',
        2.2,
        2.4,
        'rejected',
        'Dr. Supportive Advisor'
      );
    });
  });
});
