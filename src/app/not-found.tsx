import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#090d16] text-white">
      <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 text-indigo-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">404 — Route Not Found</h1>
          <p className="text-xs text-slate-400 mt-1">
            The requested resource or page segment does not exist in NexusAgent Studio.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition-colors min-h-11"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
