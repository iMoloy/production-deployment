import { z } from 'zod'
import type { LeadScoreResult } from '@/types/tools'

export const scoreLeadInputSchema = z.object({
  companyDomain: z
    .string()
    .describe('Domain or brand name of the target organization (e.g. "acme.corp" or "stripe.com")'),
  trafficTier: z
    .enum(['starter', 'growth', 'enterprise'])
    .describe('Monthly traffic volume estimation'),
  teamSize: z
    .number()
    .min(1)
    .max(50000)
    .describe('Estimated headcount of engineering / growth organization'),
  budgetRange: z
    .enum(['tier_starter', 'tier_growth', 'tier_enterprise'])
    .describe('Annual AI tooling budget allocation tier'),
})

export type ScoreLeadInput = z.infer<typeof scoreLeadInputSchema>

export async function executeLeadScore(input: ScoreLeadInput): Promise<LeadScoreResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const isEnterprise = input.budgetRange === 'tier_enterprise' || input.teamSize > 150
  const isGrowth = input.trafficTier === 'growth' || input.budgetRange === 'tier_growth'

  const score = isEnterprise ? 94 : isGrowth ? 81 : 62
  const conversionProb = isEnterprise ? 88 : isGrowth ? 72 : 45
  const valueEst = isEnterprise ? '$72,000 / yr' : isGrowth ? '$28,000 / yr' : '$6,000 / yr'

  return {
    companyDomain: input.companyDomain,
    trafficTier: input.trafficTier,
    teamSize: input.teamSize,
    budgetRange: input.budgetRange,
    qualificationScore: score,
    tier: isEnterprise
      ? 'Tier 1 — High Priority Enterprise'
      : isGrowth
      ? 'Tier 2 — Growth Account'
      : 'Tier 3 — Self-Service / Nurture',
    conversionProbability: conversionProb,
    estimatedAnnualValue: valueEst,
    fitFactors: {
      trafficFit: input.trafficTier === 'enterprise' ? 95 : input.trafficTier === 'growth' ? 80 : 60,
      teamFit: input.teamSize > 200 ? 98 : input.teamSize > 30 ? 82 : 55,
      budgetFit: input.budgetRange === 'tier_enterprise' ? 96 : input.budgetRange === 'tier_growth' ? 78 : 50,
    },
    recommendedPlaybook: isEnterprise
      ? 'White-Glove Executive POC with Custom Agent Architecture Session'
      : isGrowth
      ? 'Direct Self-Serve Onboarding with 14-day Enterprise Trial'
      : 'Automated Product-Led Growth Email Sequence',
    keyDrivers: [
      `Headcount scale of ${input.teamSize} indicates active engineering investment.`,
      `Budget allocation matches ${input.budgetRange.replace('tier_', '').toUpperCase()} bracket.`,
      `Domain ${input.companyDomain} aligns with target ideal customer profile (ICP).`,
    ],
  }
}
