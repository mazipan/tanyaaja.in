'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LockClosedIcon, PaperPlaneIcon } from '@radix-ui/react-icons'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { maxLength, minLength, object, type Output, string } from 'valibot'

// @ts-ignore
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { BASEURL, patchHit, postSendQuestion } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { UserProfile } from '@/lib/types'

const schema = object({
  q: string('Pertanyaan perlu disi terlebih dahulu.', [
    minLength(2, 'Pertanyaan butuh paling tidak 2 karakter.'),
    maxLength(500, 'Pertanyaan hanya bisa maksimal 1000 karakter.'),
  ]),
})

type FormValues = Output<typeof schema>

export function QuestionForm({ owner }: { owner: UserProfile }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      q: '',
    },
  })

  async function onSubmit(data: FormValues) {
    trackEvent('click submit new question')
    setIsLoading(true)
    try {
      await postSendQuestion(owner?.slug || '', data.q)
      setIsLoading(false)
      toast({
        title: 'Pesan terkirim',
        description: `Berhasil mengirimkan pertanyaan ke ${owner?.name}!`,
      })
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Pesan gagal terkirim',
        description: `Gagal mengirimkan pertanyaan ke ${owner?.name}, coba sesaat lagi!`,
      })
    }
  }

  useEffect(() => {
    if (owner && owner?.slug) {
      patchHit(owner.slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    trackEvent('view public page')
  }, [])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pertanyaan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Tulis pertanyaan yang ingin disampaikan ke ${owner?.name}`}
                    rows={7}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex items-center gap-2">
                  <LockClosedIcon /> Pertanyaanmu akan disampaikan secara anonim
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap justify-between gap-2">
            <Button type="submit" disabled={isLoading}>
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              {isLoading ? 'Sedang mengirim...' : 'Kirim pertanyaan'}
            </Button>

            {owner && owner?.slug ? (
              <ShareButton
                text={`Tanyakan apa aja ke saya`}
                title={`Kamu bisa tanyakan apa aja ke saya dengan anonim`}
                url={`${BASEURL}/p/${owner?.slug}`}
              />
            ) : null}
          </div>
        </form>
      </Form>
    </>
  )
}
