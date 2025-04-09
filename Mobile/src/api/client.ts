import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get environment variables
const API_URL = __DEV__ 
  ? process.env.API_URL_DEV 
  : (process.env.NODE_ENV === 'staging' ? process.env.API_URL_STAGING : process.env.API_URL_PROD);

const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY || '@FalaFarmAuth:token';

// Create API client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': Platform.OS,
    'X-Client-Version': Constants.expoConfig?.version || '1.0.0',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response?.status === 401) {
      // Handle token refresh or logout logic here
      try {
        // Could implement token refresh here
        // If token refresh fails, or no refresh token available:
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        // Redirect to login screen logic would go here
      } catch (e) {
        console.error('Error handling unauthorized response:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 