import { MessageCircle } from 'lucide-react'
import { useEffect } from 'react'
import { CHATBASE_BOT_ID, CHATBASE_DOMAIN, CHATBASE_SCRIPT_URL } from '../lib/chatbase'
import { useI18n } from '../lib/i18n'

type ChatbaseFn = ((...args: unknown[]) => void) & { q?: unknown[][] }

declare global {
  interface Window {
    chatbase?: ChatbaseFn
  }
}

function initChatbaseQueue() {
  const w = window
  if (typeof w.chatbase === 'function') return

  const fn = ((...args: unknown[]) => {
    if (!fn.q) fn.q = []
    fn.q.push(args)
  }) as ChatbaseFn
  fn.q = []

  w.chatbase = new Proxy(fn, {
    get(target, prop) {
      if (prop === 'q') return target.q
      return (...args: unknown[]) => target(prop as string, ...args)
    },
  }) as ChatbaseFn
}

let scriptAttached = false

function loadChatbaseScript() {
  if (scriptAttached || document.getElementById(CHATBASE_BOT_ID)) return
  const script = document.createElement('script')
  script.src = CHATBASE_SCRIPT_URL
  script.id = CHATBASE_BOT_ID
  script.setAttribute('domain', CHATBASE_DOMAIN)
  document.body.appendChild(script)
  scriptAttached = true
}

export function ChatbaseEmbed() {
  const { lang } = useI18n()

  useEffect(() => {
    initChatbaseQueue()
    loadChatbaseScript()
  }, [])

  return (
    <section className="chatbase-panel glass-card" aria-label={lang === 'ms' ? 'Pembantu AI' : 'AI assistant'}>
      <div className="chatbase-panel__head">
        <MessageCircle className="chatbase-panel__icon" aria-hidden />
        <div>
          <h3 className="chatbase-panel__title">
            {lang === 'ms' ? 'Pembantu AI strategik' : 'Strategic AI assistant'}
          </h3>
          <p className="chatbase-panel__desc">
            {lang === 'ms'
              ? 'Bot yang sama seperti pantaukrisis.gov.my/ai — klik ikon sembang di sudut kanan bawah untuk bertanya tentang krisis bekalan, bahan api, dagangan dan risiko geopolitik.'
              : 'Same bot as pantaukrisis.gov.my/ai — click the chat icon at the bottom-right to ask about supply crises, fuel, trade and geopolitical risk.'}
          </p>
        </div>
      </div>
      <p className="chatbase-panel__hint">
        {lang === 'ms'
          ? 'Widget sembang akan muncul secara automatik. Jika tidak kelihatan, muat semula halaman atau benarkan skrip pihak ketiga.'
          : 'The chat widget loads automatically. If you do not see it, refresh the page or allow third-party scripts.'}
      </p>
    </section>
  )
}
