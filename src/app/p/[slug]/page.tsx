"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserProfile, getUserOwnerBySlug, sendQuestionToOwner } from "@/lib/firebase"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  q: z
    .string()
    .min(2, {
      message: "Pertanyaan minimal 2 karakter",
    })
    .max(1000, {
      message: "Pertanyaan maksimal 1000 karakter",
    }),
})

type FormValues = z.infer<typeof formSchema>

export default function PublicPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pageOwner, setPageOwner] = useState<UserProfile | null>(null)
  const { slug } = useParams()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
  })

  async function fetchOwnerBySlug() {
    const owner = await getUserOwnerBySlug(slug as string)
    setPageOwner(owner)
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      await sendQuestionToOwner(pageOwner?.uid || '', data.q)
      setIsLoading(false)
      toast({
        title: 'Pesan terkirim',
        description: `Berhasil mengirimkan pertanyaan ke ${pageOwner?.name}!`
      });
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Pesan gagal terkirim',
        description: `Gagal mengirimkan pertanyaan ke ${pageOwner?.name}, coba sesaat lagi!`
      });
    }
  }

  useEffect(() => {
    fetchOwnerBySlug()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="flex flex-col gap-6 items-center p-24">

      <Avatar className="border cursor-pointer">
        <AvatarImage src={pageOwner?.image || ''} alt={pageOwner?.name || ''} />
        <AvatarFallback>{pageOwner?.name?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
      </Avatar>

      <h1 className="text-3xl font-extrabold">Tanya ke {pageOwner?.name}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pertanyaan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tulis pertanyaan yang ingin disampaikan"
                    rows={7}

                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Pertanyaanmu akan disampaikan secara anonim
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>Kirim pertanyaan</Button>
        </form>
      </Form>
    </main>
  )
}