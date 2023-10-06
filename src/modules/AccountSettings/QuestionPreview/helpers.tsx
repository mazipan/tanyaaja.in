import { User } from 'firebase/auth'

import { Question, UserProfile } from '@/lib/types'

export interface QuestionPreviewProps {
  question: Question | null
  user: User | null
  owner: UserProfile | null
  onOpenChange: (open: boolean) => void
  isOpen: boolean
  onRefetch: () => void
}

export type ClassMap = {
  id: string
  class: string
}

export const GRADIENTS: ClassMap[] = [
  {
    id: 'hyper',
    class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
  },
  {
    id: 'oceanic',
    class: 'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
  },
  {
    id: 'pumkin',
    class: 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700',
  },
  {
    id: 'candy',
    class: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
  },
]

export const CARD_SCALES: ClassMap[] = [
  {
    id: 'fluid',
    class: 'w-[600px] text-2xl',
  },
  {
    id: '300px',
    class: 'w-[300px] h-[300px]',
  },
  {
    id: '400px',
    class: 'w-[400px] h-[400px]',
  },
  {
    id: '600px',
    class: 'w-[600px] h-[600px] text-2xl',
  },
  {
    id: '800px',
    class: 'w-[800px] h-[800px] text-3xl',
  },
]
