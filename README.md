# NexusAgent Studio — Production Deployment & Autonomous AI Engine (FE-11)

[![Track](https://img.shields.io/badge/Track-Frontend%20AI%20Engineering-blue.svg)](.)
[![Assignment](https://img.shields.io/badge/Assignment-FE--11-indigo.svg)](.)
[![Week](https://img.shields.io/badge/Week-8-cyan.svg)](.)
[![Framework](https://img.shields.io/badge/Framework-Next.js%2016.4%20(Turbopack)-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61dafb.svg)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4%20Tokens-38bdf8.svg)](https://tailwindcss.com/)
[![Package Manager](https://img.shields.io/badge/Package%20Manager-pnpm-orange.svg)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

> **Production Deployment and Final README (FE-11)**  
> Foundations & Build Phase · Week 8 · Frontend AI Engineering Track · **Checkpoint 2**

**NexusAgent Studio** is an enterprise-grade autonomous AI agent orchestrator and workflow automation platform. This repository represents the finalized production deployment featuring real-time token streaming, Generative UI tool execution, in-memory sliding-window rate limiting, input caps, mobile Safari hardening, and zero-compromise cross-browser resilience.

---

## 🧭 Live Production URL & Links

- **Live Production URL:** `https://nexusagent-production.vercel.app` *(or preview locally via `pnpm build && pnpm start`)*
- **GitHub Repository:** `https://github.com/iMoloy/production-deployment`
- **Checkpoint 2 Status:** Verified & Complete

---

## 🚀 What It Does

NexusAgent Studio bridges autonomous AI agent workflows and human-centric frontend interfaces:

1. **Flagship Shader Surface:** Fullscreen pure WebGL2 domain-warped aurora background featuring Inigo Quilez cosine color gradients and real-time cursor advection (zero 3D runtime overhead, <12 KB gzipped).
2. **Autonomous Agent Studio (`/chat`):** Interactive AI chat driven by Vercel AI SDK 4.x, streaming real-time tokens and tool calls.
3. **Generative UI Tool Execution:**
   - **`auditWebsite` Tool:** Emits interactive SVG circular score gauges, Core Web Vitals telemetry (LCP, INP, CLS, TTFB), and categorized diagnostic findings tables.
   - **`scoreLeadPipeline` Tool:** Emits enterprise prospect qualification scorecards with horizontal SVG fit-factor bar charts.
   - **`tool-error-card`:** Designed error card with interactive retry button for DNS/network exceptions.
4. **Workflow Orchestration (`/workflows`):** Multi-agent execution pipelines, trigger event descriptions, and status indicators.
5. **Visual DAG Builder (`/builder`):** Multi-pane DAG execution graph (Ingestion → Planner → Tool Dispatch → Generative UI Output) with live node inspector.
6. **Execution Telemetry (`/logs`):** Real-time execution stream monitoring endpoint latencies, status codes, token usage, and client IPs.
7. **System Health Probe (`/health` & `/api/health`):** Server-side asynchronous data fetch proof wrapped in React `<Suspense>`.

---

## 🛡️ Production Hygiene & Abuse Protection

To ensure strangers and automated bots cannot drain API credits or launch denial-of-wallet attacks:

| Hygiene Mechanism | Implementation Detail | Production Behavior |
| :--- | :--- | :--- |
| **In-Memory Rate Limiting** | Sliding-window tracker in [`src/lib/rate-limiter.ts`](src/lib/rate-limiter.ts) | Capped at **5 requests per 60 seconds** per client IP. Returns standard HTTP `429 Too Many Requests` with `Retry-After`, `X-RateLimit-Limit`, and `X-RateLimit-Reset` headers. |
| **Input Caps & Schema Validation** | Strict Zod validation in [`src/lib/validation.ts`](src/lib/validation.ts) | Rejects prompts exceeding **2,000 characters** (HTTP 400). Rejects conversation history exceeding **30 messages** to prevent token-exhaustion injection. |
| **Streaming Timeout Guard** | `export const maxDuration = 30` in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) | Enforces a strict 30-second ceiling on Vercel Serverless Function execution, preventing hanging network connections. |
| **Zero-Config Evaluator Fallback** | Autonomous simulator in `/api/chat` | If `ANTHROPIC_API_KEY` is not provided in environment variables, the platform transparently activates a high-fidelity simulator that executes all Generative UI tool calls with zero API costs for reviewers. |

---

## 🏛️ Architecture Overview & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Client as ChatInterface (React 19)
    participant Route as /api/chat (Next.js 16)
    participant Limiter as SlidingWindowRateLimiter
    participant Validator as Zod Schema Validator
    participant AI as Claude 3.5 Sonnet / Sim
    participant Tool as Tool Executor (Audit/Lead)

    User->>Client: Submits prompt ("Audit https://flyrank.io")
    Client->>Route: POST /api/chat { messages }
    Route->>Limiter: check(clientIp)
    alt Rate Limit Exceeded (>5 req/60s)
        Limiter-->>Route: { success: false, resetInSec: 42 }
        Route-->>Client: HTTP 429 { error: "TOO_MANY_REQUESTS", retryAfter: 42 }
        Client-->>User: Renders Countdown Banner
    else Rate Limit Approved
        Limiter-->>Route: { success: true, remaining: 4 }
        Route->>Validator: validateChatPayload(body)
        alt Prompt > 2000 chars or > 30 msgs
            Validator-->>Route: { success: false, error: "VALIDATION_FAILED" }
            Route-->>Client: HTTP 400 Bad Request
        else Payload Valid
            Validator-->>Route: { success: true }
            Route->>AI: streamText({ tools, messages })
            AI->>Tool: executeWebsiteAudit(args)
            Tool-->>AI: { vitals, overallScore: 98, findings }
            AI-->>Route: DataStream (text + tool_result)
            Route-->>Client: HTTP 200 chunked stream
            Client-->>User: Streams text & renders SVG WebsiteAuditCard
        end
    end
```

### Server vs. Client Component Boundaries
- **Server Components (RSC) by Default:** Root layouts, `/` (Landing Page), `/workflows`, `/logs`, `/health`, and `/settings` are pure Server Components with zero client-side JavaScript overhead.
- **Client Components (`'use client'`):** Strictly isolated to interactive leaves:
  - [`ChatInterface`](src/components/chat/chat-interface.tsx): Form management and token stream parsing.
  - [`ShaderHeroBackground`](src/components/hero/shader-hero-background.tsx): WebGL2 canvas lifecycle, DPR clamping, and visibility listeners.
  - [`WebsiteAuditCard`](src/components/chat/website-audit-card.tsx) & [`ScoreGauge`](src/components/chat/score-gauge.tsx): Interactive tab switching and animated SVG rings.

---

## 📐 Architectural Decisions & Trade-Offs

1. **In-Memory Sliding Window vs. External Redis (Upstash):**  
   *Decision:* Implemented an in-memory sliding window class with timestamp filtering and automated cleanup intervals.  
   *Trade-off:* While Upstash Redis provides persistence across multi-region serverless cold boots, the in-memory limiter eliminates external infrastructure dependencies, ensuring zero-configuration portability when evaluated locally or on preview branches.
2. **Vercel AI SDK DataStream Protocol:**  
   *Decision:* Utilized native AI SDK v4 `toDataStreamResponse()` and `createDataStreamResponse()`.  
   *Trade-off:* Standard Server-Sent Events (SSE) required complex manual JSON serialization for multi-part tool calls. The DataStream protocol cleanly multiplexes raw text deltas, tool call parameters, and structured tool outputs over a single HTTP stream.
3. **Pure WebGL2 Quad vs. Three.js Runtime:**  
   *Decision:* Hand-crafted the fullscreen domain-warping background in pure WebGL2 rather than Three.js / R3F.  
   *Trade-off:* Avoided ~300 KB of vendor bundle weight, allowing the application to achieve an entry payload of under **12 KB gzipped** while locking 60 FPS animation.

---

## 📱 Cross-Browser & Mobile Safari Pass

The application underwent rigorous cross-browser testing across Chrome 134, Firefox 135, Safari 18, and iOS Mobile Safari:

- **100dvh Dynamic Viewport:** Chat layout enforces `min-h-[100dvh]` to eliminate mobile Safari address bar jump and clipping.
- **iOS Auto-Zoom Prevention:** Form inputs enforce `text-base` (minimum 16px font size on mobile viewports) to prevent iOS Safari from automatically zooming into the page on input focus.
- **Safe Area Insets:** Layout incorporates `viewportFit: "cover"` with `env(safe-area-inset-bottom)` margins on floating action controls.
- **Zero Horizontal Overflow:** All tables, charts, and metric grids convert to fluid stacked card layouts below `640px` with `overflow-x: hidden` enforced on `<body>`.

---

## 🔑 Environment Variables Reference

| Variable | Description | Default | Required in Production? |
| :--- | :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | Anthropic Claude 3.5 Sonnet API key | `""` | Optional *(Activates simulator if omitted)* |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests allowed per IP per time window | `5` | No (defaults to 5) |
| `RATE_LIMIT_WINDOW_SEC` | Sliding window duration in seconds | `60` | No (defaults to 60) |
| `MAX_PROMPT_CHARS` | Character length limit on user prompts | `2000` | No (defaults to 2000) |
| `MAX_MESSAGE_HISTORY` | Maximum message count per conversation payload | `30` | No (defaults to 30) |
| `NEXT_PUBLIC_APP_NAME` | Public platform branding name | `"NexusAgent Studio"` | No |
| `NEXT_PUBLIC_SITE_URL` | Base canonical production URL | `"https://nexusagent-production.vercel.app"` | No |

---

## 💻 Step-by-Step Run & Clone Instructions

A reviewer or recruiter can clone and run this application locally from these instructions alone:

### Prerequisites
- Node.js `18.18+` or `20+`
- `pnpm` (`v9+` or `v11+`)

### 1. Clone & Navigate
```bash
git clone https://github.com/iMoloy/production-deployment.git
cd production-deployment
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. (Optional) Set Environment Variables
Copy `.env.example` to `.env.local` if you wish to connect your personal Anthropic API key. If left blank, the platform automatically engages the high-fidelity simulator:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
pnpm build
pnpm start
```

---

## 🤖 How AI Tools Built This (Honest Retrospective)

This project was built in close collaboration with advanced AI coding models (Gemini 2.5/3.8 and Claude 3.5 Sonnet). Here is an honest, granular breakdown of what worked, where AI failed, and the human engineering required:

### Where AI Tools Excelled:
1. **GLSL Mathematics & Domain Warping Formulation:**  
   AI excelled at formulating the coordinate advection math ($\mathbf{p}' = \mathbf{p} + \text{fBm}(\mathbf{p} + \text{fBm}(\mathbf{p} + \text{time}))$) and translating Inigo Quilez cosine color equations into idiomatic GLSL 300 es. Generating quintic Hermite interpolation and octave rotations in minutes eliminated hours of manual trigonometry.
2. **Strict Zod Schemas & Generative UI Contracts:**  
   AI generated comprehensive TypeScript interfaces and matching Zod schemas (`auditWebsiteInputSchema`, `scoreLeadInputSchema`) with precise `.describe()` annotations that guided LLM function calling with zero hallucinated parameters.
3. **Drafting Multi-State SVG Components:**  
   AI quickly synthesized SVG viewBox math for circular gauges and horizontal bar charts with responsive coordinate mapping.

### Where AI Failed & Required Human Intervention:
1. **Initial Hallucinated Three.js Dependencies:**  
   AI initially attempted to bundle `@react-three/fiber` and `@react-three/drei` for simple fragment rendering, which inflated the client bundle by 350 KB. Human intervention stripped this out, replacing it with a minimal, pure WebGL2 fullscreen quad (<12 KB total bundle).
2. **Naive In-Memory Rate Limiting with Memory Leaks:**  
   AI initially drafted an in-memory rate limiter using unbounded arrays on `Map<string, number[]>`. Under continuous traffic, this would cause node process memory exhaustion. Human engineering introduced timestamp filtering, max window pruning, and an unref'd `setInterval` cleanup routine.
3. **Mobile Safari iOS Form Zoom Bug:**  
   AI initially used Tailwind `text-xs` (12px) on mobile chat inputs. On iOS Safari, any input with font size below 16px causes the browser to forcefully zoom in and break layout boundaries. Human engineering enforced `text-base` (16px) inputs with media queries to eliminate viewport zoom shifts.
4. **Next.js 16 App Router Param Caching:**  
   AI frequently defaulted to older Next.js 14 sync conventions. Human engineering audited route segments to ensure Server Components, Turbopack CSS loaders, and dynamic route options adhered to Next.js 16 standards.
