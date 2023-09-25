'use client'

import Link from 'next/link'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

import { Button } from './ui/button'

export function RedirectButton({
  url,
  external = false,
}: {
  url: string
  external?: boolean
}) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <div className={`flex space-x-2`}>
      <Button
        variant="secondary"
        className="flex gap-2 items-center"
        type="button"
      >
        <Link href={url} {...externalProps}>
          <ArrowTopRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
