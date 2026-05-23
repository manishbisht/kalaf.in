import { useState } from 'react'
import { Icon } from '../Icons'
import styles from './style.module.css'

const COLOURWAYS = [
  { id: 'chambray', name: 'Chambray', swatch: '#5d7b94', code: 'DENIM' },
  { id: 'olive', name: 'Olive', swatch: '#6B6A47', code: 'OLIVE' },
  { id: 'sand', name: 'Sand', swatch: '#c9b79c', code: 'SAND' },
  { id: 'bone', name: 'Bone', swatch: '#ede8df', code: 'BONE' },
  { id: 'ink', name: 'Ink', swatch: '#1a1a1a', code: 'INK' },
]

function imageFilter(id) {
  if (id === 'sand' || id === 'bone') return 'none'
  const rotate = id === 'olive' ? '40deg' : id === 'chambray' ? '180deg' : '0deg'
  const bright = id === 'ink' ? '0.35' : '0.95'
  return `sepia(0.3) saturate(1.4) hue-rotate(${rotate}) brightness(${bright})`
}

function DropMeta({ label, value }) {
  return (
    <div>
      <div className={styles.metaLabel}>{label}</div>
      <div className={styles.metaValue}>{value}</div>
    </div>
  )
}

export function Drop() {
  const [active, setActive] = useState('sand')
  const c = COLOURWAYS.find((x) => x.id === active)

  return (
    <section className={styles.section} id="drop">
      <div className="container">
        <div className="section-head">
          <div>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowText}>Drop 01 — the first piece</span>
              <span className={styles.devanagari}>— पहला</span>
            </div>
            <h2>
              One pant.
              <br />
              Five colours.
            </h2>
          </div>
          <div className="right">
            We started with the pant we&apos;d want to wear every day. Cotton-linen, relaxed easy
            fit, elastic-and-drawcord waist. Cut and finished in Jaipur — five honest colours,
            nothing else.
          </div>
        </div>

        <div className={styles.showcase}>
          <a href="#" className={styles.heroImage}>
            <img src="/pant-colourways.png" alt="Five colourways" />
            <div className={styles.chipWrap}>
              <span className="chip">DROP 01 — 01 OF 01</span>
            </div>
          </a>

          <div className={styles.rightCol}>
            <a href="#" className={styles.variantImage}>
              <img
                src={active === 'sand' ? '/pant-front.png' : '/pant-front-2.png'}
                alt={`The Everyday Pant — ${c.name}`}
                style={{
                  filter: imageFilter(active),
                  mixBlendMode: 'multiply',
                }}
              />
            </a>

            <div className={styles.info}>
              <div className={styles.titleRow}>
                <h3 className={styles.productTitle}>The Everyday Pant</h3>
                <div className={styles.price}>₹ 2,990</div>
              </div>
              <div className={styles.variant}>Cotton-linen · Relaxed easy fit · {c.name}</div>

              <div className={styles.swatches}>
                {COLOURWAYS.map((cw) => (
                  <button
                    key={cw.id}
                    onClick={() => setActive(cw.id)}
                    title={cw.name}
                    style={{
                      width: 26,
                      height: 26,
                      padding: 0,
                      borderRadius: '50%',
                      background: cw.swatch,
                      border: cw.id === active ? '2px solid var(--ink)' : '1px solid var(--line)',
                      outline: cw.id === active ? '2px solid var(--off-white)' : 'none',
                      outlineOffset: -4,
                      cursor: 'pointer',
                      transition: 'transform 200ms var(--ease)',
                    }}
                  />
                ))}
                <span className={styles.swatchCode}>{c.code}</span>
              </div>

              <div className={styles.ctaRow}>
                <a href="#" className="btn btn-primary">
                  See the pant <Icon name="arrowRight" size={16} />
                </a>
                <a href="#" className="btn btn-secondary">
                  Size guide
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metaStrip}>
          <DropMeta label="The piece" value="The Everyday Pant" />
          <DropMeta label="Fabric" value="60% cotton, 40% linen" />
          <DropMeta label="Made in" value="Jaipur" />
          <DropMeta label="Drop date" value="To be announced" />
        </div>
      </div>
    </section>
  )
}
