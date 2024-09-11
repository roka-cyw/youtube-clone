'use client'

import { useSearchParams } from 'next/navigation'

export default function Watch() {
  const videoSrc = useSearchParams().get('v')
  const videoPrefix = 'https://storage.googleapis.com/pr-bucket-vids/'

  return (
    <div>
      <p>Watch Page</p>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  )
}

export const revalidate = 30
