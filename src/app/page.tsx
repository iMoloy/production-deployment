import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { ShaderHeroBackground } from '@/components/hero/shader-hero-background'

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Fullscreen WebGL2 Shader Surface */}
      <ShaderHeroBackground />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center max-w-5xl mx-auto z-10">
        {/* Production Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md mb-8 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
            FE-11 · Week 8 Production Deployment
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-indigo-400">
            Next.js 16 + React 19
          </span>
        </div>

        {/* Main Headline */}
        <div className="relative">
          <div
            className="absolute -inset-x-12 -inset-y-6 -z-10 rounded-3xl bg-[#090d16]/70 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Autonomous Agents.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-slate-400">
              Hardened for Production.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed bg-[#090d16]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          A full-stack AI engineering platform combining real-time token streaming, Generative UI tool execution,
          in-memory sliding-window rate limiting, and zero-compromise cross-browser resilience.
        </p>

        {/* Primary CTA Group */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/chat"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-xl shadow-indigo-600/25 min-h-11 min-w-11"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Agent Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/builder"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-mono text-xs sm:text-sm transition-all min-h-11 min-w-11"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Explore Visual DAG</span>
          </Link>

          <Link
            href="/health"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white border border-white/5 font-mono text-xs sm:text-sm transition-all min-h-11 min-w-11"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Telemetry</span>
          </Link>
        </div>

        {/* Live Production Hygiene Matrix (Audit requirement) */}
        <section aria-label="Production Hygiene Controls" className="w-full mt-16 text-left">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Production Hygiene & Abuse Protection Verification
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Protects API quotas against credit draining and unauthorized denial-of-wallet vectors
                </p>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hygiene Enforced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Rate Limiting</span>
                <span className="text-sm font-bold text-emerald-400">5 req / 60s</span>
                <p className="text-[10px] text-slate-400">In-memory sliding window per IP with 429 Retry-After</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Input Caps</span>
                <span className="text-sm font-bold text-indigo-400">2,000 Chars</span>
                <p className="text-[10px] text-slate-400">Strict Zod schema validation; caps token exploitation</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Streaming Timeout</span>
                <span className="text-sm font-bold text-cyan-400">maxDuration = 30s</span>
                <p className="text-[10px] text-slate-400">Prevents hanging serverless functions on Vercel Edge</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Zero-Config Mode</span>
                <span className="text-sm font-bold text-purple-400">Autonomous Sim</span>
                <p className="text-[10px] text-slate-400">Zero-cost evaluation fallback for recruiters</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
