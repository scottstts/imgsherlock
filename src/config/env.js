/**
 * Application configuration based on environment
 */

// Dynamically determine environment based on hostname
const determineEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname === 'imgsherlock.xyz' || hostname.endsWith('.imgsherlock.xyz')) {
    return 'production';
  }
  
  // Default fallback
  return 'development';
};

const ENV = determineEnvironment();

const config = {
  // API URL for each environment
  apiUrl: {
    development: 'http://localhost:8000/api',
    test: 'http://localhost:8000/api',
    production: 'https://imgsherlock.xyz/api', // Relative URL for production (assumes API is on same domain)
  },
  
  // Feature flags
  features: {
    useMockApi: false, // Always use real API
    enableDetailedLogs: ENV !== 'production',
    enablePerformanceMetrics: true,
  },
  
  // Application settings
  app: {
    name: 'ImgSherlock',
    version: '1.0.0',
    maxUploadSizeMB: 10,
  },
};

export default {
  // Current environment
  env: ENV,
  
  // API URL for the current environment
  apiUrl: config.apiUrl[ENV] || config.apiUrl.development,
  
  // Feature flags for the current environment
  useMockApi: config.features.useMockApi,
  enableLogs: config.features.enableDetailedLogs,
  enableMetrics: config.features.enablePerformanceMetrics,
  
  // App settings
  appName: config.app.name,
  appVersion: config.app.version,
  maxUploadSizeMB: config.app.maxUploadSizeMB,
}; 