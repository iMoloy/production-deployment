'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route-level error captured:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#090d16] text-white">
      <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">Application Exception Encountered</h1>
          <p className="text-xs text-slate-400 mt-1">
            An isolated route error occurred. The surrounding platform state has been preserved.
          </p>
        </div>

        {error.digest && (
          <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-400 border border-white/5">
            Digest: {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition-colors cursor-pointer min-h-11"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Route</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors min-h-11"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
