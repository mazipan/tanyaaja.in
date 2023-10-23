import { useEffect, useState } from 'react'

import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface SearchNameProps {
  setName: React.Dispatch<React.SetStateAction<string>>
  name: string
}

const SearchName: React.FC<SearchNameProps> = ({ name, setName }) => {
  const [tempSearch, setTempSearch] = useState('')

  useEffect(() => {
    const debounce = () => {
      if (name === tempSearch) {
        return false
      }

      setName(tempSearch)
    }

    const toDebounce = setTimeout(() => {
      debounce()
    }, 500)

    return () => {
      clearTimeout(toDebounce)
    }
  }, [name, setName, tempSearch])

  return (
    <div className="relative h-fit mb-4 ">
      <Input
        placeholder="Cari Pengguna"
        className="pl-[50px]"
        value={tempSearch}
        onChange={(event) => setTempSearch(event.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white" />
    </div>
  )
}

export default SearchName
