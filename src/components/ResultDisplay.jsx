import './ResultDisplay.css';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useState } from 'react';

const ResultDisplay = ({ result, loading, error, onErrorDismiss }) => {
  const [expandedKeys, setExpandedKeys] = useState({});
  
  if (loading) {
    return (
      <div className="result-container loading">
        <LoadingSpinner size="large" message="Analyzing image..." />
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
  
  // Parse result from the backend
  // The first key is always is_ai_generated, second is always confidence_score
  const isAiGenerated = result.is_ai_generated === 1;
  const confidenceScore = result.confidence_score;
  
  // Get the rest of the aspect keys (excluding is_ai_generated and confidence_score)
  const aspectKeys = Object.keys(result).filter(
    key => key !== 'is_ai_generated' && key !== 'confidence_score'
  );
  
  const toggleAspect = (key) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Calculate color based on confidence
  const getConfidenceColorClass = () => {
    if (isAiGenerated) {
      return confidenceScore > 80 ? 'high-confidence' : 'medium-confidence';
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
              style={{ width: `${confidenceScore}%` }}
            ></div>
          </div>
          <div className="confidence-percentage">{Math.round(confidenceScore)}%</div>
        </div>
        
        <div className="analysis-aspects">
          <h3>Analysis Aspects</h3>
          <ul className="aspect-list">
            {aspectKeys.map(key => (
              <li key={key} className="aspect-item">
                <div 
                  className={`aspect-header ${expandedKeys[key] ? 'expanded' : ''}`} 
                  onClick={() => toggleAspect(key)}
                >
                  <span className="aspect-name">{key.replace(/_/g, ' ')}</span>
                  <span className="toggle-icon">{expandedKeys[key] ? '−' : '+'}</span>
                </div>
                {expandedKeys[key] && (
                  <div className="aspect-content">
                    <p>{result[key]}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay; 