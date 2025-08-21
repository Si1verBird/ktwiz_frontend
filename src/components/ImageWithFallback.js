'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ImageWithFallback({ src, alt, className, fallbackSrc, ...props }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isError, setIsError] = useState(false)

  const handleError = () => {
    if (!isError) {
      setIsError(true)
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      }
    }
  }

  if (isError && !fallbackSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">{alt || '이미지 없음'}</span>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  )
}
