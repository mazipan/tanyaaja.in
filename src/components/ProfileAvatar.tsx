/* eslint-disable @next/next/no-img-element */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const ProfileAvatar = ({ image = '', name = '', size = '38' }: { image: string, name: string, size: string }) => {
  const fallbackName = name || ''
  return (
    <div>
      <Avatar style={{
        width: `${size}px`,
        height: `${size}px`,
      }}>
        <AvatarImage src={image} alt={fallbackName} />
        <AvatarFallback>
          {fallbackName?.replace("@", "")?.split(" ")?.map((n: string) => n[0])?.join("")?.substring(2, 0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}