type Props = {
  title: string
  subtitle?: string
  category?: string
}

export function SectionHeader({ title, subtitle, category }: Props) {
  return (
    <header className="mb-8 sm:mb-10">
      {category && <p className="section-header__category">{category}</p>}
      <h1 className="section-header__title">{title}</h1>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </header>
  )
}
