import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const ProfileAvatar = ({ image, name }: { image: string, name: string }) => {
  return (
    <Avatar className="border cursor-pointer">
      <AvatarImage src={image || ''} alt={name || ''} />
      <AvatarFallback>{name?.split(" ").map((n: string) => n[0]).join("").substring(2, 0)}</AvatarFallback>
    </Avatar>
  )
}