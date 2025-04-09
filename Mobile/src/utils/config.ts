import Constants from 'expo-constants';

// Define environment types
type Environment = 'development' | 'staging' | 'production';

// Get current environment
const getEnvironment = (): Environment => {
  if (__DEV__) return 'development';
  
  // For non-dev builds, check the releaseChannel
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  if (releaseChannel) {
    if (releaseChannel.indexOf('staging') !== -1) return 'staging';
    if (releaseChannel.indexOf('prod') !== -1) return 'production';
  }
  
  // Default to production if we can't determine
  return 'production';
};

// Current environment
const ENV: Environment = getEnvironment();

// API URL configuration
const API_CONFIG = {
  development: {
    API_URL: 'http://localhost:3000/api',
    IMAGE_UPLOAD_URL: 'http://localhost:3000/api/upload',
  },
  staging: {
    API_URL: 'https://staging-api.falafarm.com/api',
    IMAGE_UPLOAD_URL: 'https://staging-api.falafarm.com/api/upload',
  },
  production: {
    API_URL: 'https://api.falafarm.com/api',
    IMAGE_UPLOAD_URL: 'https://api.falafarm.com/api/upload',
  },
};

// Authentication configuration
const AUTH_CONFIG = {
  TOKEN_KEY: '@FalaFarmAuth:token',
  USER_KEY: '@FalaFarmAuth:user',
  REFRESH_TOKEN_KEY: '@FalaFarmAuth:refreshToken',
};

// Image handling configuration
const IMAGE_CONFIG = {
  COMPRESSION_QUALITY: 0.8,
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 1200,
};

// Export configuration
export default {
  ENV,
  IS_DEV: ENV === 'development',
  IS_STAGING: ENV === 'staging',
  IS_PROD: ENV === 'production',
  API: API_CONFIG[ENV],
  AUTH: AUTH_CONFIG,
  IMAGE: IMAGE_CONFIG,
  VERSION: Constants.expoConfig?.version || '1.0.0',
  BUILD_NUMBER: Constants.expoConfig?.extra?.buildNumber || '1',
}; 