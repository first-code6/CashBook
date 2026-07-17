const TONE_CLASS = {
  teal: 'section-heading--teal',
  orange: 'section-heading--orange',
  yellow: 'section-heading--yellow',
  blue: 'section-heading--blue',
  red: 'section-heading--red',
}

export default function SectionHeading({ children, tone = 'teal', as: Tag = 'h2' }) {
  return (
    <Tag className={`section-heading ${TONE_CLASS[tone] || TONE_CLASS.teal}`}>
      <span className="section-heading__dot" aria-hidden="true" />
      <span className="section-heading__text">{children}</span>
    </Tag>
  )
}
