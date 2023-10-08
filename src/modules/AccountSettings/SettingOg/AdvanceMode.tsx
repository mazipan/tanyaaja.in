/* eslint-disable unused-imports/no-unused-vars */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowTopRightIcon, InfoCircledIcon } from '@radix-ui/react-icons'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'firebase/auth'
// @ts-ignore
import * as z from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { trackEvent } from '@/lib/firebase'
import { CustomOg, UserProfile } from '@/lib/types'

const formSchema = z.object({
  publik: z.string().min(2, {
    message: 'Og image publik butuh paling tidak 2 karakter.',
  }),
  question: z.string().min(2, {
    message: 'Og image question butuh paling tidak 2 karakter.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function AdvanceMode({
  owner,
  user,
  existingOg,
}: {
  owner: UserProfile | null
  user: User | null
  existingOg: CustomOg[] | null
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoadingInitialData, setIsLoadingInitialData] =
    useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publik: '',
      question: '',
    },
  })

  async function onSubmit(data: FormValues) {
    trackEvent('click update account info')
    if (user) {
      try {
        setIsSubmitting(true)
        try {
          // const res = await checkTheSlugOwner(user, data.slug)
          // if (res && res.data) {
          //   if (res.data === 'NOT_EXIST') {
          //     await patchUpdateUser(user, {
          //       slug: data.slug,
          //       name: data.name,
          //       public: data.public ?? false,
          //       image: data.image || user.photoURL,
          //     })
          //     toast({
          //       title: 'Perubahan berhasil disimpan',
          //       description: `Berhasil menyimpan perubahan setelan!`,
          //     })
          //   } else {
          //     form.setError('slug', {
          //       type: 'custom',
          //       message:
          //         'Slug ini sepertinya sudah digunakan oleh orang lain. Ganti slug lain dan coba lagi',
          //     })
          //   }
          // } else {
          //   form.setError('slug', {
          //     type: 'custom',
          //     message:
          //       'Gagal mengecek ketersediaan slug, coba logout dan login kembali, kemudian coba ulangi melakukan perubahan ini.',
          //   })
          // }
        } catch (err) {
          toast({
            title: 'Gagal menyimpan',
            description: `Gagal saat mencoba mengecek ketersediaan slug, silahkan coba beberapa saat lagi!`,
          })
        }
        setIsSubmitting(false)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan',
          description: `Gagal menyimpan perubahan setelan, coba sesaat lagi!`,
        })
      }
    }
  }

  return (
    <div className="w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
      <section className="flex-1 lg:max-w-2xl">
        <Alert className="mb-4">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Tips!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc">
              <li className="m-0">
                <div className="flex items-center gap-2">
                  Kamu bisa mencoba kodemu di{' '}
                  <Link
                    href="https://og-playground.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    og-playground.vercel.app
                    <ArrowTopRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </li>
              <li className="m-0">
                <div className="flex items-center gap-2">
                  Gunakan ukuran 800x600 (width: 800px, height: 400px)
                </div>
              </li>
              <li className="m-0">
                <div className="flex items-center gap-2">
                  Kamu bisa menggunakan{' '}
                  <Link
                    href="https://hypercolor.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    hypercolor.dev
                    <ArrowTopRightIcon className="h-4 w-4" />
                  </Link>
                  , kalau perlu inspirasi gradient
                </div>
              </li>
              <li className="m-0">
                <div className="flex items-center gap-2">
                  Kamu bisa menggunakan parameter{' '}
                  <code className="text-blue-400">[question]</code> untuk
                  menggantikan pertanyaan
                </div>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="publik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Laman Publik</FormLabel>
                  <FormDescription>
                    Kode ini akan digunakan untuk og image laman publik Anda.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Kode untuk OG image laman publik Anda"
                      className="resize-y"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Laman Pertanyaan</FormLabel>
                  <FormDescription>
                    Kode ini akan digunakan untuk og image laman publik Anda.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Kode untuk OG image laman pertanyaan Anda"
                      className="resize-y"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              // disabled={isSubmitting || isLoadingInitialData}
              disabled
            >
              {/* {isSubmitting ? 'Processing' : 'Simpan Perubahan'} */}
              Coming soon
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}
