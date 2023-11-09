'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Script from 'next/script'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2, Lock, SendHorizontal } from 'lucide-react'
import {
  includes,
  maxLength,
  minLength,
  object,
  type Output,
  string,
} from 'valibot'

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
import { BASEURL, patchHit } from '@/lib/api'
import { isErrorResponse } from '@/lib/error'
import { trackEvent } from '@/lib/firebase'
import { getValueFromStorage, setValueToStorage } from '@/lib/storage'
import { UserProfile } from '@/lib/types'
import useSendQuestion from '@/modules/PublicQuestionPage/hooks/useSendQuestion'

const LAST_QUESTION_KEY = 'last_question'

const schema = object({
  q: string('Pertanyaan perlu disi terlebih dahulu.', [
    minLength(2, 'Pertanyaan butuh paling tidak 2 karakter.'),
    maxLength(500, 'Pertanyaan hanya bisa maksimal 1000 karakter.'),
    includes(' ', 'Pertanyaan membutuhkan lebih dari satu kata.'),
  ]),
})

type FormValues = Output<typeof schema>

export function QuestionForm({ owner }: { owner: UserProfile }) {
  const { toast } = useToast()
  const { mutate, isPending } = useSendQuestion()

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      q: '',
    },
  })

  async function sendQuestion(slug: string, q: string, token: string) {
    const lastQuestion = getValueFromStorage(LAST_QUESTION_KEY)
    if (q === lastQuestion) {
      toast({
        title: 'Pesan gagal terkirim',
        description:
          'Pertanyaan yang sama telah dikirim, coba buat pertanyaan lainnya!',
      })
      return
    }

    return mutate(
      { slug, q, token },
      {
        onSuccess: () => {
          toast({
            title: 'Pesan terkirim',
            description: `Berhasil mengirimkan pertanyaan ke ${owner?.name}!`,
          })

          setValueToStorage(LAST_QUESTION_KEY, q)
          form.reset()
        },
        onError: (error) => {
          let errorMessage = `Gagal mengirimkan pertanyaan ke ${owner?.name}, coba sesaat lagi!`
          if (isErrorResponse(error) && error.type === 'toast') {
            errorMessage = error.message
          }

          toast({
            title: 'Pesan gagal terkirim',
            description: errorMessage,
          })

          form.reset()
        },
      },
    )
  }

  async function onSubmit(data: FormValues) {
    trackEvent('click submit new question')
    if (process.env.NODE_ENV === 'development') {
      await sendQuestion(owner?.slug || '', data.q, 'development')
    } else {
      // @ts-ignore
      if (window?.grecaptcha) {
        // @ts-ignore
        window?.grecaptcha.ready(function () {
          // @ts-ignore
          window?.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
              action: 'submit',
            })
            .then(async function (token: string) {
              await sendQuestion(owner?.slug || '', data.q, token)
            })
        })
      }
    }
  }

  useEffect(() => {
    if (owner && owner?.slug) {
      setTimeout(() => {
        patchHit(owner.slug)
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    trackEvent('view public page')
  }, [])

  return (
    <>
      {process.env.NODE_ENV !== 'development' ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        />
      ) : null}
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
                  <Lock className="w-4 h-4" /> Pertanyaanmu akan disampaikan
                  secara anonim
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap justify-between gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sedang mengirim...</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  <span>Kirim pertanyaan</span>
                </>
              )}
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
