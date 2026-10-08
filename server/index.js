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
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ message: 'URL is required' })
  }

  return res.json({
    message: 'URL received successfully',
    url,
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
