import { Link } from 'react-router-dom'
import { Icon } from '../Icons'
import styles from './style.module.css'

function FootCol({ title, items }) {
  return (
    <div>
      <div className={styles.colTitle}>{title}</div>
      <ul className={styles.colList}>
        {items.map((item) => {
          const label = typeof item === 'string' ? item : item.label
          const to = typeof item === 'string' ? null : item.to
          return (
            <li key={label}>
              {to ? (
                <Link to={to} className={styles.colLink}>
                  {label}
                </Link>
              ) : (
                <a className={styles.colLink}>{label}</a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wordmarkRow}>
          <Link to="/" className={styles.wordmark}>
            kalaf.in
          </Link>
          <div className={styles.devanagari}>कलफ</div>
        </div>

        <div className={styles.columns}>
          <div>
            <div className={styles.brandColLabel}>Made in Jaipur</div>
            <p className={styles.brandColBody}>
              Cloth sourced and finished in Jaipur. Worn everywhere.
            </p>
            <div className={styles.social}>
              <a>
                <Icon name="instagram" size={20} />
              </a>
              <a>
                <Icon name="pinterest" size={20} />
              </a>
              <a>
                <Icon name="tiktok" size={20} />
              </a>
              <a>
                <Icon name="youtube" size={20} />
              </a>
            </div>
          </div>

          <FootCol
            title="Shop"
            items={['Oversized tees', 'Shirts', 'Co-ords', 'Essentials', 'New drops', 'Gift cards']}
          />
          <FootCol title="Brand" items={['The story', 'Journal', 'Lookbook', 'Press', 'Careers']} />
          <FootCol
            title="Help"
            items={[
              { label: 'Shipping & returns', to: '/shipping-returns' },
              { label: 'Size guide', to: '/size-guide' },
              { label: 'Care guide', to: '/care-guide' },
              { label: 'Track order', to: '/track-order' },
              { label: 'Contact us', to: '/contact' },
            ]}
          />
          <FootCol
            title="Policies"
            items={[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms of use', to: '/terms' },
              { label: 'Refund policy', to: '/refund-policy' },
              { label: 'Cookie policy', to: '/cookies' },
            ]}
          />
        </div>

        <div className={styles.bottom}>
          <div>© 2026 Kalaf Atelier Pvt. Ltd. · Jaipur, Rajasthan · CIN U17299RJ2024PTC0000</div>
          <div>hello@kalaf.in · +91 141 400 0000</div>
        </div>
      </div>
    </footer>
  )
}
