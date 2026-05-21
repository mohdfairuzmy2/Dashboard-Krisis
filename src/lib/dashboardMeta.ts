export type IllustrationId =
  | 'fuel'
  | 'cpi'
  | 'energy'
  | 'gdp'
  | 'market'
  | 'commodities'
  | 'tradeflow'
  | 'map'
  | 'news'

export type DashboardMeta = {
  path: string
  labelKey: string
  descKey: string
  categoryKey: string
  illustration: IllustrationId
  /** Muted illustration panel background */
  panelBg: string
}

export const DASHBOARD_CARDS: DashboardMeta[] = [
  {
    path: '/fuel',
    labelKey: 'nav.fuel.label',
    descKey: 'card.fuel.desc',
    categoryKey: 'card.fuel.category',
    illustration: 'fuel',
    panelBg: '#f8efe4',
  },
  {
    path: '/cpi',
    labelKey: 'nav.cpi.label',
    descKey: 'card.cpi.desc',
    categoryKey: 'card.cpi.category',
    illustration: 'cpi',
    panelBg: '#eef4eb',
  },
  {
    path: '/global-commodities',
    labelKey: 'nav.energy.label',
    descKey: 'card.energy.desc',
    categoryKey: 'card.energy.category',
    illustration: 'energy',
    panelBg: '#e8eef6',
  },
  {
    path: '/gdp',
    labelKey: 'nav.gdp.label',
    descKey: 'card.gdp.desc',
    categoryKey: 'card.gdp.category',
    illustration: 'gdp',
    panelBg: '#f5efe6',
  },
  {
    path: '/market',
    labelKey: 'nav.market.label',
    descKey: 'card.market.desc',
    categoryKey: 'card.market.category',
    illustration: 'market',
    panelBg: '#f0ecf5',
  },
  {
    path: '/commodities',
    labelKey: 'nav.commodities.label',
    descKey: 'card.commodities.desc',
    categoryKey: 'card.commodities.category',
    illustration: 'commodities',
    panelBg: '#e8f1f6',
  },
  {
    path: '/tradeflow',
    labelKey: 'nav.tradeflow.label',
    descKey: 'card.tradeflow.desc',
    categoryKey: 'card.tradeflow.category',
    illustration: 'tradeflow',
    panelBg: '#f6efe8',
  },
  {
    path: '/map',
    labelKey: 'nav.map.label',
    descKey: 'card.map.desc',
    categoryKey: 'card.map.category',
    illustration: 'map',
    panelBg: '#e6f0ec',
  },
  {
    path: '/news',
    labelKey: 'nav.news.label',
    descKey: 'card.news.desc',
    categoryKey: 'card.news.category',
    illustration: 'news',
    panelBg: '#faf3ea',
  },
]
