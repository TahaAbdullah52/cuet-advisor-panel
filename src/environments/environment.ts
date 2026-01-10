export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: true, // Set to false when backend is ready
  mockDataDelay: 50, // Reduced delay for better UX
  features: {
    enableRefresh: true,
    showDataSource: true,
    enableBulkApproval: true
  }
};