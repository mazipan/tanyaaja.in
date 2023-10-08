import { ClassMap } from '@/lib/types'
import { cn, GRADIENTS } from '@/lib/utils'

export const GradientSelection = ({
  activeGradient,
  onClick,
}: {
  activeGradient: string
  onClick: (gradient: ClassMap) => void
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {GRADIENTS.map((gradient: ClassMap) => (
        <div
          key={gradient.id}
          className={cn(
            'h-8 w-8 border rounded-full cursor-pointer',
            gradient.class,
            activeGradient === gradient.id
              ? 'border-2 border-gray-900 dark:border-gray-100'
              : '',
          )}
          onClick={() => {
            onClick?.(gradient)
          }}
        ></div>
      ))}
    </div>
  )
}
