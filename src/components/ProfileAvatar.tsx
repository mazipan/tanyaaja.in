import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const ProfileAvatar = ({ image, name }: { image: string, name: string }) => {
  return (
    <Avatar>
      <AvatarImage src={image || ''} alt={name || ''} />
      <AvatarFallback>
        {name?.split(" ").map((n: string) => n[0]).join("").substring(2, 0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}