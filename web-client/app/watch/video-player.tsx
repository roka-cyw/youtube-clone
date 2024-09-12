'use client'

import { useSearchParams } from 'next/navigation'

export default function VideoPlayer() {
  const videoPrefix = 'https://storage.googleapis.com/pr-bucket-vids/'
  const searchParams = useSearchParams()
  const videoSrc = searchParams.get('v')

  return (
    <div>
      <p>Watch Page</p>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  )
}
