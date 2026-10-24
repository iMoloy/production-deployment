import { NextResponse } from 'next/server'
import { rateLimiter } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = process.uptime()
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  const hasValidApiKey = Boolean(apiKey && apiKey.startsWith('sk-ant-'))

  const telemetry = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(startTime),
    environment: process.env.NODE_ENV || 'production',
    service: 'NexusAgent Studio API (FE-11)',
    version: '1.0.0-production',
    aiProvider: {
      activeEngine: hasValidApiKey ? 'Anthropic Claude 3.5 Sonnet' : 'High-Fidelity Autonomous Simulator',
      configured: hasValidApiKey,
      streamingMaxDurationSec: 30,
    },
    productionHygiene: {
      rateLimiter: rateLimiter.getTelemetry(),
      maxPromptLengthChars: parseInt(process.env.MAX_PROMPT_CHARS || '2000', 10),
      maxHistoryMessages: parseInt(process.env.MAX_MESSAGE_HISTORY || '30', 10),
      abuseProtectionStatus: 'ACTIVE',
    },
  }

  return NextResponse.json(telemetry, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Health-Check': 'PASS',
    },
  })
}
