import { Hero } from "../../components/Hero";
import { Drop } from "../../components/Drop";
import { Process } from "../../components/Process";
import { WhyKalaf } from "../../components/WhyKalaf";
import { Lookbook } from "../../components/Lookbook";
import { Newsletter } from "../../components/Newsletter";
import styles from "./style.module.css";

// The App shell wraps every page in <main id="main">.
export default function Home() {
    return (
        <div className={styles.page}>
            <Hero />
            <Drop />
            <Process />
            <WhyKalaf />
            <Lookbook />
            <Newsletter />
        </div>
    );
}
