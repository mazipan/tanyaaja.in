import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const ProfileAvatar = ({ image = '', name = '' }: { image: string, name: string }) => {
  const fallbackName = name || ''
  return (
    <div>
      <Avatar>
        <AvatarImage src={image} alt={fallbackName} sizes="3xl"/>
        <AvatarFallback>
          {fallbackName?.replace("@", "")?.split(" ")?.map((n: string) => n[0])?.join("")?.substring(2, 0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}