'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'firebase/auth'
// @ts-ignore
import * as z from 'zod'

import { GradientSelection } from '@/components/GradientSelection'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { BASEURL, patchUpdateCustomOg, postAddNewCustomOg } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { ClassMap, CustomOg, UserProfile } from '@/lib/types'

const formSchema = z.object({
  textOgPublik: z.string().min(2, {
    message: 'Avatar butuh paling tidak 2 karakter.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function SimpleMode({
  owner,
  user,
  existingOg,
}: {
  owner: UserProfile | null
  user: User | null
  existingOg: CustomOg[] | null
}) {
  const [activeGradient, setActiveGradient] = useState<string>('hyper')
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textOgPublik: '',
    },
  })

  const watchTextOgPublik = form.watch('textOgPublik', false)

  const handleClickGradient = (newGradient: ClassMap) => {
    setActiveGradient(newGradient?.id || '')
  }

  async function onSubmit(data: FormValues) {
    trackEvent('click update account info')
    if (user) {
      try {
        setIsSubmitting(true)
        try {
          if (existingOg && existingOg.length > 0) {
            // patch
            await patchUpdateCustomOg(user, {
              uid: user?.uid,
              slug: owner?.slug || '',
              mode: 'simple',
              theme: activeGradient,
              simpleText: data?.textOgPublik,
              codePublic: '',
              codeQuestion: '',
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
              mode: 'simple',
              theme: activeGradient,
              simpleText: data?.textOgPublik,
              codePublic: '',
              codeQuestion: '',
            })
            toast({
              title: 'Perubahan berhasil disimpan',
              description: `Berhasil menyimpan perubahan og image custom!`,
            })
          }
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

  useEffect(() => {
    if (existingOg && existingOg.length > 0) {
      form.setValue('textOgPublik', existingOg[0].simple_text)
      setActiveGradient(existingOg[0].theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingOg])

  return (
    <div className="w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
      <section className="flex-1 lg:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Pilih warna latar
              </label>
              <GradientSelection
                activeGradient={activeGradient}
                onClick={handleClickGradient}
              />
            </div>
            <FormField
              control={form.control}
              name="textOgPublik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks untuk OG Image laman publik</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Teks untuk OG Image laman publik"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center">
              <Button asChild type="button" variant="secondary">
                <a
                  href={`${BASEURL}/api/og?type=custom-user&slug=irfan-maulana&theme=${activeGradient}&text=${watchTextOgPublik}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview
                  <ArrowTopRightIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  )
}
