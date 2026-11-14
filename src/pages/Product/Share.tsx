import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SITE_URL } from "../../hooks/usePageProduct";
import styles from "./style.module.css";

const noSubscribe = () => () => {};

// Share the current colour's page: the system share sheet where there is one
// (phones), otherwise copy the link, with a WhatsApp link alongside.
export function Share({ title, path }: { title: string; path: string }) {
    const [copied, setCopied] = useState(false);
    // Known only in the browser; the prerendered page shows "Copy link" and
    // switches to the share sheet after hydration where there is one.
    const canShare = useSyncExternalStore(
        noSubscribe,
        () => typeof navigator.share === "function",
        () => false
    );
    const timer = useRef(0);
    useEffect(() => () => window.clearTimeout(timer.current), []);

    // Always share the public kalaf.in link, even from localhost or a preview.
    const url = `${SITE_URL}${path}`;

    const share = async () => {
        if (canShare) {
            try {
                await navigator.share({ title, url });
            } catch {
                // Cancelled by the user, or blocked — nothing to do.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 2500);
        } catch {
            // Clipboard blocked; the WhatsApp link is still there.
        }
    };

    return (
        <div className={styles.share}>
            <button type="button" className={styles.shareBtn} onClick={share}>
                {canShare ? "Share" : "Copy link"}
            </button>
            {!canShare && (
                <a
                    className={styles.shareBtn}
                    href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Share on WhatsApp
                </a>
            )}
            <span className={styles.shareStatus} role="status">
                {copied ? "Link copied" : ""}
            </span>
        </div>
    );
}
