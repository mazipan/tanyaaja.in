'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

import { InfiniteData } from '@tanstack/react-query'
import { MoveUpRight } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import { ProfileAvatar } from '@/components/ProfileAvatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { trackEvent } from '@/lib/firebase'
import { IResponseGetPublicUserList } from '@/lib/types'
import { calculatePageItemCount } from '@/lib/utils'

interface PublicUserListProps {
  dataPublicUsers: InfiniteData<IResponseGetPublicUserList> | undefined
  isFetching: boolean
  isInitialLoading: boolean
}
export default function PublicUserList({
  dataPublicUsers,
  isFetching,
  isInitialLoading,
}: PublicUserListProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    trackEvent('view eksplor page')
  }, [])

  const totalUser = calculatePageItemCount(dataPublicUsers?.pages ?? [])
  return (
    <div className="w-full flex flex-col gap-4">
      {isInitialLoading ? (
        <>
          <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
            Memuat data pengguna...
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="flex items-center justify-between space-x-4 p-4"
              >
                <ProfileAvatar
                  image="https://placehold.co/38x38.png"
                  name="U"
                  size="38"
                />
                <div className="w-full space-y-0.5">
                  <Skeleton className="h-2 w-[70px]" />
                  <Skeleton className="h-2 w-[100px]" />
                </div>

                <Button disabled type="button">
                  Kunjungi
                  <MoveUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {dataPublicUsers?.pages && totalUser > 0 ? (
            <>
              <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
                {totalUser} pengguna ditemukan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {dataPublicUsers?.pages.map((page, parentIndex) => {
                  return (
                    <React.Fragment key={parentIndex}>
                      {page.data.map((up) => (
                        <Card
                          key={up.slug}
                          className="flex items-center justify-between space-x-4 p-4"
                        >
                          <ProfileAvatar
                            image={up.image}
                            name={up.name}
                            size="38"
                          />
                          <div className="w-full space-y-0.5">
                            <h2 className="text-sm font-medium leading-none">
                              {up.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Telah dikunjungi {up.count} kali
                            </p>
                          </div>
                          <Button asChild>
                            <Link href={`/p/${up.slug}`}>
                              Kunjungi
                              <MoveUpRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </Card>
                      ))}
                    </React.Fragment>
                  )
                })}
                {isFetching
                  ? [1, 2, 3].map((item) => (
                      <Card
                        key={item}
                        className="flex items-center justify-between space-x-4 p-4"
                      >
                        <ProfileAvatar
                          image="https://placehold.co/38x38.png"
                          name="U"
                          size="38"
                        />
                        <div className="w-full space-y-0.5">
                          <Skeleton className="h-2 w-[70px]" />
                          <Skeleton className="h-2 w-[100px]" />
                        </div>

                        <Button disabled type="button">
                          Kunjungi
                          <MoveUpRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Card>
                    ))
                  : null}
              </div>
            </>
          ) : (
            <EmptyState
              title="Tidak ada satupun pengguna yang ditemukan"
              description="Maaf, tapi sepertinya tidak ada satupun pengguna yang tersedia dan telah mengijinkan untuk ditampilkan di laman ini"
            />
          )}
        </>
      )}
    </div>
  )
}
