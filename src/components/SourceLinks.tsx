import { ExternalLink } from 'lucide-react'
import {
  groupSources,
  SOURCE_GROUP_LABELS,
  SOURCE_LINKS,
  type GroupedSources,
  type SourceLink,
} from '../lib/dataSources'
import { useI18n } from '../lib/i18n'

type Props = {
  links?: SourceLink[]
  /** Papar pautan portal pantaukrisis di bahagian atas (halaman dalaman) */
  primaryUrl?: string
  primaryLabel?: string
}

function SourceGroupBlock({
  group,
  links,
  lang,
}: {
  group: GroupedSources['group']
  links: SourceLink[]
  lang: 'en' | 'ms'
}) {
  return (
    <div className="source-group">
      <h3 className="source-group__title">{SOURCE_GROUP_LABELS[group][lang]}</h3>
      <ul className="source-group__list">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              <span className="source-link__text">{link.name[lang]}</span>
              <ExternalLink className="source-link__icon" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SourceLinks({ links, primaryUrl, primaryLabel }: Props) {
  const { lang } = useI18n()
  const items = links ?? SOURCE_LINKS
  const grouped = groupSources(items)

  return (
    <div className="source-links">
      {primaryUrl && (
        <div className="source-links__primary">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link source-link--primary"
          >
            <span className="source-link__text">{primaryLabel ?? 'pantaukrisis.gov.my'}</span>
            <ExternalLink className="source-link__icon" aria-hidden />
          </a>
        </div>
      )}
      <div className="source-groups">
        {grouped.map(({ group, links: groupLinks }) => (
          <SourceGroupBlock key={group} group={group} links={groupLinks} lang={lang} />
        ))}
      </div>
      {!links && (
        <p className="source-links__note">
          {lang === 'ms'
            ? 'Data dipaparkan daripada sumber rasmi di atas. Klik untuk lawati laman asal.'
            : 'Data is shown from the official sources above. Click to visit the original site.'}
        </p>
      )}
    </div>
  )
}

/** Kumpulan ringkas untuk halaman dalaman (maks. 2 kumpulan) */
export function SourceLinksCompact({ links, primaryUrl, primaryLabel }: Props) {
  const { lang } = useI18n()
  const grouped = groupSources(links ?? [])

  return (
    <div className="source-links source-links--compact">
      {primaryUrl && (
        <div className="source-links__primary">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link source-link--primary"
          >
            <span className="source-link__text">{primaryLabel ?? 'pantaukrisis.gov.my'}</span>
            <ExternalLink className="source-link__icon" aria-hidden />
          </a>
        </div>
      )}
      {grouped.length > 0 ? (
        <div className="source-groups source-groups--compact">
          {grouped.map(({ group, links: groupLinks }) => (
            <SourceGroupBlock key={group} group={group} links={groupLinks} lang={lang} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
