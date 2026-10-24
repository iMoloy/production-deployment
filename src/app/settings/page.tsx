import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { Settings, Shield, Key } from 'lucide-react'

export const metadata = {
  title: 'Workspace Settings | NexusAgent Production (FE-11)',
  description: 'Masked API provider credentials, production rate limits, and security controls.',
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="border-b border-white/10 pb-5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-indigo-400" />
            Workspace & Production Settings
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage provider credentials, rate limiting quotas, and platform configurations
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Provider Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>AI Provider Configuration</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              API keys are encrypted in Vercel Environment Variables. Never exposed to browser clients.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <div>
                  <span className="text-white font-bold block">ANTHROPIC_API_KEY</span>
                  <span className="text-[10px] text-slate-500">Claude 3.5 Sonnet Engine</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  MASKED & SECURE
                </span>
              </div>
            </div>
          </div>

          {/* Rate Limit Quota Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Production Hygiene & Abuse Limits</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 block">BURST RATE LIMIT</span>
                <span className="text-sm font-bold text-emerald-400">5 requests / 60 seconds</span>
                <span className="text-[10px] text-slate-400 block">Sliding window per IP address</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 block">MAX PROMPT LENGTH</span>
                <span className="text-sm font-bold text-indigo-400">2,000 characters max</span>
                <span className="text-[10px] text-slate-400 block">Zod schema payload validation</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
