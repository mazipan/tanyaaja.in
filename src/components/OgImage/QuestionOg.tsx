export function QuestionOg({ question }: { question: string }) {
  return (
    <div
      tw="flex p-10 flex-col w-full h-full items-center justify-center rounded-3xl"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))',
      }}
    >
      <div tw="flex flex-col justify-center items-center font-extrabold text-3xl tracking-tight w-full">
        <p>
          {question?.length > 700
            ? `${question?.substring(0, 700)}...`
            : `${question}`}
        </p>
      </div>
      <div></div>
    </div>
  )
}
