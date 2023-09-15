"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// @ts-ignore
import * as z from "zod"
import { Link2Icon } from "@radix-ui/react-icons"

import { getFirebaseAuth } from '@/lib/firebase'
import { useAuth } from "@/components/FirebaseAuth";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/CopyButton"
import { BASEURL, getExistingUser, patchUpdateUser } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const auth = getFirebaseAuth();

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Nama butuh paling tidak 2 karakter.",
    })
    .max(30, {
      message: "Nama hanya bisa maksimal 30 karakter.",
    }),
  slug: z
    .string()
    .min(3, {
      message: "Slug butuh paling tidak 3 karakter.",
    })
    .max(100, {
      message: "Slug hanya bisa maksimal 100 karakter.",
    })
    .refine((s: string) => !s.includes(' '), 'Slug tidak boleh mengandung karakter spasi.'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export default function Account() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isLogin, isLoading, user } = useAuth(auth)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      slug: ''
    },
  })

  const watchSlug = form.watch("slug", false)

  async function onSubmit(data: AccountFormValues) {
    if (user) {
      try {
        setIsSubmitting(true)
        await patchUpdateUser(user, { slug: data.slug, name: data.name })

        toast({
          title: 'Perubahan berhasil disimpan',
          description: `Berhasil menyimpan perubahan setelan!`
        });
        setIsSubmitting(false)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan',
          description: `Gagal menyimpan perubahan setelan, coba sesaat lagi!`
        });
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserFromDb = async () => {
    if (user) {
      const res = await getExistingUser(user)

      if (res && res.data) {
        form.setValue("name", res.data.name)
        form.setValue("slug", res.data.slug)
      }
    }
  }

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      } else if (user) {
        fetchUserFromDb()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, user, isLoading, router])

  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Setelan Akun</h2>
        <p className="text-muted-foreground">
          Atur nama dan alamat publik Anda
        </p>
      </div>

      <Separator className="my-6" />

      <div className='w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <section className='flex-1 lg:max-w-2xl'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Publik</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama publik Anda" {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nama ini akan ditampilkan di laman beranda publik Anda. Kami akan menggunakan nama dari akun Google bila belum disetel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug publik Anda" {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Slug ini adalah alamat dari laman publik Anda. Bisa diubah kapan saja, tapi dapat menyebabkan alamat lama Anda tidak dapat dikunjungi lagi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <div className="flex gap-2 items-center">
                <Link2Icon />
                <span>
                  {BASEURL}/p/{watchSlug}
                </span>

                {watchSlug !== '' ? (
                  <CopyButton text={`${BASEURL}/p/${watchSlug}`} />
                ) : null}
              </div>

              <Button type="submit" disabled={isSubmitting}>Simpan Perubahan</Button>
            </form>
          </Form>
        </section>
      </div>
    </main>
  )
}
