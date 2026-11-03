import { Hero } from "../../components/Hero";
import { Drop } from "../../components/Drop";
import { Dupattas } from "../../components/Dupattas";
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
                <Dupattas />
                <Process />
                <WhyKalaf />
                <Lookbook />
                <Newsletter />
            </main>
        </div>
    );
}
