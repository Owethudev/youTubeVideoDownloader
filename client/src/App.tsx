import { useState, type FormEvent } from 'react'
import './App.css'

type DownloadResponse = {
  message: string
  url?: string
}

function App() {
  const [url, setUrl] = useState('')
  const [statusMessage, setStatusMessage] = useState('Ready to receive a YouTube URL.')
  const [errorMessage, setErrorMessage] = useState('')
  const [downloadResponse, setDownloadResponse] = useState<DownloadResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const submittedUrl = url.trim()

    setErrorMessage('')
    setDownloadResponse(null)

    if (!submittedUrl) {
      setStatusMessage('Waiting for a YouTube URL.')
      setErrorMessage('Please paste a YouTube URL before continuing.')
      return
    }

    setIsLoading(true)
    setStatusMessage('Sending URL to the server...')

    try {
      const response = await fetch('http://localhost:5000/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: submittedUrl }),
      })
      const data: DownloadResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'The server could not process the request.')
      }

      setDownloadResponse(data)
      setStatusMessage('The server received your URL. Video downloading is not available yet.')
    } catch (error) {
      setStatusMessage('The request could not be completed.')
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="downloader" aria-labelledby="page-title">
        <p className="eyebrow">Simple, quick, and local</p>
        <h1 id="page-title">YouTube Video Downloader</h1>
        <p className="description">
          Paste a YouTube video URL to send it to the server. Video downloading
          is not available yet.
        </p>

        <form className="download-form" onSubmit={handleDownload}>
          <label className="url-label" htmlFor="video-url">
            YouTube URL
          </label>
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            autoComplete="url"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Download'}
          </button>
        </form>

        <div className="messages" aria-live="polite" aria-busy={isLoading}>
          <p className="status-message">
            <span className="message-label">Status</span>
            {statusMessage}
          </p>
          {errorMessage && (
            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          )}
          {downloadResponse && (
            <div className="success-message">
              <p>{downloadResponse.message}</p>
              {downloadResponse.url && <p>URL: {downloadResponse.url}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
