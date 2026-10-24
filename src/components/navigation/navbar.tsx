'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cpu, Menu, X, Sparkles, ExternalLink } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/chat', label: 'Agent Studio' },
  { href: '/workflows', label: 'Workflows' },
  { href: '/builder', label: 'DAG Builder' },
  { href: '/logs', label: 'Execution Logs' },
  { href: '/health', label: 'Health' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 text-white group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-inner">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
                NexusAgent
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Autonomous AI & Workflow Engine · FE-11
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors min-h-11 flex items-center ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Action */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20 min-h-11 min-w-11"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </Link>

          <a
            href="https://github.com/iMoloy/production-deployment"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="GitHub Repository"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 min-h-11 min-w-11 flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#090d16] px-4 pt-2 pb-4 space-y-1 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2">
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm min-h-11"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Agent Studio</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
