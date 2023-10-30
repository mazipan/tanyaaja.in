'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { User } from 'firebase/auth'
import { Loader2 } from 'lucide-react'
import { maxLength, minLength, object, type Output, string } from 'valibot'

// @ts-ignore
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
import { BASEURL } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { ClassMap, CustomOg, UserProfile } from '@/lib/types'

import useAddNewCustomOg from './hooks/useAddNewCustomOg'
import useUpdateCustomOg from './hooks/useUpdatecustomOg'

const schema = object({
  textOgPublik: string('Text perlu disi terlebih dahulu.', [
    minLength(2, 'Text butuh paling tidak 2 karakter.'),
    maxLength(500, 'Text hanya bisa maksimal 1000 karakter.'),
  ]),
})

type FormValues = Output<typeof schema>

export default function SimpleMode({
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
  const [activeGradient, setActiveGradient] = useState<string>('hyper')
  const { toast } = useToast()
  const { mutate: addNewOgMutation, isPending: isAddingNewCustomOg } =
    useAddNewCustomOg()
  const { mutate: updateCustomOgMutation, isPending: isUpdatingCustomOg } =
    useUpdateCustomOg()

  const isSubmitting = isAddingNewCustomOg || isUpdatingCustomOg

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      textOgPublik: '',
    },
  })

  const watchTextOgPublik = form.watch('textOgPublik')

  const handleClickGradient = (newGradient: ClassMap) => {
    setActiveGradient(newGradient?.id || '')
  }

  const mutationOptions = {
    onSuccess: () => {
      toast({
        title: 'Perubahan berhasil disimpan',
        description: `Berhasil menyimpan perubahan setelan og image custom!`,
      })
    },
    onError: () => {
      toast({
        title: 'Gagal menyimpan',
        description: `Gagal saat mencoba menyimpan data, silahkan coba beberapa saat lagi!`,
      })
    },
  }

  async function onSubmit(data: FormValues) {
    trackEvent('click update og image simple')
    if (user) {
      try {
        if (existingOg && existingOg.length > 0) {
          // patch
          await updateCustomOgMutation(
            {
              user,
              params: {
                uid: user?.uid,
                slug: owner?.slug || '',
                mode: 'simple',
                theme: activeGradient,
                simpleText: data?.textOgPublik,
                codePublic: '',
                codeQuestion: '',
              },
            },
            mutationOptions,
          )
        } else {
          // create
          await addNewOgMutation(
            {
              user,
              params: {
                uid: user?.uid,
                slug: owner?.slug || '',
                mode: 'simple',
                theme: activeGradient,
                simpleText: data?.textOgPublik,
                codePublic: '',
                codeQuestion: '',
              },
            },
            mutationOptions,
          )
        }
      } catch (err) {
        toast({
          title: 'Gagal menyimpan',
          description: `Gagal saat mencoba menyimpan data, silahkan coba beberapa saat lagi!`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <div className="flex-1 lg:max-w-2xl">
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
                <FormItem className="mt-6">
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
          </div>
          <div className="flex-1 max-w-[400px]">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Pratinjau
            </label>
            <img
              src={`${BASEURL}/api/og?type=custom-user&slug=${owner?.slug}&theme=${activeGradient}&text=${
                watchTextOgPublik ||
                'Kumpulkan pertanyaan anonim dengan lebih mudah'
              }&r=${new Date().getTime()}`}
              alt="Pratinjau Og Image"
              loading="lazy"
              width={400}
              height="auto"
            />
          </div>
        </div>
        <div className="mt-8 flex gap-2 flex-col sm:flex-row sm:items-center">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                <span>Menyimpan...</span>
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
