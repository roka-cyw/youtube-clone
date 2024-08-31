import express from 'express'
import ffmpeg from 'fluent-ffmpeg'

import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo
} from './storage'

setupDirectories()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/process-video', async (req, res) => {
  // Get the bucket and filename from the CLoud Pub/Sub message
  let data

  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8')
    data = JSON.parse(message)

    if (!data.name) {
      throw new Error('Invalid message payload received.')
    }
  } catch (error) {
    console.error(error)
    return res.status(400).send('Bad Request: missing filename.')
  }

  const inputFileName = data.name
  const outputFileName = `processed-${inputFileName}`

  // Download the raw video from CLoud Storage
  await downloadRawVideo(inputFileName)

  // Convert the video to 360q
  try {
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)])

    console.log(err)
    return res.status(500).send('Internal Server Error: video processing failed')
  }

  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName)

  Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)])

  return res.status(200).send('Processing completed')
})

app.listen(port, () => {
  console.log(`Listen ${port} port`)
})
