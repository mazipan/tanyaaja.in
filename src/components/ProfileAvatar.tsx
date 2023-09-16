/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const ProfileAvatar = ({ image = '', name = '', useImgTag = false }: { image: string, name: string, useImgTag?: boolean }) => {
  const fallbackName = name || ''
  return (
    <div>
      {useImgTag ? (
        <img src={image} alt={name} loading="lazy" className="w-[96px] h-[96px] rounded-full"/>
      ) : (
        <Avatar>
          <AvatarImage src={image} alt={fallbackName} />
          <AvatarFallback>
            {fallbackName?.replace("@", "")?.split(" ")?.map((n: string) => n[0])?.join("")?.substring(2, 0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}