import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { GitBranch, Play } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Workflows | NexusAgent Production (FE-11)',
  description: 'Autonomous multi-agent execution pipelines and automated triggers.',
}

const WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Autonomous Technical SEO & Performance Ingestion',
    status: 'Active',
    trigger: 'Webhook / Scheduled (Every 6h)',
    agents: ['Audit Specialist', 'Lighthouse Runner', 'DOM Extractor'],
    lastRun: '12 minutes ago',
    runsToday: 24,
  },
  {
    id: 'wf-2',
    name: 'Enterprise Pipeline Qualification & Scoring',
    status: 'Active',
    trigger: 'CRM Form Webhook / Ingestion API',
    agents: ['Prospect Qualifier', 'Fit Factor Synthesizer'],
    lastRun: '42 minutes ago',
    runsToday: 18,
  },
  {
    id: 'wf-3',
    name: 'Core Web Vitals Remediation & Patch Generator',
    status: 'Paused',
    trigger: 'Manual Human-in-the-Loop Gate',
    agents: ['Diff Synthesizer', 'Pull Request Author'],
    lastRun: 'Yesterday',
    runsToday: 0,
  },
]

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <GitBranch className="w-6 h-6 text-indigo-400" />
              Workflow Orchestration
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Multi-agent event pipelines, autonomous triggers, and execution schedules
            </p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors self-start sm:self-auto min-h-11"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Pipeline in Studio</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {WORKFLOWS.map((wf) => (
            <div
              key={wf.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-indigo-500/40 transition-all shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      wf.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <h2 className="text-sm sm:text-base font-bold text-white">{wf.name}</h2>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      wf.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {wf.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 block">TRIGGER</span>
                  <span>{wf.trigger}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CONNECTED AGENTS</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {wf.agents.map((ag) => (
                      <span key={ag} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">TELEMETRY</span>
                  <span>{wf.runsToday} runs today · Last: {wf.lastRun}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
