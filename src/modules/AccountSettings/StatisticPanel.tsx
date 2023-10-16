import { Link } from 'lucide-react'

import { CopyButton } from '@/components/CopyButton'
import { TweetButton } from '@/components/TweetButton'
import { Card } from '@/components/ui/card'
import { BASEURL } from '@/lib/api'
import { UserProfile } from '@/lib/types'

export const StatisticPanel = ({ owner }: { owner?: UserProfile | null }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative p-4 flex flex-col justify-between">
        <h3 className="font-semibold leading-none tracking-tight">
          Total kunjungan
        </h3>
        <p className="text-4xl font-extrabold">
          {new Intl.NumberFormat('id-ID').format(owner?.count || 0)}
        </p>
        <small className="font-light text-xs">
          Jumlah orang yang mengunjungi laman publik
        </small>
      </Card>

      <Card className="relative p-4 flex flex-col justify-between">
        <h3 className="font-semibold leading-none tracking-tight">
          Laman Publik
        </h3>
        <div className="flex gap-2 items-center mt-4">
          <Link className="shrink-0 h-4 w-4" />
          <a
            className="underline text-sm truncate"
            href={`${BASEURL}/p/${owner?.slug || '...'}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BASEURL}/p/{owner?.slug || '...'}
          </a>
        </div>
        <div className="mt-4 flex gap-2">
          <CopyButton
            text={`${BASEURL}/p/${owner?.slug || '...'}`}
            withLabel={true}
          />

          <TweetButton url={`${BASEURL}/p/${owner?.slug || '...'}`} />
        </div>
      </Card>
    </div>
  )
}
