import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [statusMessage, setStatusMessage] = useState('Ready to receive a YouTube URL.')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  function handleDownloadClick() {
    const submittedUrl = url.trim()

    setErrorMessage('')
    setSuccessMessage('')

    if (!submittedUrl) {
      setStatusMessage('Waiting for a YouTube URL.')
      setErrorMessage('Please paste a YouTube URL before continuing.')
      return
    }

    setStatusMessage('URL received. Downloading is not available in this phase.')
    setSuccessMessage(`React received this URL: ${submittedUrl}`)
  }

  return (
    <main className="page">
      <section className="downloader" aria-labelledby="page-title">
        <p className="eyebrow">Simple, quick, and local</p>
        <h1 id="page-title">YouTube Video Downloader</h1>
        <p className="description">
          Paste a YouTube video URL to get started. This interface is a preview;
          downloading is not connected yet.
        </p>

        <label className="url-label" htmlFor="video-url">
          YouTube URL
        </label>
        <div className="download-form">
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            autoComplete="url"
          />
          <button type="button" onClick={handleDownloadClick}>
            Download
          </button>
        </div>

        <div className="messages" aria-live="polite">
          <p className="status-message">
            <span className="message-label">Status</span>
            {statusMessage}
          </p>
          {errorMessage && (
            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
