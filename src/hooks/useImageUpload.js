import { useState } from 'react';
import apiService from '../services/api';
import config from '../config/env';
import { validateImageFile } from '../utils/validation';

/**
 * Custom hook for handling image uploads and detection
 */
const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (file) => {
    setResult(null);
    setError(null);
    
    // Validate file
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }
      
      // Valid file, set image and generate preview
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // No file provided, clear everything
      clearImage();
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const detectImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    
    try {
      const detectionResult = await apiService.checkImage(image);
      setResult(detectionResult);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred during detection');
      console.error('Error detecting image:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    image,
    preview,
    result,
    loading,
    error,
    handleImageChange,
    detectImage,
    clearImage,
    clearError,
  };
};

export default useImageUpload; 