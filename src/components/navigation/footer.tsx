import Link from 'next/link'
import { ShieldCheck, Cpu } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#070b12] py-8 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>NexusAgent Studio v1.0 Production · Week 8 (FE-11)</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Rate Limiter & Abuse Guard Active
          </span>
          <span>·</span>
          <Link href="/health" className="hover:text-white transition-colors">
            Telemetry Probe
          </Link>
          <span>·</span>
          <a
            href="https://github.com/iMoloy/production-deployment"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
