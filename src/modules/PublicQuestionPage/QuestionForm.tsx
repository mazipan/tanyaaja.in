"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// @ts-ignore
import * as z from "zod"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { patchHit, postSendQuestion } from "@/lib/api"
import { UserProfile } from "@/lib/types"
import { LockClosedIcon, PaperPlaneIcon } from "@radix-ui/react-icons"

const formSchema = z.object({
  q: z
    .string()
    .min(2, {
      message: "Pertanyaan butuh minimal 2 karakter",
    })
    .max(1000, {
      message: "Pertanyaan hanya bisa maksimal 1000 karakter",
    }),
})

type FormValues = z.infer<typeof formSchema>

export function QuestionForm({ owner }: { owner: UserProfile }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      await postSendQuestion(owner?.uid || '', data.q)
      setIsLoading(false)
      toast({
        title: 'Pesan terkirim',
        description: `Berhasil mengirimkan pertanyaan ke ${owner?.name}!`
      });
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Pesan gagal terkirim',
        description: `Gagal mengirimkan pertanyaan ke ${owner?.name}, coba sesaat lagi!`
      });
    }
  }

  useEffect(() => {
    patchHit(owner.slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/3 space-y-6">
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
                <LockClosedIcon /> Pertanyaanmu akan disampaikan secara anonim
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          Kirim pertanyaan
        </Button>
      </form>
    </Form>
  )
}