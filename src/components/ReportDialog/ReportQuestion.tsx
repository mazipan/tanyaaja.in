import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import type { User } from 'firebase/auth'
import {
  includes,
  maxLength,
  minLength,
  object,
  type Output,
  string,
} from 'valibot'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { DialogOrSheet } from '../DialogOrSheet'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useToast } from '../ui/use-toast'
import useSendReportQuestion from './useSendReportQuestion'

const schema = object({
  reason: string('Alasan perlu disi terlebih dahulu.', [
    minLength(20, 'Alasan butuh paling tidak 20 karakter.'),
    maxLength(1000, 'Alasan hanya bisa maksimal 1000 karakter.'),
    includes(' ', 'Alasan membutuhkan lebih dari satu kata.'),
  ]),
})

type FormValues = Output<typeof schema>

const STORAGE_KEY = 'ta_rq'
export const ReportQuestionDialog = ({
  user,
  uuid,
  isOpen,
  onOpenChange,
}: {
  uuid: string
  user: User
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}) => {
  const { toast } = useToast()
  const { mutate, isPending } = useSendReportQuestion()

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      reason: '',
    },
  })

  async function onSubmit(data: FormValues) {
    const storageVal = localStorage.getItem(STORAGE_KEY) || '[]'
    const reportedQuestions = JSON.parse(storageVal) as string[]

    if (!reportedQuestions.includes(uuid)) {
      mutate(
        { reason: data.reason, user, uuid },
        {
          onSuccess: () => {
            // Save new reported users to local storage
            const newStorageVal = [...reportedQuestions, uuid]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorageVal))

            onOpenChange(false)
          },
          onError: () => {
            toast({
              title: 'Gagal melaporkan pertanyaan',
              description:
                'Gagal saat mencoba melaporkan pertanyaan, coba sesaat lagi!',
            })
          },
        },
      )
    } else {
      toast({
        title: 'Sudah melaporkan pertanyaan',
        description:
          'Kami mendeteksi bahwa Anda sudah melaporkan pertanyaan ini sebelumnya.',
      })
    }
  }

  return (
    <DialogOrSheet
      title="Laporkan Pertanyaan"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      withAction={false}
    >
      <h2 className="mt-4">
        Apakah Anda yakin ingin melaporkan pertanyaan ini?
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-6"
        >
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alasan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      'Beritahu kami Alasan Anda melaporkan pertanyaan ini'
                    }
                    rows={7}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => {
                form.reset()
                onOpenChange(false)
              }}
            >
              Batalkan
            </Button>
            <Button type="submit" disabled={isPending}>
              Laporkan
            </Button>
          </div>
        </form>
      </Form>
    </DialogOrSheet>
  )
}
