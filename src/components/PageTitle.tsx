export const PageTitle = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="w-full space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
