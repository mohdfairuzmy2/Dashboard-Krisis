export function formatRM(value: number | null | undefined, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `RM ${value.toLocaleString('ms-MY', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

export function formatUSD(value: number | null | undefined, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

export function formatBn(value: number): string {
  if (value >= 1e9) return `RM ${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `RM ${(value / 1e6).toFixed(0)}M`
  return formatRM(value, 0)
}

export function formatPct(value: number | null | undefined, signed = true): string {
  if (value == null || Number.isNaN(value)) return '—'
  const prefix = signed && value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

export function formatDeltaRM(delta: number | null | undefined, decimals = 2): string {
  if (delta == null || Number.isNaN(delta)) return '—'
  const prefix = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return `${prefix}RM ${Math.abs(delta).toFixed(decimals)}`
}

export function formatDate(iso: string, locale: 'ms' | 'en' = 'ms'): string {
  return new Date(iso).toLocaleDateString(locale === 'ms' ? 'ms-MY' : 'en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function riskColor(level: string): string {
  switch (level?.toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
      return 'text-negative bg-red-50 border-red-200'
    case 'MODERATE':
      return 'text-warning bg-amber-50 border-amber-200'
    default:
      return 'text-positive bg-emerald-50 border-emerald-200'
  }
}
