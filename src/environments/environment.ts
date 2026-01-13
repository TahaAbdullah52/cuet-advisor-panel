export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: false, // Backend is ready
  mockDataDelay: 50, // Reduced delay for better UX
  features: {
    enableRefresh: true,
    showDataSource: true,
    enableBulkApproval: true
  }
};