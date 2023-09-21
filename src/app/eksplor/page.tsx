import { Separator } from '@/components/ui/separator'
import PublicUserList from '@/modules/EskplorPage/PublicUserList'

export default function EksplorPage() {
  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Eksplor pengguna</h2>
        <p className="text-muted-foreground">
          Kamu bisa mencari dan mulai bertanya pada pengguna yang sudah
          memberikan ijin untuk ditampilkan di laman ini
        </p>
      </div>

      <Separator className="my-6" />

      <PublicUserList />
    </main>
  )
}
