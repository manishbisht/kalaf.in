import { Link } from 'react-router-dom'
import { Icon } from '../Icons'
import styles from './style.module.css'

export function Nav({ dark = false, bagCount = 2, onBagClick }) {
  return (
    <header className={`${styles.nav} ${dark ? styles.navDark : ''}`}>
      <div className={styles.inner}>
        <nav className={styles.links}>
          <a className={styles.link}>Shop</a>
          <a className={styles.link}>Collections</a>
          <a className={styles.link}>Lookbook</a>
          <a className={`${styles.link} ${styles.linkMuted}`}>Journal</a>
        </nav>

        <Link to="/" className={styles.wordmark}>
          kalaf.in
        </Link>

        <div className={styles.iconGroup}>
          <button className={styles.iconBtn} aria-label="Search">
            <Icon name="search" size={18} />
          </button>
          <button className={styles.iconBtn} aria-label="Account">
            <Icon name="account" size={18} />
          </button>
          <button className={styles.iconBtn} aria-label="Bag" onClick={onBagClick}>
            <Icon name="bag" size={18} />
            <span className={styles.bagCount}>({bagCount})</span>
          </button>
        </div>
      </div>

      <div className={`${styles.announcement} ${dark ? styles.announcementDark : ''}`}>
        Drop 01 — The first capsule · Made in Jaipur · Coming soon
      </div>
    </header>
  )
}
