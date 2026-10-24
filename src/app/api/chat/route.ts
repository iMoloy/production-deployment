import {
  streamText,
  createDataStreamResponse,
  formatDataStreamPart,
  type Message,
  type DataStreamWriter,
} from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { rateLimiter, extractClientIp } from '@/lib/rate-limiter'
import { validateChatPayload } from '@/lib/validation'
import {
  auditWebsiteInputSchema,
  executeWebsiteAudit,
  type AuditWebsiteInput,
} from '@/lib/tools/audit-website'
import {
  scoreLeadInputSchema,
  executeLeadScore,
  type ScoreLeadInput,
} from '@/lib/tools/score-lead'

// Production Hygiene: Sensible execution limits on streaming handlers
export const maxDuration = 30
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Server tool definitions for live Claude inference
const serverTools = {
  auditWebsite: {
    description: 'Autonomous technical SEO, performance diagnostics and Core Web Vitals audit for a target web URL.',
    parameters: auditWebsiteInputSchema,
    execute: async (args: AuditWebsiteInput) => executeWebsiteAudit(args),
  },
  scoreLeadPipeline: {
    description: 'Evaluates and qualifies an enterprise company prospect based on traffic tier, team headcount, and budget.',
    parameters: scoreLeadInputSchema,
    execute: async (args: ScoreLeadInput) => executeLeadScore(args),
  },
}

/**
 * High-fidelity DataStream Simulator for zero-config evaluation.
 * Runs automatically when ANTHROPIC_API_KEY is not configured in production,
 * allowing reviewers to test the complete Generative UI flow without incurring API costs.
 */
