import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ResultDisplay = ({ result, loading, error, onErrorDismiss }) => {
  const [expandedKeys, setExpandedKeys] = useState({});

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p className="loading-text">Analyzing image...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner">
        <div className="error-content">
          <div className="error-title">Detection Error</div>
          <div className="error-message">{error}</div>
        </div>
        <button className="error-close" onClick={onErrorDismiss}>×</button>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const isAiGenerated = result.result?.is_ai_generated === 1;

  let confidenceLevel;
  try {
    confidenceLevel = parseInt(result.result?.confidence_level);
    if (isNaN(confidenceLevel) || confidenceLevel < 1 || confidenceLevel > 4) {
      confidenceLevel = isAiGenerated ? 3 : 1;
    }
  } catch {
    confidenceLevel = isAiGenerated ? 3 : 1;
  }

  const aspectKeys = result.analyses ? Object.keys(result.analyses) : [];

  const toggleAspect = (key) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getConfidenceLevelText = (level) => {
    switch (level) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Very High';
      default: return 'Unknown';
    }
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-verdict">
          <div className={`verdict-indicator ${isAiGenerated ? 'ai' : 'real'}`}></div>
          <span className="verdict-text">
            {isAiGenerated ? 'AI Generated' : 'Likely Real'}
          </span>
        </div>
        <span className="confidence-badge">
          {getConfidenceLevelText(confidenceLevel)} confidence
        </span>
      </div>

      <div className="result-body">
        {aspectKeys.length > 0 && (
          <div className="aspects">
            <h3 className="aspects-title">Analysis Details</h3>
            {aspectKeys.map(key => (
              <div key={key} className="aspect">
                <button
                  className="aspect-trigger"
                  onClick={() => toggleAspect(key)}
                >
                  <span style={{ textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="aspect-icon">
                    {expandedKeys[key] ? '−' : '+'}
                  </span>
                </button>
                {expandedKeys[key] && (
                  <div className="aspect-content">
                    <ReactMarkdown>{result.analyses[key]}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
