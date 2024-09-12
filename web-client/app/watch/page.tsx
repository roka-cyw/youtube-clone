import { Suspense } from 'react'
import VideoPlayer from './video-player'

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer />
    </Suspense>
  )
}
