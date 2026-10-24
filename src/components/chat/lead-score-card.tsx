'use client'

import { Building2 } from 'lucide-react'
import type { LeadScoreResult } from '@/types/tools'

interface LeadScoreCardProps {
  data: LeadScoreResult
}

export function LeadScoreCard({ data }: LeadScoreCardProps) {
  return (
    <div className="w-full my-3 rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden font-sans">
      <div className="px-4 py-3 bg-slate-800/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono">{data.companyDomain}</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Enterprise Lead Qualification · {data.tier}
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs font-bold text-emerald-400">{data.qualificationScore}/100</span>
          <span className="text-[9px] text-slate-500 block">Fit Index</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Team Size</span>
            <span className="text-sm font-bold text-white">{data.teamSize} Eng</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Conversion Prob</span>
            <span className="text-sm font-bold text-indigo-400">{data.conversionProbability}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Est. ARR</span>
            <span className="text-sm font-bold text-emerald-400">{data.estimatedAnnualValue}</span>
          </div>
        </div>

        {/* Horizontal SVG Fit Factors Bar Chart */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 font-mono text-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Fit Factor Breakdown (SVG Telemetry)
          </span>

          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Traffic Volume Match</span>
                <span>{data.fitFactors.trafficFit}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${data.fitFactors.trafficFit}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Team Scale & Readiness</span>
                <span>{data.fitFactors.teamFit}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${data.fitFactors.teamFit}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                <span>Budget Tier Alignment</span>
                <span>{data.fitFactors.budgetFit}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${data.fitFactors.budgetFit}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
