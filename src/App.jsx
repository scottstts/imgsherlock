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
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <img src="/logo.png" alt="" className="logo-img" />
            <span className="logo-text">ImgSherlock</span>
          </div>
          <span className="header-tag">AI Detection</span>
        </div>
      </header>

      <main className="main">
        <div className="main-inner">
          <div className="hero">
            <h1 className="hero-title">
              Detect <span>AI-generated</span> images
            </h1>
            <p className="hero-desc">
              Detecting AI images requires more than finding artifacts, you need reasoning on the image content too.
            </p>
          </div>

          <div className="upload-zone">
            <ImageUploader
              onImageChange={handleImageChange}
              preview={preview}
              error={error}
              onErrorDismiss={clearError}
            />

            <div className="actions">
              {!result && (
                <button
                  className="btn btn-primary"
                  onClick={detectImage}
                  disabled={!preview || loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              )}

              {preview && (
                <button
                  className="btn btn-secondary"
                  onClick={clearImage}
                  disabled={loading}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {(loading || result) && (
            <div className="results">
              <ResultDisplay
                result={result}
                loading={loading}
                error={error}
                onErrorDismiss={clearError}
              />
            </div>
          )}

          {result && (
            <div className="disclaimer">
              <strong>Note:</strong> This detection is based on AI analysis and may not be 100% accurate. The technology for creating and detecting AI-generated content is constantly evolving.
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        Powered by Google Gemini
      </footer>

      <button
        className={`scroll-top ${showScrollButton ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  )
}

export default App
