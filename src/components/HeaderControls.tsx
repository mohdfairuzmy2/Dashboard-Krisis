import { Calendar, Moon, Sun } from 'lucide-react'
import { useMemo } from 'react'
import { useI18n, type Lang } from '../lib/i18n'
import { useTheme } from '../lib/theme'

function formatHeaderDate(lang: Lang): string {
  const locale = lang === 'ms' ? 'ms-MY' : 'en-GB'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())
}

export function HeaderControls() {
  const { lang, setLang, tr } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const dateLabel = useMemo(() => formatHeaderDate(lang), [lang])

  return (
    <div className="header-controls">
      <time className="header-date" dateTime={new Date().toISOString().slice(0, 10)}>
        <Calendar className="header-date__icon" strokeWidth={1.75} aria-hidden />
        <span>{dateLabel}</span>
      </time>

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? tr('theme.toDark') : tr('theme.toLight')}
        title={theme === 'light' ? tr('theme.toDark') : tr('theme.toLight')}
      >
        {theme === 'light' ? (
          <Moon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden />
        ) : (
          <Sun className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden />
        )}
      </button>

      <button
        type="button"
        onClick={() => setLang(lang === 'ms' ? 'en' : 'ms')}
        className="lang-toggle"
        aria-label="Toggle language"
      >
        {lang === 'ms' ? 'English' : 'Bahasa Melayu'}
      </button>
    </div>
  )
}
