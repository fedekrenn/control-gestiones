const handlePaste = (event) => {
  event.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData
  const pastedText = clipboardData.getData('text/plain')
  const trimmedText = pastedText.trim()
  document.execCommand('insertText', false, trimmedText)
}

const handleKeyDown = (e) => {
  e.keyCode === 32 && e.preventDefault()
}

export { handlePaste, handleKeyDown }
