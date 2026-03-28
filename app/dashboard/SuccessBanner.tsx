'use client'

import { useState } from 'react'

export default function SuccessBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
      <div className="flex items-center gap-2.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-green-600">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {message}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 text-green-600 hover:text-green-800 transition-colors"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
