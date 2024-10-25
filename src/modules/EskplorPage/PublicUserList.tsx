'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { InfiniteData } from '@tanstack/react-query'
import { Flag } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import { ProfileAvatar } from '@/components/ProfileAvatar'
import { ReportUserDialog } from '@/components/ReportDialog/ReportUser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { trackEvent } from '@/lib/firebase'
import type { IResponseGetPublicUserList } from '@/lib/types'
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

  const [isShowReportDialog, setIsShowReportDialog] = useState<boolean>(false)
  const [selectedUserName, setSelectedUserName] = useState<string>('')
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('')

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

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    disabled
                    size="icon"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                  <Button disabled type="button">
                    Tanya
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {dataPublicUsers?.pages && totalUser > 0 ? (
            <>
              <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
                Menampilkan {totalUser} pengguna
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
                            <h2 className="text-lg font-medium leading-none">
                              {up.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Telah dikunjungi{' '}
                              {new Intl.NumberFormat('id-ID').format(up.count)}{' '}
                              kali
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedUserName(up.name)
                                      setSelectedUserEmail(up.uid)
                                      setIsShowReportDialog(true)
                                    }}
                                  >
                                    <Flag className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Laporkan pengguna</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Button asChild>
                              <Link href={`/p/${up.slug}`}>Tanya</Link>
                            </Button>
                          </div>
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
                          Tanya
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
      <ReportUserDialog
        isOpen={isShowReportDialog}
        name={selectedUserName}
        email={selectedUserEmail}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedUserName('')
            setSelectedUserEmail('')
          }
          setIsShowReportDialog(isOpen)
        }}
      />
    </div>
  )
}
