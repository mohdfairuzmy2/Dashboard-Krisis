import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  source?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, source, children, className = '' }: Props) {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-3 border-b border-[var(--color-border-soft)]">
        <h3 className="font-display text-lg font-semibold text-[var(--color-ink)] tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-[var(--color-ink-muted)] mt-1">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
      {source && (
        <div className="px-5 py-3 border-t border-[var(--color-border-soft)] bg-[var(--color-cream)]">
          <p className="text-[11px] text-[var(--color-category)] tracking-wide">{source}</p>
        </div>
      )}
    </div>
  )
}
