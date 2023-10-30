'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2, RefreshCw } from 'lucide-react'
import {
  boolean as isBoolean,
  maxLength,
  minLength,
  object,
  optional,
  type Output,
  startsWith,
  string,
} from 'valibot'

import { CopyButton } from '@/components/CopyButton'
import { useDialog } from '@/components/dialog/DialogStore'
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
import { BASEURL } from '@/lib/api'
import { isErrorResponse } from '@/lib/error'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { DEFAULT_AVATAR, randomizeAvatar } from '@/lib/utils'
import { useUpdateUser } from '@/modules/AccountSettings/hooks/useUpdateUser'
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
  x_username: optional(
    string([startsWith('@', 'Username X (Twitter) harus diawali dengan @')]),
  ),
  public: optional(isBoolean()),
})

type FormValues = Output<typeof schema>

export default function Account() {
  const { toast } = useToast()
  const dialog = useDialog()
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const { mutate: updateUser, isPending: isSubmitting } = useUpdateUser()

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      image: '',
      name: '',
      slug: '',
      public: false,
      x_username: '',
    },
  })

  const watchSlug = form.watch('slug')
  const watchImage = form.watch('image')
  const watchName = form.watch('name')

  function onSubmit(data: FormValues) {
    trackEvent('click update account info')
    if (user) {
      updateUser(
        {
          user,
          slug: data.slug,
          bodyToUpdate: {
            slug: data.slug,
            name: data.name,
            public: data.public ?? false,
            image: data?.image || user?.photoURL || DEFAULT_AVATAR,
            x_username: data.x_username,
          },
        },
        {
          onError: (error) => {
            if (isErrorResponse(error) && error.type === 'form-field') {
              form.setError('slug', {
                type: 'custom',
                message: error.message,
              })
            }
          },
        },
      )
    }
  }

  useEffect(() => {
    if (!isLoadingOwner && dataOwner && dataOwner.data) {
      form.setValue('image', dataOwner.data.image)
      form.setValue('name', dataOwner.data.name)
      form.setValue('slug', dataOwner.data.slug)
      form.setValue('public', dataOwner.data.public ?? false)
      form.setValue('x_username', dataOwner.data.x_username)
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="lg:max-w-2xl">
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
                  Nama ini akan ditampilkan di laman beranda publikmu. Kami akan
                  menggunakan nama dari akun Google bila belum disetel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 space-y-3">
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
                    Avatar ini akan ditampilkan di laman beranda publikmu. Kami
                    akan menggunakan gambar akun Google bila belum disetel.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchImage ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <p>Preview:</p>
                <div className="flex items-center gap-2">
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
                    className="shrink-0"
                  >
                    <RefreshCw className="h-4 w-4 mr-2 shrink-0" />
                    Pilih secara acak
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <FormField
            control={form.control}
            name="x_username"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Username X (Twitter)</FormLabel>
                <FormControl>
                  <Input placeholder="@username" {...field} />
                </FormControl>
                <FormDescription>
                  Username ini akan ditampilkan di laman beranda publikmu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 space-y-3">
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

            {watchSlug !== '' ? (
              <CopyButton
                text={`${BASEURL}/p/${watchSlug}`}
                withLabel
                withInput
                fullWidth
              />
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-4">
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
          </div>

          <Card className="mt-6 border-red-600">
            <CardHeader>
              <CardTitle>Area Berbahaya!</CardTitle>

              <CardDescription>
                Aksi pada bagian ini dapat menghilangkan keseluruhan datamu yang
                ada di TanyaAja.in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap flex-col md:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    dialog({
                      title:
                        'Apakah anda yakin ingin menghapus semua pertanyaan?',
                      description:
                        'Pertanyaan yang sudah dihapus tidak dapat dikembalikan lagi.',
                      submitButton: {
                        label: 'Hapus',
                        variant: 'destructive',
                      },
                    }).then(() => {
                      toast({
                        title: 'Fitur "Hapus semua pertanyaan" belum tersedia',
                        description: `Fitur masih dalam tahap pengembangan, pantau perkembangannya di GitHub dan Twitter!`,
                      })
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoadingOwner}
            className="mt-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                <span>Menyimpan...</span>
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