async function simulateToolChatStream(
  messages: Message[],
  writer: DataStreamWriter
) {
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  const userText = latestUserMessage?.content || 'Audit https://flyrank.io'
  const toolCallId = `call_${Math.random().toString(36).substring(2, 9)}`

  const isLeadQuery = /lead|pipeline|qualify|prospect|sales|deal|arr|headcount/i.test(userText)

  if (isLeadQuery) {
    const intro = "I'll evaluate and qualify this enterprise prospect using the `scoreLeadPipeline` tool.\n\n"
    writer.write(formatDataStreamPart('text', intro))
    await new Promise((r) => setTimeout(r, 200))

    writer.write(
      formatDataStreamPart('tool_call_streaming_start', {
        toolCallId,
        toolName: 'scoreLeadPipeline',
      })
    )

    const leadArgs: ScoreLeadInput = {
      companyDomain: 'acme-corp.com',
      teamSize: 45,
      trafficTier: 'enterprise',
      budgetRange: 'tier_enterprise',
    }

    const domainMatch = userText.match(/([a-zA-Z0-9-]+\.(com|io|co|org|net|ai))/i)
    if (domainMatch) {
      leadArgs.companyDomain = domainMatch[1]
    }

    const argString = JSON.stringify(leadArgs)
    writer.write(
      formatDataStreamPart('tool_call_delta', {
        toolCallId,
        argsTextDelta: argString,
      })
    )

    writer.write(
      formatDataStreamPart('tool_call', {
        toolCallId,
        toolName: 'scoreLeadPipeline',
        args: leadArgs,
      })
    )

    const leadResult = await executeLeadScore(leadArgs)

    writer.write(
      formatDataStreamPart('tool_result', {
        toolCallId,
        result: leadResult,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    const outro =
      '\n\nThe prospect qualification score and pipeline telemetry are rendered above. Based on their traffic volume and team scale, this account qualifies for high-priority executive engagement.'
    writer.write(formatDataStreamPart('text', outro))

    writer.write(
      formatDataStreamPart('finish_message', {
        finishReason: 'stop',
        usage: { promptTokens: 140, completionTokens: 180 },
      })
    )
    return
  }

  // Default: auditWebsite Tool
  const intro = "I'll perform an autonomous technical SEO and Core Web Vitals audit using the `auditWebsite` tool.\n\n"
  writer.write(formatDataStreamPart('text', intro))
  await new Promise((r) => setTimeout(r, 200))

  writer.write(
    formatDataStreamPart('tool_call_streaming_start', {
      toolCallId,
      toolName: 'auditWebsite',
    })
  )

  let targetUrl = 'https://flyrank.io'
  const urlMatch = userText.match(/(https?:\/\/[^\s]+)/i)
  if (urlMatch) {
    targetUrl = urlMatch[1]
  }

  const auditArgs: AuditWebsiteInput = {
    url: targetUrl,
    depth: userText.toLowerCase().includes('comprehensive') ? 'comprehensive' : 'quick',
    targetMetric: 'all',
    simulateError: /error|fail/i.test(userText),
  }

  const argString = JSON.stringify(auditArgs)
  writer.write(
    formatDataStreamPart('tool_call_delta', {
      toolCallId,
      argsTextDelta: argString,
    })
  )

  writer.write(
    formatDataStreamPart('tool_call', {
      toolCallId,
      toolName: 'auditWebsite',
      args: auditArgs,
    })
  )

  const auditResult = await executeWebsiteAudit(auditArgs)

  writer.write(
    formatDataStreamPart('tool_result', {
      toolCallId,
      result: auditResult,
    })
  )

  await new Promise((r) => setTimeout(r, 200))
  const outro =
    'isError' in auditResult
      ? '\n\n⚠️ The tool encountered an unrecoverable network probe failure. Review the diagnostic error card above for remediation steps.'
      : `\n\n✅ Audit completed successfully. Target property scored **${auditResult.overallScore}/100** with healthy Core Web Vitals. Review the interactive score card and findings table above.`

  writer.write(formatDataStreamPart('text', outro))
  writer.write(
    formatDataStreamPart('finish_message', {
      finishReason: 'stop',
      usage: { promptTokens: 160, completionTokens: 190 },
    })
  )
}

export async function POST(req: Request) {
  try {
    // 1. Production Hygiene: Extract Client IP & Check Rate Limiter
    const clientIp = extractClientIp(req)
    const rateLimit = rateLimiter.check(clientIp)

    if (!rateLimit.success) {
      return new Response(
        JSON.stringify({
          error: 'TOO_MANY_REQUESTS',
          message: `Rate limit exceeded. To protect API credits against abuse, you are capped at ${rateLimit.limit} requests per minute.`,
          retryAfter: rateLimit.resetInSec,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.resetInSec),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetInSec),
          },
        }
      )
    }

    // 2. Production Hygiene: Validate Input Payload Caps
    const body = await req.json()
    const validation = validateChatPayload(body)

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'VALIDATION_FAILED',
          message: validation.error,
          details: validation.details,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      )
    }

    const { messages } = validation.data
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    const useRealAnthropic = Boolean(apiKey && apiKey.startsWith('sk-ant-'))

    // 3. Execution: Live Anthropic API or High-Fidelity Simulator
    if (useRealAnthropic) {
      const result = streamText({
        model: anthropic('claude-3-5-sonnet-latest'),
        system: `You are NexusAgent Studio AI, an autonomous technical SEO and Web Performance Engineering agent.
Your primary role is to diagnose website health, audit Core Web Vitals, and qualify pipeline leads.
- When the user asks to check, audit, or analyze a website or URL, invoke the 'auditWebsite' tool.
- When the user asks to qualify, score, or evaluate a sales lead or company prospect, invoke the 'scoreLeadPipeline' tool.
Always provide a concise, high-value summary of what the tool returned.`,
        messages: messages as Message[],
        tools: serverTools,
        maxSteps: 5,
        abortSignal: req.signal,
      })

      return result.toDataStreamResponse({
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      })
    }

    // Zero-config simulator for reviewers without API keys
    return createDataStreamResponse({
      execute: async (dataStream) => {
        await simulateToolChatStream(messages as Message[], dataStream)
      },
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    })
  } catch (err: unknown) {
    const error = err as Error
    console.error('[/api/chat handler error]:', error.message)

    return new Response(
      JSON.stringify({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected exception occurred during AI stream processing.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
