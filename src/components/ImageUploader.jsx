import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateImageFile, formatBytes } from '../utils/validation';
import config from '../config/env';

const ImageUploader = ({ onImageChange, preview, error, onErrorDismiss }) => {
  const [sizeError, setSizeError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setSizeError(null);
      if (acceptedFiles && acceptedFiles.length > 0) {
        onImageChange(acceptedFiles[0]);
      }
    },
    [onImageChange]
  );

  const onDropRejected = useCallback((rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const file = rejectedFiles[0].file;
      const validation = validateImageFile(file);

      if (!validation.isValid) {
        onImageChange(null);

        if (file.size > config.maxUploadSizeMB * 1024 * 1024) {
          setSizeError(`File size (${formatBytes(file.size)}) exceeds maximum allowed size (${config.maxUploadSizeMB}MB)`);
        }
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
    <>
      {sizeError && (
        <div className="error-banner">
          <div className="error-content">
            <div className="error-title">File too large</div>
            <div className="error-message">{sizeError}</div>
          </div>
          <button className="error-close" onClick={() => setSizeError(null)}>×</button>
        </div>
      )}

      {error && !preview && (
        <div className="error-banner">
          <div className="error-content">
            <div className="error-title">Error</div>
            <div className="error-message">{error}</div>
          </div>
          <button className="error-close" onClick={onErrorDismiss}>×</button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${preview ? 'has-preview' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="preview-wrap">
            <img src={preview} alt="Preview" className="preview-img" />
            <div className="preview-overlay">Click or drag to replace</div>
          </div>
        ) : (
          <>
            <div className="dropzone-icon">↑</div>
            <div className="dropzone-text">
              <p>Drop image here or click to upload</p>
              <p className="dropzone-hint">
                JPG, PNG up to {config.maxUploadSizeMB}MB
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ImageUploader;
