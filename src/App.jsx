import ImageUploader from './components/ImageUploader'
import ResultDisplay from './components/ResultDisplay'
import useImageUpload from './hooks/useImageUpload'
import { useState, useEffect } from 'react'
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
  
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      setShowScrollButton(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-title">
          <div className="logo-container">
            <img src="/logo.svg" alt="ImgSherlock Logo" className="app-logo" />
          </div>
          <div className="title-container">
            <h1>ImgSherlock</h1>
            <p className="app-subtitle">AI Image Detector</p>
          </div>
        </div>
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
            {!result && (
              <button 
                className="detect-button" 
                onClick={detectImage}
                disabled={!preview || loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            )}
            
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

      {showScrollButton && (
        <button 
          className="scroll-to-top scroll-button-appear"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <span className="arrow-icon">↑</span>
        </button>
      )}
    </div>
  )
}

export default App
