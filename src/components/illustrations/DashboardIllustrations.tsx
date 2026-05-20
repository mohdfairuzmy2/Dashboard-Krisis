import type { IllustrationId } from '../../lib/dashboardMeta'

type Props = { id: IllustrationId }

export function DashboardIllustration({ id }: Props) {
  switch (id) {
    case 'fuel':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <rect width="320" height="200" fill="transparent" />
          <path d="M80 160V90h24l14-28h40l14 28h24v70H80z" fill="#c45c3e" opacity="0.9" />
          <rect x="108" y="62" width="44" height="36" rx="4" fill="#1e3a5f" />
          <rect x="200" y="100" width="72" height="48" rx="6" fill="#fff" stroke="#8b7355" strokeWidth="2" />
          <text x="216" y="130" fontSize="14" fill="#8b7355" fontFamily="system-ui">RM</text>
          <path d="M230 145h40" stroke="#1a4d3e" strokeWidth="3" strokeLinecap="round" />
          <circle cx="248" cy="118" r="18" fill="#f5c842" opacity="0.8" />
        </svg>
      )
    case 'cpi':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <ellipse cx="160" cy="155" rx="90" ry="12" fill="#8b7355" opacity="0.15" />
          <path d="M100 140c0-40 25-70 60-70s60 30 60 70" fill="none" stroke="#1e3a5f" strokeWidth="3" />
          <rect x="130" y="75" width="60" height="65" rx="8" fill="#c45c3e" opacity="0.85" />
          <path d="M200 50 L200 120 M185 65 L215 65 M185 95 L215 95" stroke="#1a4d3e" strokeWidth="2" />
          <polyline points="210,40 230,55 250,35 270,60" fill="none" stroke="#1a4d3e" strokeWidth="2.5" />
        </svg>
      )
    case 'energy':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <ellipse cx="120" cy="130" rx="55" ry="70" fill="#1e3a5f" />
          <ellipse cx="120" cy="125" rx="48" ry="62" fill="#2d5a87" />
          <rect x="175" y="55" width="110" height="70" rx="4" fill="#fff" stroke="#8b7355" strokeWidth="1.5" />
          <polyline points="185,105 205,75 225,90 245,55 265,80" fill="none" stroke="#c45c3e" strokeWidth="2.5" />
          <text x="188" y="72" fontSize="11" fill="#8b7355" fontFamily="system-ui">Brent</text>
        </svg>
      )
    case 'gdp':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <rect x="70" y="90" width="35" height="70" fill="#1e3a5f" opacity="0.7" />
          <rect x="115" y="60" width="35" height="100" fill="#1a4d3e" opacity="0.85" />
          <rect x="160" y="75" width="35" height="85" fill="#c45c3e" opacity="0.8" />
          <rect x="205" y="45" width="35" height="115" fill="#1e3a5f" />
          <path d="M60 160h200" stroke="#8b7355" strokeWidth="2" />
          <rect x="230" y="100" width="50" height="35" rx="4" fill="#f5ebe0" stroke="#8b7355" />
          <text x="238" y="122" fontSize="12" fill="#1a4d3e" fontFamily="system-ui">%</text>
        </svg>
      )
    case 'market':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <circle cx="160" cy="100" r="55" fill="none" stroke="#8b7355" strokeWidth="2" strokeDasharray="6 4" />
          <text x="118" y="108" fontSize="28" fill="#1e3a5f" fontFamily="Georgia, serif">$</text>
          <text x="175" y="95" fontSize="22" fill="#1a4d3e" fontFamily="Georgia, serif">€</text>
          <text x="155" y="130" fontSize="18" fill="#c45c3e" fontFamily="Georgia, serif">¥</text>
          <rect x="200" y="55" width="80" height="50" rx="6" fill="#fff" stroke="#8b7355" />
          <text x="212" y="88" fontSize="13" fill="#1e3a5f" fontFamily="system-ui">MYR</text>
        </svg>
      )
    case 'commodities':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <path d="M40 130 Q160 90 280 130 L280 150 L40 150 Z" fill="#2d5a87" />
          <rect x="90" y="95" width="45" height="35" fill="#c45c3e" opacity="0.9" />
          <rect x="140" y="100" width="40" height="30" fill="#1a4d3e" opacity="0.85" />
          <rect x="185" y="92" width="50" height="38" fill="#f5c842" opacity="0.9" />
          <path d="M200 70 L220 50 L240 70" fill="#1e3a5f" />
          <line x1="220" y1="50" x2="220" y2="95" stroke="#1e3a5f" strokeWidth="2" />
        </svg>
      )
    case 'tradeflow':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <circle cx="90" cy="100" r="28" fill="#c45c3e" opacity="0.85" />
          <text x="78" y="106" fontSize="14" fill="#fff" fontFamily="system-ui">MY</text>
          <circle cx="230" cy="80" r="24" fill="#1e3a5f" opacity="0.8" />
          <circle cx="250" cy="130" r="22" fill="#1a4d3e" opacity="0.8" />
          <path d="M118 95 Q175 70 205 88" fill="none" stroke="#8b7355" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M205 115 Q160 140 118 108" fill="none" stroke="#c45c3e" strokeWidth="2" strokeDasharray="4 3" />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#8b7355" />
            </marker>
          </defs>
        </svg>
      )
    case 'map':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <ellipse cx="160" cy="100" rx="100" ry="55" fill="none" stroke="#2d5a87" strokeWidth="2" />
          <ellipse cx="160" cy="100" rx="100" ry="55" fill="#e6ecf5" opacity="0.5" />
          <circle cx="200" cy="85" r="6" fill="#c45c3e" />
          <circle cx="130" cy="95" r="5" fill="#1a4d3e" />
          <circle cx="175" cy="115" r="7" fill="#1e3a5f" />
          <circle cx="220" cy="110" r="4" fill="#f5c842" />
          <circle cx="155" cy="75" r="5" fill="#c45c3e" opacity="0.7" />
        </svg>
      )
    case 'news':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden>
          <rect x="85" y="50" width="150" height="110" rx="4" fill="#fff" stroke="#8b7355" strokeWidth="2" />
          <rect x="95" y="60" width="80" height="8" rx="2" fill="#1e3a5f" opacity="0.6" />
          <rect x="95" y="78" width="130" height="5" rx="1" fill="#8b7355" opacity="0.4" />
          <rect x="95" y="90" width="120" height="5" rx="1" fill="#8b7355" opacity="0.4" />
          <rect x="95" y="102" width="100" height="5" rx="1" fill="#8b7355" opacity="0.4" />
          <circle cx="210" cy="130" r="22" fill="#c45c3e" opacity="0.2" />
          <text x="198" y="136" fontSize="20" fill="#c45c3e">!</text>
        </svg>
      )
  }
}
