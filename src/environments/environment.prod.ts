export const environment = {
  production: true,
  apiUrl: 'https://api.cuet.ac.bd/advisor',
  useMockData: false, // Use real API in production
  mockDataDelay: 0,
  features: {
    enableRefresh: true,
    showDataSource: false, // Hide data source indicator in production
    enableBulkApproval: true
  }
};