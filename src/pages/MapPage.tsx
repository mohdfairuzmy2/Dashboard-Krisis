import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { getTradePartners, loadStatic } from '../lib/api'
import type { TradePartner } from '../lib/types'
import { formatBn } from '../lib/format'
import { SectionHeader } from '../components/SectionHeader'
import { usePageMeta } from '../lib/pageMeta'
import { useI18n } from '../lib/i18n'
import clsx from 'clsx'

const COUNTRY_COORDS: Record<string, [number, number]> = {
  JAPAN: [36.2, 138.3],
  'KOREA, REPUBLIC OF': [36.5, 127.9],
  CHINA: [35.9, 104.2],
  'CHINA, PEOPLE\'S REPUBLIC OF': [35.9, 104.2],
  THAILAND: [15.9, 100.9],
  'TAIWAN, PROVINCE OF CHINA': [23.7, 121.0],
  PHILIPPINES: [12.9, 121.8],
  'VIET NAM': [14.1, 108.3],
  SINGAPORE: [1.35, 103.8],
  INDIA: [20.6, 78.9],
  AUSTRALIA: [-25.3, 133.8],
  'UNITED STATES': [39.8, -98.6],
  NETHERLANDS: [52.1, 5.3],
  'UNITED ARAB EMIRATES': [23.4, 53.8],
  'SAUDI ARABIA': [23.9, 45.1],
  INDONESIA: [-0.8, 113.9],
  MALAYSIA: [4.2, 101.9],
  BRUNEI: [4.5, 114.7],
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 3)
  }, [map, center])
  return null
}

export function MapPage() {
  const { tr, lang } = useI18n()
  const { category } = usePageMeta()
  const [partners, setPartners] = useState<TradePartner[]>([])
  const [product, setProduct] = useState('LNG')
  const [trade, setTrade] = useState<'EXPORTS' | 'IMPORTS'>('EXPORTS')

  useEffect(() => {
    loadStatic<TradePartner[]>('/data/trade-partners.json').then(setPartners)
  }, [])

  const top = getTradePartners(partners, product, trade, 12)
  const maxVal = top[0]?.totalValue ?? 1

  return (
    <div>
      <SectionHeader category={category} title={tr('section.map.title')} subtitle={tr('section.map.subtitle')} />

      <div className="flex flex-wrap gap-2 mb-4">
        {['LNG', 'CRUDE OIL', 'REFINED PETROLEUM'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProduct(p)}
            className={clsx('filter-btn', product === p && 'filter-btn--active')}
          >
            {p}
          </button>
        ))}
        {(['EXPORTS', 'IMPORTS'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrade(t)}
            className={clsx('filter-btn filter-btn--accent', trade === t && 'filter-btn--active')}
          >
            {t === 'EXPORTS' ? (lang === 'ms' ? 'Eksport' : 'Exports') : lang === 'ms' ? 'Import' : 'Imports'}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden" style={{ height: 480 }}>
        <MapContainer center={[20, 110]} zoom={3} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={[20, 110]} />
          <CircleMarker center={[4.2, 101.9]} radius={10} pathOptions={{ color: '#c45c3e', fillColor: '#c45c3e', fillOpacity: 0.9 }}>
            <Popup>
              <strong>Malaysia</strong>
              <br />
              {lang === 'ms' ? 'Negara asal' : 'Home country'}
            </Popup>
          </CircleMarker>
          {top.map((p) => {
            const coords = COUNTRY_COORDS[p.country]
            if (!coords) return null
            const radius = 6 + (p.totalValue / maxVal) * 18
            return (
              <CircleMarker
                key={p.country}
                center={coords}
                radius={radius}
                pathOptions={{ color: '#1e3a5f', fillColor: '#1e3a5f', fillOpacity: 0.55 }}
              >
                <Popup>
                  <strong>{p.country}</strong>
                  <br />
                  {formatBn(p.totalValue)}
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {top.slice(0, 8).map((p, i) => (
          <div key={p.country} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-400 mr-2">#{i + 1}</span>
            <span className="font-medium text-slate-800">{p.country}</span>
            <span className="float-right font-mono text-slate-600">{formatBn(p.totalValue)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
