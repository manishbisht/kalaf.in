import { Icon } from '../Icons'
import styles from './style.module.css'

const LOOK = [
  {
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    label: 'Look 01 — Heavyweight crew, charcoal',
  },
  {
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    label: 'Look 02 — Sand co-ord',
  },
  {
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80',
    label: 'Look 03 — Olive overshirt',
  },
  {
    src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    label: 'Look 04 — Pleated trouser',
  },
  {
    src: 'https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1200&q=80',
    label: 'Look 05 — After hours',
  },
  {
    src: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1000&q=80',
    label: 'Look 06 — Linen shirt',
  },
]

const frameClass = [
  styles.frame1,
  styles.frame2,
  styles.frame3,
  styles.frame4,
  styles.frame5,
  styles.frame6,
]

function LookFrame({ item }) {
  return (
    <a className={styles.frame}>
      <img src={item.src} alt={item.label} />
      <div className={styles.frameLabel}>
        <span>{item.label}</span>
        <Icon name="arrowUpRight" size={18} />
      </div>
    </a>
  )
}

export function Lookbook() {
  return (
    <section className={styles.section} id="lookbook">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">The lookbook</div>
            <h2>
              Sand &amp; stone.
              <br />
              Shot in Jaipur, January.
            </h2>
          </div>
          <div className="right">
            FW25&apos;s editorial — photographed in natural light across three Jaipur locations.
            <a>Open the full lookbook →</a>
          </div>
        </div>

        <div className={styles.grid}>
          {LOOK.map((item, i) => (
            <div key={i} className={frameClass[i]}>
              <LookFrame item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
