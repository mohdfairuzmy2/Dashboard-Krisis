import clsx from 'clsx'

type Props = {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function KpiCard({ label, value, sub, trend }: Props) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-category)]">{label}</p>
      <p className="text-2xl sm:text-hxs font-display font-bold text-[var(--color-ink)] tracking-tight">{value}</p>
      {sub && (
        <p
          className={clsx(
            'text-sm',
            trend === 'up' && 'text-[var(--color-positive)]',
            trend === 'down' && 'text-[var(--color-negative)]',
            !trend && 'text-[var(--color-ink-muted)]',
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
