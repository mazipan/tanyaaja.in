'use client'

import { useEffect, useState } from 'react'

import { Share2 } from 'lucide-react'

import { CopyButton } from './CopyButton'
import { TweetButton } from './TweetButton'
import { Button } from './ui/button'

export function ShareButton({
  url,
  title,
  text,
  fullWidth = false,
}: {
  text: string
  title: string
  url: string
  fullWidth?: boolean
}) {
  const [isSupportShare, setSupportShare] = useState<boolean>(false)

  const handleShare = () => {
    if (isSupportShare) {
      window.navigator.share({
        text,
        title,
        url,
      })
    } else {
      // Do fallback
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupportShare(typeof window.navigator.share !== 'undefined')
    }
  }, [])

  return (
    <div className={`flex items-center space-x-2 ${fullWidth ? 'w-full' : ''}`}>
      {isSupportShare ? (
        <Button
          variant="outline"
          type="button"
          className="flex gap-2 items-center"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Bagikan
        </Button>
      ) : (
        <>
          <CopyButton text={url} />
          {/* <Button
            variant="outline"
            type="button"
            className="flex gap-2 items-center"
            asChild
          >
            <a
              href={`https://api.whatsapp.com/send?text=${text}+%0A+${encodeURIComponent(
                url,
              )}`}
            >
              <ChatBubbleIcon className="h-4 w-4" />
            </a>
          </Button> */}
          <TweetButton url={url} hideLabel />
        </>
      )}
    </div>
  )
}
