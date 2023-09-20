import { CopyButton } from '@/components/CopyButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const QuestionLoader = ({ index }: { index: number }) => {
  return (
    <Card key={index} className="min-h-[200px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Memuat Pertanyaan #{index}</CardTitle>
        <div className="flex gap-1 items-center">
          <Skeleton className="h-2 w-[180px]" />
        </div>
        <div className="flex gap-1 items-center">
          <Skeleton className="h-2 w-[120px]" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>

      <CardFooter className="justify-end space-x-2">
        <CopyButton text={``} withLabel />
        <Button disabled>Selengkapnya</Button>
      </CardFooter>
    </Card>
  )
}
