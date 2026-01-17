import axios from 'axios';
import { 
  generateApprovalEmailWithOllama, 
  checkOllamaStatus, 
  listOllamaModels 
} from '../../src/services/ollama.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Ollama Service - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkOllamaStatus', () => {
    it('should return true when Ollama is running', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: {} });
      
      const result = await checkOllamaStatus();
      
      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/tags'),
        { timeout: 3000 }
      );
    });

    it('should return false when Ollama is not running', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      
      const result = await checkOllamaStatus();
      
      expect(result).toBe(false);
    });

    it('should return false on network timeout', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('ETIMEDOUT'));
      
      const result = await checkOllamaStatus();
      
      expect(result).toBe(false);
    });
  });

  describe('listOllamaModels', () => {
    it('should return list of model names', async () => {
      const mockModels = {
        models: [
          { name: 'qwen2.5-7b-flirty:latest' },
          { name: 'llama2:latest' },
        ]
      };
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockModels });
      
      const result = await listOllamaModels();
      
      expect(result).toEqual(['qwen2.5-7b-flirty:latest', 'llama2:latest']);
    });

    it('should return empty array when Ollama is not running', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      
      const result = await listOllamaModels();
      
      expect(result).toEqual([]);
    });

    it('should return empty array when models list is empty', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: { models: [] } });
      
      const result = await listOllamaModels();
      
      expect(result).toEqual([]);
    });
  });

  describe('generateApprovalEmailWithOllama', () => {
    it('should generate approval email successfully', async () => {
      const mockResponse = {
        model: 'qwen2.5-7b-flirty:latest',
        response: 'Dear John Doe,\n\nYour registration has been approved...\n\nBest regards,\nDr. Advisor',
        done: true,
        created_at: new Date().toISOString(),
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await generateApprovalEmailWithOllama(
        'John Doe',
        'L3T2',
        3.85,
        3.75,
        'approved',
        'Dr. Jane Smith'
      );
      
      expect(result).toContain('John Doe');
      expect(result).toContain('approved');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.objectContaining({
          model: expect.any(String),
          prompt: expect.stringContaining('John Doe'),
          stream: false,
        }),
        expect.any(Object)
      );
    });

    it('should generate disapproval email with constructive feedback', async () => {
      const mockResponse = {
        model: 'qwen2.5-7b-flirty:latest',
        response: 'Dear Jane Smith,\n\nAfter reviewing your performance...\n\nBest regards,\nDr. Advisor',
        done: true,
        created_at: new Date().toISOString(),
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
      
      const result = await generateApprovalEmailWithOllama(
        'Jane Smith',
        'L3T1',
        2.5,
        2.8,
        'rejected'
      );
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(50);
    });

    it('should throw error when Ollama is not running', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        code: 'ECONNREFUSED',
        message: 'Connection refused',
      });
      
      await expect(
        generateApprovalEmailWithOllama('John Doe', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('Ollama is not running');
    });

    it('should throw error when model not found', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Model not found',
      });
      
      await expect(
        generateApprovalEmailWithOllama('John Doe', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('not found');
    });

    it('should throw error when response is empty', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          model: 'qwen2.5-7b-flirty:latest',
          response: '',
          done: true,
        },
      });
      
      await expect(
        generateApprovalEmailWithOllama('John Doe', 'L3T2', 3.5, 3.6, 'approved')
      ).rejects.toThrow('Empty response from Ollama');
    });

    it('should include advisor name in generated email', async () => {
      const mockResponse = {
        model: 'qwen2.5-7b-flirty:latest',
        response: 'Dear John,\n\nApproved.\n\nBest regards,\nDr. Custom Advisor',
        done: true,
        created_at: new Date().toISOString(),
      };
      
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
      
      await generateApprovalEmailWithOllama(
        'John Doe',
        'L3T2',
        3.85,
        3.75,
        'approved',
        'Dr. Custom Advisor'
      );
      
      const callArgs = mockedAxios.post.mock.calls[0];
      const requestBody = callArgs[1] as any;
      
      expect(requestBody.prompt).toContain('Dr. Custom Advisor');
    });
  });

  describe('Email Content Quality', () => {
    it('should generate email with proper structure', async () => {
      const mockEmail = `Dear John Doe,

Based on your excellent performance in L3T2 with a GPA of 3.85, your registration is approved.

Best regards,
Dr. Jane Smith
CSE Department, CUET`;
      
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          model: 'qwen2.5-7b-flirty:latest',
          response: mockEmail,
          done: true,
        },
      });
      
      const result = await generateApprovalEmailWithOllama(
        'John Doe',
        'L3T2',
        3.85,
        3.75,
        'approved',
        'Dr. Jane Smith'
      );
      
      // Check email structure
      expect(result).toMatch(/^Dear\s+/);
      expect(result).toContain('Best regards');
      expect(result).toContain('Dr. Jane Smith');
    });
  });

  describe('Performance Tests', () => {
    it('should handle request within timeout', async () => {
      const mockResponse = {
        model: 'qwen2.5-7b-flirty:latest',
        response: 'Email content',
        done: true,
      };
      
      mockedAxios.post.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({ data: mockResponse }), 5000)
        )
      );
      
      const startTime = Date.now();
      await generateApprovalEmailWithOllama('John', 'L3T2', 3.5, 3.6, 'approved');
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(60000); // Should complete within 60s
    });
  });
});
