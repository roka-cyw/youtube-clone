import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

const storage = new Storage()

const rawVidsBucketName = 'raw-vids'
const processedVidsBucketName = 'pr-vids'

const localRawVidsPath = './raw-vids'
const localProcessedVidsPath = './p-vids'

/**
 * Creates the local directories for raw and processed vids
 */
export function setupDirectories() {
  ensureDirectoryExistence(localRawVidsPath)
  ensureDirectoryExistence(localProcessedVidsPath)
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVidsPath}
 * @param processedVideoName - The name of the file to conver to {@link localProcessedVidsPath}
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVidsPath}/${rawVideoName}`)
      .outputOption('-vf', 'scale=-1:360')
      .on('end', () => {
        console.log('Processing video completed.')
        resolve()
      })
      .on('error', err => {
        console.log(`An error occured: ${err.message}`)
        reject(err)
      })
      .save(`${localProcessedVidsPath}/${processedVideoName}`)
  })
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVidsBucketName} bucket into the {@link localRawVidsPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVidsBucketName)
    .file(fileName)
    .download({ destination: `${localRawVidsPath}/${fileName}` })

  console.log(`gs://${rawVidsBucketName}/${fileName} downloaded to ${localRawVidsPath}/${fileName}.`)
}

/**
 * @param fileName - The name of the file to upload from the
 * {@link localProcessedVidsPath} folder into the {@link processedVidsBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVidsBucketName)

  await bucket.upload(`${localProcessedVidsPath}/${fileName}`, { destination: fileName })

  console.log(`${localProcessedVidsPath}/${fileName} uploaded to gs://${processedVidsBucketName}/${fileName}.`)

  await bucket.file(fileName).makePublic()
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVidsPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 *
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVidsPath}/${fileName}`)
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localProcessedVidsPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 *
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVidsPath}/${fileName}`)
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Failed to delete file at ${filePath}`, err)
          reject(err)
        } else {
          console.log(`File deleted at ${filePath}`)
          resolve()
        }
      })
    } else {
      console.log(`File not found at ${filePath}, skipping delete.`)
      resolve()
    }
  })
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }) // recursive: true enables creating nested directories
    console.log(`Directory created at ${dirPath}`)
  }
}
