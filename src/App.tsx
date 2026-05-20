import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from './lib/i18n'
import { Layout } from './components/Layout'
import { Overview } from './pages/Overview'
import { Fuel } from './pages/Fuel'
import { CPI } from './pages/CPI'
import { Energy } from './pages/Energy'
import { GDP } from './pages/GDP'
import { Market } from './pages/Market'
import { Commodities } from './pages/Commodities'
import { TradeFlow } from './pages/TradeFlow'
import { MapPage } from './pages/MapPage'
import { News } from './pages/News'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="cpi" element={<CPI />} />
            <Route path="global-commodities" element={<Energy />} />
            <Route path="gdp" element={<GDP />} />
            <Route path="market" element={<Market />} />
            <Route path="commodities" element={<Commodities />} />
            <Route path="tradeflow" element={<TradeFlow />} />
            <Route path="map" element={<MapPage />} />
            <Route path="news" element={<News />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}
