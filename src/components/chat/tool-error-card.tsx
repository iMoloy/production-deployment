'use client'

import { AlertOctagon, RotateCcw } from 'lucide-react'
import type { ToolErrorPayload } from '@/types/tools'

interface ToolErrorCardProps {
  error: ToolErrorPayload
  onRetry?: () => void
}

export function ToolErrorCard({ error, onRetry }: ToolErrorCardProps) {
  return (
    <div className="w-full my-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 shadow-xl space-y-2.5 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
          <AlertOctagon className="w-4 h-4" />
          <span>TOOL_EXECUTION_FAILURE [{error.code}]</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>

      <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
        {error.message}
      </p>

      {error.details && (
        <p className="text-[11px] text-slate-400 bg-black/40 p-2 rounded border border-white/5 font-mono">
          {error.details}
        </p>
      )}

      {error.suggestedFix && (
        <div className="text-[11px] text-amber-300/90 font-mono">
          <strong>Remediation:</strong> {error.suggestedFix}
        </div>
      )}
    </div>
  )
}
