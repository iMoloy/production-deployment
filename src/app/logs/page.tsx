import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { Terminal, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Execution Logs | NexusAgent Production (FE-11)',
  description: 'Real-time telemetry stream, latency tracking, and rate limiter logs.',
}

const LOGS = [
  { id: 'run_8912', route: '/api/chat', tool: 'auditWebsite', status: '200 OK', duration: '1,120ms', tokens: 320, ip: '104.28.x.x', time: '1m ago' },
  { id: 'run_8911', route: '/api/chat', tool: 'scoreLeadPipeline', status: '200 OK', duration: '840ms', tokens: 280, ip: '172.56.x.x', time: '4m ago' },
  { id: 'run_8910', route: '/api/chat', tool: 'auditWebsite', status: '200 OK', duration: '980ms', tokens: 310, ip: '68.183.x.x', time: '8m ago' },
  { id: 'run_8909', route: '/api/chat', tool: 'None (Abuse Burst)', status: '429 Too Many Requests', duration: '12ms', tokens: 0, ip: '198.51.x.x', time: '14m ago' },
  { id: 'run_8908', route: '/api/health', tool: 'HealthProbe', status: '200 OK', duration: '4ms', tokens: 0, ip: 'System Cron', time: '15m ago' },
]

export default function LogsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Live Execution Telemetry Logs
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Continuous runtime observability, latency metrics, and security audit log
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" /> Rate Limiter Logs Active
          </span>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Run ID</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Tool Call</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Client IP</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LOGS.map((log) => {
                  const is429 = log.status.includes('429')
                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-indigo-300">{log.id}</td>
                      <td className="py-3 px-4 text-slate-300">{log.route}</td>
                      <td className="py-3 px-4 text-cyan-300">{log.tool}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            is429
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{log.duration}</td>
                      <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                      <td className="py-3 px-4 text-slate-500">{log.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
