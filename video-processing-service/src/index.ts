import express from 'express'
import ffmpeg from 'fluent-ffmpeg'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/process-video', (req, res) => {
  // Get path of the video file from the request body
  const inputFilePath = req.body.inputFilePath
  const outputFilePath = req.body.outputFilePath

  if (!inputFilePath || !outputFilePath) {
    res.status(400).send('Bad request: Missing file path.')
  }

  ffmpeg(inputFilePath)
    .outputOption('-vf', 'scale=-1:360')
    .on('end', () => {
      return res.status(200).send('Processing video completed.')
    })
    .on('error', err => {
      console.log(`An error occured: ${err.message}`)
      res.status(500).send(`Internal sever error: ${err.message}`)
    })
    .save(outputFilePath)
})

app.listen(port, () => {
  console.log(`Listen ${port} port`)
})
