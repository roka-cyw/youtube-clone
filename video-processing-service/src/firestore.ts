import { credential } from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
import { Firestore, getFirestore } from 'firebase-admin/firestore'

initializeApp({ credential: credential.applicationDefault() })

const firestore: Firestore = getFirestore('cln-yt-firestore')

const videoCollectionId = 'video'

export interface Video {
  id?: string
  uid?: string
  filename?: string
  status?: 'processing' | 'completed'
  title?: string
  description?: string
}

async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get()
  return (snapshot.data() as Video) ?? {}
}

export function setVideo(videoId: string, video: Video) {
  return firestore.collection(videoCollectionId).doc(videoId).set(video, { merge: true })
}

export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId)
  return video?.status === undefined
}
