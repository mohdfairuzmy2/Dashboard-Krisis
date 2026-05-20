import { getPageSources, type PageSourceId } from '../lib/dataSources'
import { SourceLinksCompact } from './SourceLinks'
import { useI18n } from '../lib/i18n'

type Props = {
  page: PageSourceId
  officialPath?: string
}

export function PageSources({ page, officialPath }: Props) {
  const { tr } = useI18n()
  const links = getPageSources(page)
  const officialUrl = officialPath
    ? `https://pantaukrisis.gov.my${officialPath}`
    : 'https://pantaukrisis.gov.my/'

  return (
    <aside className="page-sources glass-card mt-8">
      <p className="page-sources__title">{tr('app.source')}</p>
      <SourceLinksCompact
        links={links}
        primaryUrl={officialUrl}
        primaryLabel={`pantaukrisis.gov.my${officialPath ?? ''}`}
      />
    </aside>
  )
}
