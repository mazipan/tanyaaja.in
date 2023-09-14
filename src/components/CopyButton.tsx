import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { copyTextToClipboard } from "@/lib/utils"
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button variant="outline" size="icon" onClick={() => {
      setIsCopied(true)
      copyTextToClipboard(`${text}`)
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    }}>
      {isCopied ? (<CheckIcon className="h-4 w-4" />) : (<CopyIcon className="h-4 w-4" />)}

    </Button>
  )
}