import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export default function SpinButton({ loading, children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      aria-pressed={loading}
      disabled={loading || rest.disabled}
      className={
        'px-5 py-3 rounded-md bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed ' +
        'font-semibold tracking-wide shadow-[0_0_12px_rgba(225,6,0,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-red-400 ' +
        className
      }
    >
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(255,223,0,0.9)]" aria-hidden />
        {loading ? 'Spinning…' : children ?? 'SPIN'}
      </span>
    </button>
  )
}

