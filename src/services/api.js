import axios from 'axios';
import config from '../config/env';

// Create an axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor for logging in development
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging in development
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

const apiService = {
  /**
   * Upload an image to check if it's AI-generated
   * @param {File} image - The image file to upload
   * @returns {Promise} - Promise with the detection results
   */
  checkImage: async (image) => {
    // Check max image size
    const maxSizeBytes = config.maxUploadSizeMB * 1024 * 1024;
    if (image.size > maxSizeBytes) {
      throw new Error(`Image size exceeds the maximum allowed (${config.maxUploadSizeMB}MB)`);
    }
    
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await apiClient.post('/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking image:', error);
      throw error;
    }
  },
};

export default apiService; 