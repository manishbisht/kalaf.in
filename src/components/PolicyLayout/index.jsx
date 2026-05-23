import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Cart } from '../Cart'
import { Icon } from '../Icons'
import styles from './style.module.css'

export const POLICY_CROSS_LINKS = [
  { slug: 'privacy', num: '01', label: 'Privacy policy', to: '/privacy' },
  { slug: 'returns', num: '02', label: 'Shipping & returns', to: '/shipping-returns' },
  { slug: 'terms', num: '03', label: 'Terms of use', to: '/terms' },
  { slug: 'refund', num: '04', label: 'Refund policy', to: '/refund-policy' },
  { slug: 'cookies', num: '05', label: 'Cookie policy', to: '/cookies' },
]

export const HELP_CROSS_LINKS = [
  { slug: 'size-guide', num: '01', label: 'Size guide', to: '/size-guide' },
  { slug: 'care-guide', num: '02', label: 'Care guide', to: '/care-guide' },
  { slug: 'track-order', num: '03', label: 'Track order', to: '/track-order' },
  { slug: 'contact', num: '04', label: 'Contact us', to: '/contact' },
]

function MetaRow({ label, value }) {
  return (
    <li className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </li>
  )
}

function SectionBlock({ section, index }) {
  return (
    <section
      id={`sec-${section.id}`}
      className={`${styles.sectionBlock} ${index > 0 ? styles.sectionBlockIndented : ''}`}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNum}>{String(index + 1).padStart(2, '0')}</span>
        <h2 className={styles.sectionTitle}>{section.title}.</h2>
      </div>

      <div>
        {section.body.map((b, i) => {
          if (b.kind === 'p') {
            return (
              <p
                key={i}
                className={`${styles.para} ${i === 0 ? styles.paraFirst : styles.paraRest}`}
              >
                {b.text}
              </p>
            )
          }
          if (b.kind === 'list') {
            return (
              <ul key={i} className={styles.list}>
                {b.items.map((item, j) => (
                  <li
                    key={j}
                    className={`${styles.listItem} ${j < b.items.length - 1 ? styles.listItemBordered : ''}`}
                  >
                    <span className={styles.listDash} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          }
          return null
        })}
      </div>

      {section.steps && (
        <ol className={styles.steps}>
          {section.steps.map((step, i) => (
            <li
              key={i}
              className={`${styles.stepItem} ${i < section.steps.length - 1 ? styles.stepItemBordered : ''}`}
            >
              <span className={styles.stepNum}>STEP {String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stepText}>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {section.callout && (
        <div className={styles.callout}>
          <div className={styles.calloutLabel}>{section.callout.label}</div>
          <div className={styles.calloutValue}>{section.callout.value}</div>
        </div>
      )}
    </section>
  )
}

export default function PolicyLayout({ data, currentSlug, crossLinks }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(data.sections[0]?.id)

  useEffect(() => {
    const handler = () => {
      const positions = data.sections.map((s) => {
        const el = document.getElementById(`sec-${s.id}`)
        if (!el) return { id: s.id, top: Infinity }
        return { id: s.id, top: el.getBoundingClientRect().top }
      })
      const above = positions.filter((x) => x.top < 220).pop() || positions[0]
      setActiveSection(above.id)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [data.sections])

  return (
    <div className={styles.wrapper}>
      <Nav onBagClick={() => setCartOpen(true)} bagCount={0} dark />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div aria-hidden className={styles.ornament}>
          {data.ornament}
        </div>

        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb}>
            <Link to="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <span>/</span>
            <span>Policies</span>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{data.title}</span>
          </nav>

          <div className={styles.heroTitleGrid}>
            <div>
              <div className={`t-eyebrow ${styles.eyebrow}`}>{data.eyebrow}</div>
              <h1 className={styles.heroTitle}>{data.title}.</h1>
            </div>
          </div>

          <div className={styles.heroMeta}>
            <p className={styles.summary}>{data.summary}</p>
            <ul className={styles.metaList}>
              <MetaRow label="Last updated" value={data.updated} />
              <MetaRow label="Reading time" value={data.readTime} />
              <MetaRow label="Written by" value="Kalaf, Jaipur" />
              <MetaRow label="Version" value="2.0" />
            </ul>
          </div>
        </div>
      </section>

      {/* ── Promises (optional) ── */}
      {data.promises && (
        <section className={styles.promises}>
          <div className="container">
            <div className={styles.promisesHeader}>
              <span className="t-eyebrow" style={{ color: 'var(--smoke)' }}>
                If you read nothing else
              </span>
              <span className={styles.promisesLine} />
            </div>

            <div className={styles.promisesGrid}>
              {data.promises.map((pr, i) => (
                <div
                  key={i}
                  className={`${styles.promiseCard} ${i === 0 ? styles.promiseCardFirst : ''}`}
                >
                  <div className={styles.promiseKicker}>{pr.kicker}</div>
                  <div className={styles.promiseLabel}>{pr.label}</div>
                  <p className={styles.promiseBody}>{pr.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Body ── */}
      <section className={styles.body}>
        <div className="container">
          <div className={styles.bodyGrid}>
            {/* Left rail — sticky TOC */}
            <aside className={styles.leftRail}>
              <div className={`t-eyebrow ${styles.tocLabel}`}>On this page</div>
              <ol className={styles.tocList}>
                {data.sections.map((s, i) => {
                  const active = activeSection === s.id
                  return (
                    <li key={s.id}>
                      <a
                        href={`#sec-${s.id}`}
                        className={`${styles.tocLink} ${i === 0 ? styles.tocLinkFirst : styles.tocLinkRest}`}
                      >
                        <span
                          className={`${styles.tocNum} ${active ? styles.tocNumActive : ''}`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`${styles.tocTitle} ${active ? styles.tocTitleActive : ''}`}
                        >
                          {s.title}
                          {active && <span className={styles.tocDot} />}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ol>

              <div className={styles.contactCard}>
                <div className={`t-eyebrow ${styles.contactCardLabel}`}>Still wondering?</div>
                <div className={styles.contactCardTitle}>Write to a human.</div>
                <a href="mailto:hello@kalaf.in" className={styles.contactLink}>
                  hello@kalaf.in <Icon name="arrowUpRight" size={12} />
                </a>
              </div>
            </aside>

            {/* Main article */}
            <article className={styles.mainCol}>
              {data.sections.map((s, i) => (
                <SectionBlock key={s.id} section={s} index={i} />
              ))}

              <div className={styles.signature}>
                <div className={styles.sigWordmark}>kalaf.in</div>
                <div className={styles.sigMeta}>
                  Kalaf Atelier Pvt. Ltd. · Jaipur, Rajasthan, India
                  <br />
                  CIN U17299RJ2024PTC0000 · Effective {data.updated}
                </div>
              </div>
            </article>

            {/* Right spacer */}
            <aside />
          </div>
        </div>
      </section>

      {/* ── Cross-link strip ── */}
      <section className={styles.crossLinks}>
        <div className="container">
          <div className={styles.crossLinksHeader}>
            <span className="t-eyebrow" style={{ color: 'var(--smoke)' }}>
              {data.crossLinksHeader ?? 'The other policies'}
            </span>
            <span className={styles.crossLinksLine} />
          </div>

          <div
            className={styles.crossLinksGrid}
            style={{ gridTemplateColumns: `repeat(${crossLinks.length}, 1fr)` }}
          >
            {crossLinks.map((l) => {
              const isCurrent = l.slug === currentSlug
              return isCurrent ? (
                <div key={l.slug} className={`${styles.crossLink} ${styles.crossLinkCurrent}`}>
                  <span className={styles.crossLinkNum}>{l.num} · You are here</span>
                  <span className={styles.crossLinkTitle}>{l.label}</span>
                </div>
              ) : (
                <Link key={l.slug} to={l.to} className={styles.crossLink}>
                  <span className={styles.crossLinkNum}>{l.num}</span>
                  <span className={styles.crossLinkTitle}>{l.label}</span>
                  <span className={styles.crossLinkCta}>
                    Open <Icon name="arrowUpRight" size={12} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
