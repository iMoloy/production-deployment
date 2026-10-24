'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { WebsiteAuditCard } from './website-audit-card'
import { LeadScoreCard } from './lead-score-card'
import { ToolErrorCard } from './tool-error-card'
import { ZeroClsSkeleton } from './zero-cls-skeleton'
import type { WebsiteAuditResult, LeadScoreResult, ToolErrorPayload } from '@/types/tools'

const PROMPT_SUGGESTIONS = [
  { label: 'Audit FlyRank', prompt: 'Audit https://flyrank.io' },
  { label: 'Audit Vercel', prompt: 'Audit https://vercel.com with comprehensive diagnostics' },
  { label: 'Enterprise Lead Score', prompt: 'Score lead for Stripe (stripe.com) with 250 engineers and enterprise budget' },
]

export function ChatInterface() {
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    setInput,
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      try {
        const parsed = JSON.parse(err.message)
        if (parsed.retryAfter) {
          setRateLimitCountdown(parsed.retryAfter)
        }
      } catch {
        // Fallback
      }
    },
  })

  // Rate limit countdown effect
  useEffect(() => {
    if (rateLimitCountdown === null || rateLimitCountdown <= 0) return
    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          return null
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [rateLimitCountdown])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt)
  }

  const charCount = input.length
  const isOverLimit = charCount > 2000

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-5xl mx-auto w-full p-3 sm:p-6 font-sans">
      {/* Rate Limit Alert Banner */}
      {rateLimitCountdown !== null && (
        <div className="mb-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Abuse Guard Active:</strong> Request limit reached (5 req/min). Cooldown unlocks in <strong>{rateLimitCountdown}s</strong>.
            </span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-bold">
            HTTP 429
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 select-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">NexusAgent Autonomous Studio</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                Execute live technical SEO audits and qualify sales pipeline prospects using
                Generative UI streaming tools. Rate-limited and protected in production.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleSuggestionClick(s.prompt)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-indigo-500 transition-colors cursor-pointer min-h-11 flex items-center"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user'
            return (
              <div
                key={m.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 border border-white/10 text-indigo-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-900/90 border border-white/10 text-slate-200'
                  }`}
                >
                  {m.content && <p className="whitespace-pre-wrap">{m.content}</p>}

                  {/* Generative UI Tool Invocations */}
                  {m.toolInvocations?.map((tool) => {
                    const { toolCallId, toolName, state } = tool

                    if (state === 'call') {
                      return (
                        <div
                          key={toolCallId}
                          className="my-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2 text-xs font-mono text-indigo-300 animate-pulse"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing tool: <code className="text-white">{toolName}</code>...</span>
                        </div>
                      )
                    }

                    if (state === 'result') {
                      const result = tool.result

                      if (toolName === 'auditWebsite') {
                        if (result && 'isError' in result && result.isError) {
                          return (
                            <ToolErrorCard
                              key={toolCallId}
                              error={result.error as ToolErrorPayload}
                              onRetry={() => reload()}
                            />
                          )
                        }
                        return (
                          <WebsiteAuditCard
                            key={toolCallId}
                            data={result as WebsiteAuditResult}
                          />
                        )
                      }

                      if (toolName === 'scoreLeadPipeline') {
                        return (
                          <LeadScoreCard
                            key={toolCallId}
                            data={result as LeadScoreResult}
                          />
                        )
                      }
                    }

                    return null
                  })}
                </div>
              </div>
            )
          })
        )}

        {isLoading && <ZeroClsSkeleton />}

        {error && rateLimitCountdown === null && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between font-mono">
            <span>Streaming Error: {error.message || 'Upstream request failed.'}</span>
            <button
              type="button"
              onClick={() => reload()}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Caps & Mobile Hardening */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading || rateLimitCountdown !== null}
            placeholder={
              rateLimitCountdown !== null
                ? `Rate limit active: Wait ${rateLimitCountdown}s...`
                : 'Ask NexusAgent (e.g., "Audit https://flyrank.io")...'
            }
            aria-label="Ask NexusAgent"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pr-24 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 min-h-11"
          />

          <div className="absolute right-2 flex items-center gap-2">
            <span
              className={`text-[10px] font-mono hidden sm:inline ${
                isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-500'
              }`}
            >
              {charCount}/2000
            </span>

            <button
              type="submit"
              disabled={isLoading || !input.trim() || isOverLimit || rateLimitCountdown !== null}
              aria-label="Send Message"
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer min-h-11 min-w-11 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
