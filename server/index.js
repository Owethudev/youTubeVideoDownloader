require('dotenv').config()

const cors = require('cors')
const express = require('express')

const app = express()
const port = process.env.PORT
const clientUrl = process.env.CLIENT_URL

if (!port || !clientUrl) {
  throw new Error('Set PORT and CLIENT_URL in the server environment before starting.')
}

app.use(cors({ origin: clientUrl }))
app.use(express.json())

app.post('/api/download', (req, res) => {
  const url = req.body?.url

  if (typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL' })
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL' })
  }

  const youtubeHosts = ['youtube.com', 'www.youtube.com', 'm.youtube.com']
  const shortHosts = ['youtu.be', 'www.youtu.be']
  const isHttpUrl = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  const isYouTubeVideo =
    (youtubeHosts.includes(parsedUrl.hostname) &&
      ((parsedUrl.pathname === '/watch' &&
        Boolean(parsedUrl.searchParams.get('v')?.trim())) ||
        /^\/shorts\/[^/]+\/?$/.test(parsedUrl.pathname))) ||
    (shortHosts.includes(parsedUrl.hostname) &&
      /^\/[^/]+\/?$/.test(parsedUrl.pathname))

  if (!isHttpUrl || !isYouTubeVideo) {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL' })
  }

  return res.json({
    message: 'URL received successfully',
    url,
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
