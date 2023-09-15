import Link from "next/link";

export function Footer() {
  return (
    <footer className='text-center p-4 border-t'>
      <div className="flex gap-4 justify-center items-center mb-4">
        <Link href="/ketentuan-layanan" className="underline">
         Ketentuan Layanan
        </Link>
        <span>•</span>
        <Link href="/kebijakan-privasi"  className="underline">
         Kebijakan Privasi
        </Link>
      </div>
      <p><small>© Sejak 2023, TanyaAja</small></p>
      <p><small>Oleh <a href="https://mazipan.space/" target='_blank' rel='noopener noreferrer' className='underline'>Irfan Maulana</a></small></p>
    </footer>
  )
}