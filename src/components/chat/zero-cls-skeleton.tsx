import { Cpu } from 'lucide-react'

export function ZeroClsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Generating AI stream response"
      className="flex gap-3 items-start animate-pulse select-none my-3"
    >
      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
        <Cpu className="w-4 h-4 animate-spin text-indigo-300" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-800 rounded-md w-1/4" />
        <div className="h-3.5 bg-slate-800/80 rounded-md w-3/4" />
        <div className="h-3.5 bg-slate-800/60 rounded-md w-1/2" />
      </div>
    </div>
  )
}
