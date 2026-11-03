import { Hero } from "../../components/Hero";
import { Drop } from "../../components/Drop";
import { Process } from "../../components/Process";
import { WhyKalaf } from "../../components/WhyKalaf";
import { Lookbook } from "../../components/Lookbook";
import { Newsletter } from "../../components/Newsletter";
import styles from "./style.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Hero />
                <Drop />
                <Process />
                <WhyKalaf />
                <Lookbook />
                <Newsletter />
            </main>
        </div>
    );
}
