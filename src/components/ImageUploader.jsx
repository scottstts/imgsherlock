import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateImageFile, formatBytes } from '../utils/validation';
import config from '../config/env';
import ErrorMessage from './ErrorMessage';
import './ImageUploader.css';

const ImageUploader = ({ onImageChange, preview, error, onErrorDismiss }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onImageChange(acceptedFiles[0]);
      }
    },
    [onImageChange]
  );

  const onDropRejected = useCallback((rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      // Manually validate the file to provide a more specific error message
      const file = rejectedFiles[0].file;
      const validation = validateImageFile(file);
      
      if (!validation.isValid) {
        // Pass null for the file (to clear any previous file) and let the error be handled by the parent
        onImageChange(null);
      }
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: config.maxUploadSizeMB * 1024 * 1024,
  });

  return (
    <div className="uploader-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${preview ? 'has-preview' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <div className="overlay">Click or drag to replace</div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📷</div>
            <p>Drag & drop an image here, or click to select</p>
            <p className="upload-hint">
              Supported formats: JPG, JPEG, PNG (Max {config.maxUploadSizeMB}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && !preview && (
        <ErrorMessage 
          message={error} 
          onDismiss={onErrorDismiss}
        />
      )}
    </div>
  );
};

export default ImageUploader; 