'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

import { copyTextToClipboard } from '@/lib/utils'

import { Button } from './ui/button'
import { Input } from './ui/input'

export function CopyButton({
  text,
  withLabel = false,
  withInput = false,
  fullWidth = false,
}: {
  text: string
  withLabel?: boolean
  withInput?: boolean
  fullWidth?: boolean
}) {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className={`flex gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {withInput ? <Input value={text} readOnly /> : null}
      <Button
        variant="outline"
        className="flex gap-2 items-center"
        type="button"
        onClick={() => {
          setIsCopied(true)
          copyTextToClipboard(`${text}`)
          setTimeout(() => {
            setIsCopied(false)
          }, 3000)
        }}
      >
        {isCopied ? (
          <Check className="h-4 w-4 shrink-0" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
        {withLabel ? (
          <>{isCopied ? <span>Tersalin</span> : <span>Salin</span>}</>
        ) : null}
      </Button>
    </div>
  )
}
