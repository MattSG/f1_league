import React, { useEffect, useState } from 'react'

type Props = {
  visible: boolean
}

const FULL_TEXT = "ERROR: Triple crown not found.\nAttempting to auto heal...."

export default function ErrorOverlay({ visible }: Props) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (visible) {
      setText('')
      let i = 0
      const interval = setInterval(() => {
        setText(FULL_TEXT.slice(0, i + 1))
        i++
        if (i >= FULL_TEXT.length) clearInterval(interval)
      }, 50)
      return () => clearInterval(interval)
    } else {
      setText('')
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-8 text-center font-mono">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-24 h-24 text-red-600 mb-6 animate-pulse"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <div className="text-red-500 font-black text-3xl md:text-5xl tracking-widest uppercase whitespace-pre-line leading-relaxed drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
        {text}
        <span className="animate-pulse">_</span>
      </div>
    </div>
  )
}
