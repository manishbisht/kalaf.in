import { useState } from "react";
import { Icon } from "../Icons";
import styles from "./style.module.css";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    return (
        <section className={styles.section} id="updates">
            <div className={`container ${styles.inner}`}>
                <div className={styles.eyebrow}>
                    The Circle · Notes from the workshop
                </div>

                <h2 className={styles.headline}>
                    First to know
                    <br />
                    when the next drop lands.
                </h2>

                <p className={styles.sub}>
                    One email when a new piece goes live on Amazon, Flipkart, or
                    Myntra — with the direct link. Nothing else.
                </p>

                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (email) setDone(true);
                    }}
                >
                    <input
                        type="email"
                        placeholder="your@email.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submit}>
                        {done ? "You're on the list" : "Stay in the loop"}
                        {!done && <Icon name="arrowRight" size={16} />}
                    </button>
                </form>

                <div className={styles.fine}>
                    No spam. Unsubscribe in one click.
                </div>
            </div>
        </section>
    );
}
