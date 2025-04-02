import './ErrorMessage.css';

const ErrorMessage = ({ title = 'Error', message, onDismiss }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>
      </div>
      {onDismiss && (
        <button 
          className="error-dismiss-button" 
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 