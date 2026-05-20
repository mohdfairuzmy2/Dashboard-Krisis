import type { GeopoliticalAnalysis, GeoEvent, GeoIssueBlock, GeoRecommendation, GeoTrendBlock } from './types'

export function asTrendBlocks(
  value: GeopoliticalAnalysis['whatIsHappening'],
): GeoTrendBlock[] {
  if (!value) return []
  if (typeof value === 'string') return [{ title: '', detail: value }]
  return value
}

export function asIssueBlocks(value: GeopoliticalAnalysis['whatIsWrong']): GeoIssueBlock[] {
  if (!value) return []
  if (typeof value === 'string') return [{ title: '', detail: value }]
  return value
}

export function asRecommendations(
  value: GeopoliticalAnalysis['recommendations'],
): GeoRecommendation[] {
  if (!value) return []
  if (typeof value === 'string') return [{ title: '', detail: value }]
  if (typeof value[0] === 'string') {
    return (value as string[]).map((detail) => ({ title: '', detail }))
  }
  return value as GeoRecommendation[]
}

export function trendBadgeClass(trend?: string): string {
  switch (trend?.toLowerCase()) {
    case 'worsening':
      return 'geo-badge geo-badge--down'
    case 'improving':
      return 'geo-badge geo-badge--up'
    default:
      return 'geo-badge geo-badge--neutral'
  }
}

export function severityBadgeClass(severity?: string): string {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'geo-badge geo-badge--critical'
    case 'high':
      return 'geo-badge geo-badge--down'
    default:
      return 'geo-badge geo-badge--neutral'
  }
}

export function eventImpactClass(impact?: string): string {
  switch (impact?.toLowerCase()) {
    case 'high':
      return 'geo-badge geo-badge--down'
    case 'positive':
      return 'geo-badge geo-badge--up'
    default:
      return 'geo-badge geo-badge--neutral'
  }
}

export function eventKey(e: GeoEvent, index: number): string {
  return `${e.date}-${e.title ?? e.desc.slice(0, 32)}-${index}`
}

export function geoSummaryText(geo: GeopoliticalAnalysis | null, maxLen = 120): string | undefined {
  if (!geo) return undefined
  const raw =
    geo.timelineSummary ??
    asTrendBlocks(geo.whatIsHappening)[0]?.detail ??
    (typeof geo.whatIsHappening === 'string' ? geo.whatIsHappening : '')
  if (!raw) return undefined
  return raw.length > maxLen ? `${raw.slice(0, maxLen)}…` : raw
}
