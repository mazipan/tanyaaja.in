import { CopyIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { copyTextToClipboard } from "@/lib/utils"
import { useState } from "react";
import { Input } from "./ui/input";

export function CopyButton({ text, withLabel = false, withInput = false, fullWidth = false }: { text: string, withLabel?: boolean, withInput?: boolean, fullWidth?: boolean }) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className={`flex space-x-2 ${fullWidth ? "w-full" : ""}`}>
      {withInput ? (<Input value={text} readOnly />) : null}
      <Button variant="outline" className="flex gap-2 items-center" onClick={() => {
        setIsCopied(true)
        copyTextToClipboard(`${text}`)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      }}>
        {isCopied ? (<CheckIcon className="h-4 w-4" />) : (<CopyIcon className="h-4 w-4" />)}
        {withLabel ? (
          <>
            {isCopied ? (<span>Tersalin</span>) : (<span>Salin</span>)}
          </>
        ) : null}
      </Button>
    </div>
  )
}