import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'
import { Storage } from '@google-cloud/storage'
import { onCall } from 'firebase-functions/v2/https'

initializeApp()

const firestore = getFirestore('cln-yt-firestore')
const storage = new Storage()

const rawVideoBucketName = 'raw-bucket-vids'
const videoCollectionId = 'video'

export interface Video {
  id?: string
  uid?: string
  filename?: string
  status?: 'processing' | 'completed'
  title?: string
  description?: string
}

export const createUser = functions.auth.user().onCreate(user => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL
  }

  firestore.collection('users').doc(user.uid).set(userInfo)
  logger.info(`User Created: ${JSON.stringify(userInfo)}`)
  return
})

export const generateUploadUrl = onCall({ maxInstances: 1 }, async req => {
  if (!req.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'User must be authenticated')
  }

  const auth = req.auth
  const data = req.data
  const bucket = storage.bucket(rawVideoBucketName)

  // Get uniquie filename
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000 // 15 minutes
  })

  return { url, fileName }
})

export const getVideos = onCall({ maxInstances: 1 }, async () => {
  const snapshot = await firestore.collection(videoCollectionId).limit(10).get()
  return snapshot.docs.map(doc => doc.data())
})
