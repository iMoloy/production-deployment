'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { Layers, Play } from 'lucide-react'
import Link from 'next/link'

const DAG_NODES = [
  { id: '1', name: 'Ingestion Trigger', type: 'Trigger', status: 'ready', desc: 'Accepts HTTP webhooks & prompt queries' },
  { id: '2', name: 'Planner & Router', type: 'LLM Agent', status: 'ready', desc: 'Claude 3.5 Sonnet / Vercel AI SDK planner' },
  { id: '3', name: 'auditWebsite Tool', type: 'Tool Dispatch', status: 'ready', desc: 'Runs Core Web Vitals & diagnostic extraction' },
  { id: '4', name: 'scoreLead Tool', type: 'Tool Dispatch', status: 'ready', desc: 'Calculates enterprise fit score & ARR' },
  { id: '5', name: 'Generative UI Synthesis', type: 'UI Output', status: 'ready', desc: 'Emits React SVG cards & findings table' },
]

export default function BuilderPage() {
  const [selectedNode, setSelectedNode] = useState(DAG_NODES[1])

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              Visual DAG Agent Builder
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Directed Acyclic Graph orchestrator for multi-agent execution
            </p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors min-h-11"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute Live in Studio</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Canvas */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Execution Graph (5 Nodes)
            </span>

            <div className="space-y-3">
              {DAG_NODES.map((node, index) => {
                const isSelected = selectedNode.id === node.id
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-lg'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white">{node.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono">{node.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {node.type}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Node Inspector Drawer */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white uppercase text-[11px]">Node Inspector</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                VALIDATED
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-500 block">NODE NAME</span>
                <span className="text-white font-bold">{selectedNode.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">NODE TYPE</span>
                <span className="text-indigo-300">{selectedNode.type}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DESCRIPTION</span>
                <p className="text-slate-300 text-[11px] font-sans mt-0.5">{selectedNode.desc}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">EXECUTION TIMEOUT</span>
                <span className="text-cyan-300">30 seconds (Vercel maxDuration)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ABUSE GUARD</span>
                <span className="text-emerald-400">Sliding Window Rate Limiter Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
