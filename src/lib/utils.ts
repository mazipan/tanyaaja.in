import { type ClassValue, clsx } from 'clsx'
// eslint-disable-next-line
// @ts-ignore
import domtoimage from 'dom-to-image-more'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export function addDays(date: string, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)

  return result
}

/**
 * // https://dev.to/nombrekeff/download-file-from-blob-21ho
 * @param blob <Blob>
 * @param filename <string>
 */
export function downloadFromHref(href: string, filename = 'question.png') {
  // Create a link element
  const link = document.createElement('a')

  link.href = href
  link.download = filename
  link.setAttribute('data-filename', filename)
  link.style.display = 'none'

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  )

  // Remove link from body
  document.body.removeChild(link)
}

export function downloadQuestion(questionId: string) {
  const domQuestion = document.querySelector('#question-card')
  if (domQuestion) {
    // eslint-disable-next-line
    // @ts-ignore
    domtoimage
      .toPng(domQuestion)
      .then(function (dataUrl: string) {
        const filename = `question-${questionId || Date.now()}.png`
        downloadFromHref(dataUrl, filename)
      })
      .catch(function (error: Error) {
        console.error('Opps, something went wrong!', error)
      })
  }
}
