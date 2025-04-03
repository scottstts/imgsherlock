import './ResultDisplay.css';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
  
  // Parse result from the backend based on new JSON structure
  const isAiGenerated = result.result?.is_ai_generated === 1;
  
  // Get confidence level from the new structure
  let confidenceLevel;
  try {
    confidenceLevel = parseInt(result.result?.confidence_level);
    // Make sure it's within valid range
    if (isNaN(confidenceLevel) || confidenceLevel < 1 || confidenceLevel > 4) {
      confidenceLevel = isAiGenerated ? 3 : 1; // Default values based on AI generated status
    }
  } catch (e) {
    confidenceLevel = isAiGenerated ? 3 : 1; // Default values if parsing fails
  }
  
  // Get analysis aspects from the analyses object
  const aspectKeys = result.analyses ? Object.keys(result.analyses) : [];
  
  const toggleAspect = (key) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Get confidence level text
  const getConfidenceLevelText = (level) => {
    switch(level) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Very High';
      default: return 'Unknown';
    }
  };

  // Calculate color based on confidence level
  const getConfidenceColorClass = () => {
    if (isAiGenerated) {
      return confidenceLevel >= 3 ? 'high-confidence' : 'medium-confidence';
    }
    return 'low-confidence';
  };

  // For debugging
  console.log('Confidence level from backend:', result.result?.confidence_level);
  console.log('Parsed confidence level:', confidenceLevel);

  return (
    <div className="result-container">
      <div className={`result-card ${isAiGenerated ? 'ai-generated' : 'real-image'}`}>
        <h2 className="result-title">Detection Result</h2>
        <div className="result-badge">
          {isAiGenerated ? 'AI Generated' : 'Likely Real'}
        </div>
        
        <div className="confidence-meter">
          <div className="confidence-label">Confidence:</div>
          <div className="confidence-tier-container">
            {[1, 2, 3, 4].map((tier) => (
              <div 
                key={tier}
                className={`confidence-tier ${tier <= confidenceLevel ? getConfidenceColorClass() : ''}`} 
              ></div>
            ))}
          </div>
          <div className="confidence-level-text">{getConfidenceLevelText(confidenceLevel)}</div>
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
                  <div className="aspect-content markdown-content">
                    <ReactMarkdown>{result.analyses[key]}</ReactMarkdown>
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