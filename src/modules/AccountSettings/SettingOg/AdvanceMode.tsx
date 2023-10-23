/* eslint-disable unused-imports/no-unused-vars */
'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { User } from 'firebase/auth'
import { Info, Loader2, MoveUpRight } from 'lucide-react'
import { maxLength, minLength, object, type Output, string } from 'valibot'

// @ts-ignore
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
import { patchUpdateCustomOg, postAddNewCustomOg } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { deparse } from '@/lib/jsx-deparse'
import JSXParser from '@/lib/jsx-parser'
import { CustomOg, UserProfile } from '@/lib/types'

const schema = object({
  publik: string('Kode laman publik perlu disi terlebih dahulu.', [
    minLength(2, 'Kode laman publik butuh paling tidak 2 karakter.'),
    maxLength(10000, 'Kode laman publik hanya bisa maksimal 10000 karakter.'),
  ]),
  question: string('Kode laman pertanyaan perlu disi terlebih dahulu.', [
    minLength(2, 'Kode laman pertanyaan butuh paling tidak 2 karakter.'),
    maxLength(
      10000,
      'Kode laman pertanyaan hanya bisa maksimal 10000 karakter.',
    ),
  ]),
})

type FormValues = Output<typeof schema>

export default function AdvanceMode({
  isLoading,
  owner,
  user,
  existingOg,
}: {
  isLoading: boolean
  owner: UserProfile | null | undefined
  user: User | null
  existingOg: CustomOg[] | null | undefined
}) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      publik: '',
      question: '',
    },
  })

  async function onSubmit(data: FormValues) {
    trackEvent('click update og image advance')
    if (user) {
      setIsSubmitting(true)
      // @ts-ignore
      const codePublik = JSON.stringify(JSXParser(data?.publik))
      // @ts-ignore
      const codeQuestion = JSON.stringify(JSXParser(data?.question))
      try {
        if (existingOg && existingOg.length > 0) {
          // patch
          await patchUpdateCustomOg(user, {
            uid: user?.uid,
            slug: owner?.slug || '',
            mode: 'advance',
            theme: existingOg?.[0]?.theme || 'hyper',
            simpleText: existingOg?.[0]?.simple_text || '',
            codePublic: codePublik,
            codeQuestion: codeQuestion,
          })
          toast({
            title: 'Perubahan berhasil disimpan',
            description: `Berhasil menyimpan perubahan setelan og image custom!`,
          })
        } else {
          // create
          await postAddNewCustomOg(user, {
            uid: user?.uid,
            slug: owner?.slug || '',
            mode: 'advance',
            theme: 'hyper',
            simpleText: '',
            codePublic: codePublik,
            codeQuestion: codeQuestion,
          })
          toast({
            title: 'Perubahan berhasil disimpan',
            description: `Berhasil menyimpan perubahan og image custom!`,
          })
        }
      } catch (err) {
        toast({
          title: 'Gagal menyimpan',
          description: `Gagal menyimpan perubahan setelan, coba sesaat lagi!`,
        })
      }
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (existingOg && existingOg.length > 0) {
      form.setValue('publik', deparse(existingOg[0].code_public), {})
      form.setValue('question', deparse(existingOg[0].code_question), {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingOg])

  return (
    <section className="lg:max-w-2xl space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle className="mb-4">Tips!</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-outside space-y-1.5">
            <li>
              Kamu bisa mencoba kodemu di{' '}
              <Link
                href="https://og-playground.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center text-blue-400"
              >
                og-playground.vercel.app
                <MoveUpRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>Gunakan ukuran 800x600 (width: 800px, height: 400px)</li>
            <li>
              Kamu bisa menggunakan{' '}
              <Link
                href="https://hypercolor.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center text-blue-400"
              >
                hypercolor.dev
                <MoveUpRight className="h-4 w-4 shrink-0" />
              </Link>
              untuk inspirasi gradient
            </li>
            <li>
              Kamu bisa menggunakan parameter{' '}
              <code className="text-blue-400">[question]</code> untuk
              menggantikan pertanyaan
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormItem className="mt-6">
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
            disabled={isSubmitting || isLoading}
            className="mt-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </form>
      </Form>
    </section>
  )
}
