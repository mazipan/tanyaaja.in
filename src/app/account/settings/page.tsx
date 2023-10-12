'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UpdateIcon } from '@radix-ui/react-icons'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import {
  boolean as isBoolean,
  maxLength,
  minLength,
  object,
  optional,
  type Output,
  string,
} from 'valibot'

import { CopyButton } from '@/components/CopyButton'
import { useAuth } from '@/components/FirebaseAuth'
import { ProfileAvatar } from '@/components/ProfileAvatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { BASEURL, checkTheSlugOwner, patchUpdateUser } from '@/lib/api'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { DEFAULT_AVATAR, randomizeAvatar } from '@/lib/utils'
import { useOwner } from '@/queries/useQueries'

const auth = getFirebaseAuth()

const schema = object({
  image: string('Avatar perlu disi terlebih dahulu.', [
    minLength(3, 'Avatar butuh paling tidak 2 karakter.'),
    maxLength(1000, 'Avatar hanya bisa maksimal 1000 karakter.'),
  ]),
  name: string('Nama perlu disi terlebih dahulu.', [
    minLength(2, 'Nama butuh paling tidak 2 karakter.'),
    maxLength(50, 'Nama hanya bisa maksimal 50 karakter.'),
  ]),
  slug: string('Slug perlu disi terlebih dahulu.', [
    minLength(2, 'Slug butuh paling tidak 2 karakter.'),
    maxLength(100, 'Slug hanya bisa maksimal 100 karakter.'),
  ]),
  public: optional(isBoolean()),
})

type FormValues = Output<typeof schema>

export default function Account() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { isLogin, isLoading, user } = useAuth(auth)

  // @ts-ignore
  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user, {
    enabled: !isLoading && isLogin && !!user,
  })

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      image: '',
      name: '',
      slug: '',
      public: false,
    },
  })

  const watchSlug = form.watch('slug')
  const watchImage = form.watch('image')
  const watchName = form.watch('name')

  async function onSubmit(data: FormValues) {
    trackEvent('click update account info')
    if (user) {
      try {
        setIsSubmitting(true)
        try {
          const res = await checkTheSlugOwner(user, data.slug)
          if (res && res.data) {
            if (res.data === 'NOT_EXIST') {
              await patchUpdateUser(user, {
                slug: data.slug,
                name: data.name,
                public: data.public ?? false,
                image: data?.image || user?.photoURL || DEFAULT_AVATAR,
              })

              toast({
                title: 'Perubahan berhasil disimpan',
                description: `Berhasil menyimpan perubahan setelan!`,
              })
            } else {
              form.setError('slug', {
                type: 'custom',
                message:
                  'Slug ini sepertinya sudah digunakan oleh orang lain. Ganti slug lain dan coba lagi',
              })
            }
          } else {
            form.setError('slug', {
              type: 'custom',
              message:
                'Gagal mengecek ketersediaan slug, coba logout dan login kembali, kemudian coba ulangi melakukan perubahan ini.',
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
    if (!isLoadingOwner && dataOwner) {
      form.setValue('image', dataOwner.data.image)
      form.setValue('name', dataOwner.data.name)
      form.setValue('slug', dataOwner.data.slug)
      form.setValue('public', dataOwner.data.public ?? false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingOwner, dataOwner])

  useEffect(() => {
    trackEvent('view account setting page')
  }, [])

  return (
    <>
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Setelan Akun</h2>
        <p className="text-muted-foreground">
          Atur nama dan alamat publik yang diinginkan
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <section className="flex-1 lg:max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Publik</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama publik" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nama ini akan ditampilkan di laman beranda publikmu. Kami
                      akan menggunakan nama dari akun Google bila belum disetel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Avatar Publik</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat avatar publik" {...field} />
                    </FormControl>
                    <FormDescription>
                      Avatar ini akan ditampilkan di laman beranda publikmu.
                      Kami akan menggunakan gambar akun Google bila belum
                      disetel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchImage ? (
                <div className="flex items-center gap-2 ">
                  <p>Preview:</p>
                  <ProfileAvatar
                    image={watchImage}
                    name={watchName}
                    size="38"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.setValue('image', randomizeAvatar())
                    }}
                  >
                    <UpdateIcon className="h-4 w-4 mr-2" />
                    Pilih secara acak
                  </Button>
                </div>
              ) : null}

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug publik" {...field} />
                      </FormControl>
                      <FormDescription>
                        Slug ini adalah alamat dari laman publikmu. Bisa diubah
                        kapan saja, tapi dapat menyebabkan alamat lamamu tidak
                        dapat dikunjungi lagi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <div className="flex gap-2 items-center w-full">
                {watchSlug !== '' ? (
                  <CopyButton
                    text={`${BASEURL}/p/${watchSlug}`}
                    withLabel
                    withInput
                    fullWidth
                  />
                ) : null}
              </div>

              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Bisa dicari publik?</FormLabel>
                      <FormDescription>
                        Pengguna anonim dapat mencari akunmu lewat laman eksplor
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Card className="border-red-600">
                <CardHeader>
                  <CardTitle>Area Berbahaya!</CardTitle>

                  <CardDescription>
                    Aksi pada bagian ini dapat menghilangkan keseluruhan datamu
                    yang ada di TanyaAja.in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap flex-col md:flex-row">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        toast({
                          title:
                            'Fitur "Hapus semua pertanyaan" belum tersedia',
                          description: `Fitur masih dalam tahap pengembangan, pantau perkembangannya di GitHub dan Twitter!`,
                        })
                      }}
                    >
                      Hapus semua pertanyaan
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        toast({
                          title: 'Fitur "Hapus akun saya" belum tersedia',
                          description: `Fitur masih dalam tahap pengembangan, pantau perkembangannya di GitHub dan Twitter!`,
                        })
                      }}
                    >
                      Hapus akun saya
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={isSubmitting || isLoadingOwner}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </>
  )
}
