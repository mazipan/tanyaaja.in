import { GRADIENTS, truncateText } from '@/lib/utils'

export function CustomQuestionOgSimple({
  question,
  theme,
}: {
  question: string
  theme: string
  text: string
}) {
  return (
    <div
      tw="flex p-10 flex-col w-full h-full items-center justify-center rounded-3xl"
      style={{
        backgroundImage: GRADIENTS.find((g) => g.id === theme)?.cssNative,
      }}
    >
      <div tw="flex flex-col justify-center items-center font-extrabold text-3xl tracking-tight w-full">
        <p>{truncateText(question, 700)}</p>
      </div>
      {/* biome-ignore lint/style/useSelfClosingElements: sebuah alasan */}
      <div></div>
    </div>
  )
}
