'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { User } from 'firebase/auth'
import { Info, Loader2 } from 'lucide-react'
import { maxLength, minLength, object, type Output, string } from 'valibot'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// @ts-ignore
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { getCheckChatId } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'
import { NotifChannel, UserProfile } from '@/lib/types'

import { usePatchUpdateChannelNotif } from '../hooks/usePatchUpdateChannelNotif'
import { usePostAddNewChannelNotif } from '../hooks/usePostAddNewChannelNotif'

const schema = object({
  username: string('Username perlu disi terlebih dahulu.', [
    minLength(2, 'Username butuh paling tidak 2 karakter.'),
    maxLength(500, 'Username hanya bisa maksimal 1000 karakter.'),
  ]),
  chatId: string('Chat ID perlu disi terlebih dahulu.', [
    minLength(2, 'Chat ID butuh paling tidak 2 karakter.'),
    maxLength(20, 'Chat ID hanya bisa maksimal 20 karakter.'),
  ]),
})

type FormValues = Output<typeof schema>

export default function SettingTelegram({
  isLoading,
  owner,
  user,
  existing,
}: {
  isLoading: boolean
  owner: UserProfile | null | undefined
  user: User | null
  existing: NotifChannel[] | null | undefined
}) {
  const { toast } = useToast()
  const { mutate: mutateUpdateChannelNotif, isPending: isLoadingUpdate } =
    usePatchUpdateChannelNotif()
  const { mutate: mutateAddNewChannelNotif, isPending: isLoadingAdd } =
    usePostAddNewChannelNotif()

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      username: '',
      chatId: '',
    },
  })

  const watchUsername = form.watch('username')

  async function onSubmit(data: FormValues) {
    trackEvent('click update notif channel telegram')
    if (user) {
      if (existing && existing.length > 0) {
        // patch
        mutateUpdateChannelNotif({
          user,
          param: {
            uid: user?.uid,
            slug: owner?.slug || '',
            telegram_chat_id: data?.chatId || '',
            telegram_username: data?.username,
          },
        })
      } else {
        // create
        mutateAddNewChannelNotif({
          user,
          param: {
            uid: user?.uid,
            slug: owner?.slug || '',
            telegram_chat_id: data?.chatId || '',
            telegram_username: data?.username,
          },
        })
      }
    }
  }

  async function handleCheckChatId() {
    if (user) {
      try {
        const res = await getCheckChatId(user, form.getValues('username'))
        form.setValue('chatId', `${res?.data?.message?.chat?.id || ''}`)
      } catch (error) {
        toast({
          title: 'Gagal mengambil chat id',
          description: `Gagal saat mencoba chat id, silahkan coba beberapa saat lagi!`,
        })
      }
    }
  }

  useEffect(() => {
    if (existing && existing.length > 0) {
      form.setValue('username', existing[0].telegram_username)
      form.setValue('chatId', existing[0].telegram_chat_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:max-w-2xl">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username Telegram</FormLabel>
              <FormControl>
                <Input placeholder="Isi dengan username Telegram" {...field} />
              </FormControl>
              <FormDescription>
                Tidak perlu menambahkan karakter @ di depan username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Alert className="my-6">
          <Info className="h-4 w-4" />
          <AlertTitle className="mb-4">Tips!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-outside space-y-1.5">
              <li>Kamu perlu mengisi username untuk mendapatkan chat id</li>
              <li>
                Kirimkan perintah <code className="text-blue-400">/start</code>{' '}
                ke <code className="text-blue-400">@tanyaajabot</code> di
                Telegram
              </li>
              <li>
                Tekan tombol "Ambil Chat ID" setelah mengirimkan perintah{' '}
                <code className="text-blue-400">/start</code>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="chatId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat ID Target</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input
                    placeholder="Isi dengan target Chat ID"
                    disabled={!watchUsername}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    !watchUsername ||
                    isLoading ||
                    isLoadingAdd ||
                    isLoadingUpdate
                  }
                  onClick={handleCheckChatId}
                  className="shrink-0"
                >
                  Ambil Chat ID
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-8">
          <Button
            type="submit"
            disabled={isLoading || isLoadingAdd || isLoadingUpdate}
          >
            {isLoading ? (
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
