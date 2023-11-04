'use client'
import React, { useState } from 'react'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useGetPublicUser } from '@/queries/useQueries'

import PublicUserList from './PublicUserList'
import SearchName from './SearchName'

const ContentPublicUserList = () => {
  const [name, setName] = useState('')
  const {
    data: dataPublicUsers,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useGetPublicUser({
    limit: 20,
    name,
  })

  return (
    <div>
      <SearchName setName={setName} name={name} />
      <PublicUserList
        dataPublicUsers={dataPublicUsers}
        isFetching={isFetchingNextPage}
        isInitialLoading={isLoading}
      />

      <div className="w-full justify-center flex mt-4">
        {dataPublicUsers?.pages[dataPublicUsers?.pages.length - 1].hasMore ? (
          <Button
            disabled={isFetching || isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="w-[400px]"
          >
            {isFetching || isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Loading
              </>
            ) : (
              'Load More'
            )}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default ContentPublicUserList
