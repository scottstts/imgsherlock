import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 