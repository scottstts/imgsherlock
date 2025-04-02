import './ResultDisplay.css';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ResultDisplay = ({ result, loading, error, onErrorDismiss }) => {
  if (loading) {
    return (
      <div className="result-container loading">
        <LoadingSpinner size="large" message="Analyzing image with Gemini AI..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Detection Error" 
        message={error} 
        onDismiss={onErrorDismiss}
      />
    );
  }

  if (!result) {
    return null;
  }

  const { isAiGenerated, confidence, details } = result;
  
  // Calculate color based on confidence
  const getConfidenceColorClass = () => {
    if (isAiGenerated) {
      return confidence > 0.8 ? 'high-confidence' : 'medium-confidence';
    }
    return 'low-confidence';
  };

  return (
    <div className="result-container">
      <div className={`result-card ${isAiGenerated ? 'ai-generated' : 'real-image'}`}>
        <h2 className="result-title">Detection Result</h2>
        <div className="result-badge">
          {isAiGenerated ? 'AI Generated' : 'Likely Real'}
        </div>
        
        <div className="confidence-meter">
          <div className="confidence-label">Confidence:</div>
          <div className="confidence-bar-container">
            <div 
              className={`confidence-bar ${getConfidenceColorClass()}`} 
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
          <div className="confidence-percentage">{Math.round(confidence * 100)}%</div>
        </div>
        
        {details && (
          <div className="details-section">
            <h3>Analysis Details</h3>
            <p>{details}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay; 