import { useState } from "react";
import { Icon } from "../Icons";
import styles from "./style.module.css";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    return (
        <section className={styles.section} id="waitlist">
            <div className={`container ${styles.inner}`}>
                <div className={styles.eyebrow}>
                    The Circle · Drop 01 waitlist
                </div>

                <h2 className={styles.headline}>
                    First in line
                    <br />
                    for the first drop.
                </h2>

                <p className={styles.sub}>
                    Reserve your size 48 hours before the public drop. One email
                    when the drop opens — never more than that.
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
                        {done ? "You're on the list" : "Join the waitlist"}
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
