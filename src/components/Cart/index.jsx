import { useState } from 'react'
import { Icon } from '../Icons'
import styles from './style.module.css'

const SAMPLE_CART = [
  {
    name: 'Heavyweight Crew Tee',
    variant: 'Charcoal · L',
    price: 2499,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sand Linen Overshirt',
    variant: 'Sand · M',
    price: 3800,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80',
  },
]

export function Cart({ open, onClose }) {
  const [items, setItems] = useState(SAMPLE_CART)
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)

  const updateQty = (idx, delta) =>
    setItems((curr) =>
      curr.map((it, i) => (i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    )

  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.scrimOpen : ''}`} onClick={onClose} />
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHead}>
          <div className="t-eyebrow">Your bag — {items.length}</div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className={styles.items}>
          {items.map((it, idx) => (
            <div key={idx} className={styles.item}>
              <div className={styles.itemThumb} style={{ backgroundImage: `url(${it.img})` }} />
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <div className={styles.itemName}>{it.name}</div>
                  <div className={styles.itemPrice}>₹ {it.price.toLocaleString('en-IN')}</div>
                </div>
                <div className={styles.itemVariant}>{it.variant}</div>

                <div className={styles.itemActions}>
                  <div className={styles.qtyControl}>
                    <button className={styles.qtyBtn} onClick={() => updateQty(idx, -1)}>
                      <Icon name="minus" size={14} />
                    </button>
                    <span className={styles.qtyNum}>{it.qty}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQty(idx, +1)}>
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.drawerFoot}>
          <div className={styles.subtotalRow}>
            <span className={styles.subtotalLabel}>Subtotal</span>
            <span className={styles.subtotalValue}>₹ {subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.shippingNote}>
            Free shipping over ₹ 3,000. Returns within 14 days.
          </div>
          <button className={`btn btn-primary ${styles.checkoutBtn}`}>
            Checkout — ₹ {subtotal.toLocaleString('en-IN')} <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}
