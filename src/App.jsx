import ImageUploader from './components/ImageUploader'
import ResultDisplay from './components/ResultDisplay'
import useImageUpload from './hooks/useImageUpload'
import './App.css'

function App() {
  const {
    preview,
    result,
    loading,
    error,
    handleImageChange,
    detectImage,
    clearImage,
    clearError,
  } = useImageUpload()

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ImgSherlock</h1>
        <p className="app-subtitle">AI Image Detector</p>
      </header>

      <main className="app-main">
        <section className="info-section">
          <p>
            Use multimodal LLM to detect AI-generated images.
          </p>
        </section>

        <section className="upload-section">
          <ImageUploader 
            onImageChange={handleImageChange} 
            preview={preview}
            error={error}
            onErrorDismiss={clearError}
          />
          
          <div className="action-buttons">
            <button 
              className="detect-button" 
              onClick={detectImage}
              disabled={!preview || loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
            
            {preview && (
              <button 
                className="clear-button" 
                onClick={clearImage}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {(loading || result) && (
          <ResultDisplay 
            result={result} 
            loading={loading} 
            error={error}
            onErrorDismiss={clearError}
          />
        )}

        {result && (
          <div className="disclaimer">
            <p>
              <strong>Note:</strong> This detection is based on AI analysis and may not be 100% accurate.
              The technology for creating and detecting AI-generated content is constantly evolving.
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  )
}

export default App
