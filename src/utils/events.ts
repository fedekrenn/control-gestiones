import type { ClipboardEvent, KeyboardEvent } from 'react'

const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
  event.preventDefault()
  const clipboardData = event.clipboardData
  const pastedText = clipboardData.getData('text/plain')
  const trimmedText = pastedText.trim()
  document.execCommand('insertText', false, trimmedText)
}

const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.keyCode === 32) e.preventDefault()
}

export { handlePaste, handleKeyDown }
