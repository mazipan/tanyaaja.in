import { TwitterIcon } from 'lucide-react'

import { Button } from './ui/button'

const POPUP_HEIGHT = 440
const POPUP_WIDTH = 620
const BASE_TW_INTENT_URL =
  'http://twitter.com/intent/tweet?text=Tanyakan apa aja ke saya'
const BASE_HASHTAG_PARAM = '&hashtags=tanyaaja,izinjawab'

export function TweetButton({
  url,
  hideLabel,
}: {
  url: string
  hideLabel?: boolean
}) {
  const handleClickOpenTweetIntent = () => {
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - POPUP_WIDTH) / 2 / systemZoom + dualScreenLeft
    const top = (height - POPUP_HEIGHT) / 2 / systemZoom + dualScreenTop

    window.open(
      `${BASE_TW_INTENT_URL}&url=${url}${BASE_HASHTAG_PARAM}`,
      '',
      ` popup=yes,
        scrollbars=no,
        resizable=yes,
        width=${POPUP_WIDTH / systemZoom}, 
        height=${POPUP_HEIGHT / systemZoom}, 
        top=${top}, 
        left=${left}
      `,
    )
  }

  return (
    <Button
      onClick={handleClickOpenTweetIntent}
      variant="outline"
      type="button"
      className="flex gap-2 items-center"
    >
      <TwitterIcon className="h-4 w-4" />
      {!hideLabel && 'Tweet'}
    </Button>
  )
}
