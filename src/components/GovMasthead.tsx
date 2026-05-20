import { Building2, Globe } from 'lucide-react'
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from '@govtechmy/myds-react/masthead'
import { useI18n } from '../lib/i18n'

export function GovMasthead() {
  const { lang } = useI18n()

  const title =
    lang === 'ms'
      ? 'Laman web kerajaan Malaysia'
      : 'Malaysian government website'

  const official =
    lang === 'ms'
      ? 'Laman web rasmi kerajaan Malaysia'
      : 'Official Malaysian government website'

  const secure =
    lang === 'ms'
      ? 'Sambungan selamat — pastikan URL bermula dengan https://'
      : 'Secure connection — ensure the URL starts with https://'

  return (
    <Masthead>
      <MastheadHeader>
        <MastheadTitle>{title}</MastheadTitle>
        <MastheadTrigger>{lang === 'ms' ? 'Bagaimana anda tahu?' : 'How you know?'}</MastheadTrigger>
      </MastheadHeader>
      <MastheadContent>
        <MastheadSection icon={<Building2 aria-hidden />} title={official}>
          {lang === 'ms'
            ? 'Laman .gov.my rasmi dikendalikan oleh agensi kerajaan Malaysia.'
            : 'Official .gov.my sites are operated by Malaysian government agencies.'}
        </MastheadSection>
        <MastheadSection icon={<Globe aria-hidden />} title={lang === 'ms' ? 'Laman selamat' : 'Secure site'}>
          {secure}
        </MastheadSection>
      </MastheadContent>
    </Masthead>
  )
}
