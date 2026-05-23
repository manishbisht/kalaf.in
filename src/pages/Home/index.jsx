import { useState } from 'react'
import { Nav } from '../../components/Nav'
import { Hero } from '../../components/Hero'
import { Drop } from '../../components/Drop'
import { Process } from '../../components/Process'
import { WhyKalaf } from '../../components/WhyKalaf'
import { Lookbook } from '../../components/Lookbook'
import { Newsletter } from '../../components/Newsletter'
import { Footer } from '../../components/Footer'
import { Cart } from '../../components/Cart'
import styles from './style.module.css'

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className={styles.page}>
      <Nav onBagClick={() => setCartOpen(true)} />
      <main className={styles.main}>
        <Hero />
        <Drop />
        <Process />
        <WhyKalaf />
        <Lookbook />
        <Newsletter />
      </main>
      <Footer />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
