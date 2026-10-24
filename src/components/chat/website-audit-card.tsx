'use client'

import { useState } from 'react'
import {
  Globe,
  AlertTriangle,
  Info,
  Copy,
  Check,
} from 'lucide-react'
import type { WebsiteAuditResult } from '@/types/tools'
import { ScoreGauge } from './score-gauge'

interface WebsiteAuditCardProps {
  data: WebsiteAuditResult
}

export function WebsiteAuditCard({ data }: WebsiteAuditCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'meta'>('overview')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `Audit Summary for ${data.targetUrl}: Score ${data.overallScore}/100. LCP: ${data.vitals.lcp.formatted}, INP: ${data.vitals.inp.formatted}, CLS: ${data.vitals.cls.formatted}.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full my-3 rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <span>{data.targetUrl}</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Automated Core Web Vitals Audit · {data.auditDepth.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-slate-900/40 px-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Vitals
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('findings')}
          className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'findings'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Findings ({data.findings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('meta')}
          className={`py-2 px-3 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'meta'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Meta Tags
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/5">
              <ScoreGauge score={data.overallScore} label="Audit Score" />
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                {Object.values(data.vitals).map((vital) => {
                  const isGood = vital.rating === 'good'
                  const isNeeds = vital.rating === 'needs-improvement'
                  return (
                    <div
                      key={vital.shortName}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 font-mono"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{vital.shortName}</span>
                        <span
                          className={`text-[9px] px-1 rounded font-bold ${
                            isGood
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isNeeds
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {vital.thresholdGood}
                        </span>
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {vital.formatted}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">
                        {vital.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="space-y-2">
            {data.findings.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    {f.severity === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span>{f.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {f.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{f.recommendation}</p>
                {f.estimatedSavings && (
                  <span className="inline-block text-[10px] font-mono text-emerald-400">
                    Impact: {f.estimatedSavings}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block">Title:</span>
              <p className="text-slate-200">{data.meta.title}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Description:</span>
              <p className="text-slate-400 text-[11px]">{data.meta.description}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Robots:</span>
              <p className="text-slate-400 text-[11px]">{data.meta.robots}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
