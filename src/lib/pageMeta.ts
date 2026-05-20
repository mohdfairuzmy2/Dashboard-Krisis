import { useLocation } from 'react-router-dom'
import { DASHBOARD_CARDS } from './dashboardMeta'
import { useI18n } from './i18n'

export function usePageMeta() {
  const { pathname } = useLocation()
  const { tr } = useI18n()
  const card = DASHBOARD_CARDS.find((c) => c.path === pathname)
  return {
    category: card ? tr(card.categoryKey) : undefined,
  }
}
