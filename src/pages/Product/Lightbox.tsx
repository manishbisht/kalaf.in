import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProductImage } from "../../data/catalog";
import { CatalogImage } from "../../components/CatalogImage";
import { Icon } from "../../components/Icons";
import styles from "./style.module.css";

// Full-screen photo viewer on a native modal <dialog>: the page behind is
// inert, Esc / the close button / a click on the backdrop close it, Tab stays
// inside it, and focus goes back to whatever opened it. Only the photo on
// screen loads its 1200w file.
export function Lightbox({
    images,
    start,
    label,
    onClose,
    restoreFocus = true,
}: {
    images: ProductImage[];
    start: number;
    label: string;
    // Called with the photo that was on screen, so the gallery can follow.
    onClose: (photo: number) => void;
    // false: the caller moves focus itself once the lightbox has closed.
    restoreFocus?: boolean;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const [i, setI] = useState(start);
    const total = images.length;
    const image = images[i];

    // Focus goes back to the opener by default. The gallery passes
    // `restoreFocus={false}` and focuses the photo now on screen instead,
    // because after paging the opener sits in a hidden slide.
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        const opener =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        if (!dialog.open) dialog.showModal();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            if (dialog.open) dialog.close();
            document.body.style.overflow = prevOverflow;
            if (restoreFocus) opener?.focus({ preventScroll: true });
        };
        // Runs once per open; restoreFocus is fixed for its lifetime.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const step = (d: number) => setI((n) => (n + d + total) % total);

    const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
        e.stopPropagation(); // the gallery behind has its own arrow keys
        if (e.key === "ArrowLeft" && total > 1) step(-1);
        else if (e.key === "ArrowRight" && total > 1) step(1);
        else if (e.key === "Tab") {
            // Keep Tab cycling through the dialog's own buttons.
            const focusable = [
                ...e.currentTarget.querySelectorAll<HTMLElement>("button"),
            ];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    return (
        <dialog
            ref={ref}
            className={styles.lightbox}
            aria-label={`${label} — photo ${i + 1} of ${total}`}
            onCancel={(e) => {
                e.preventDefault();
                onClose(i);
            }}
            onKeyDown={onKeyDown}
            onClick={(e) => {
                // The backdrop is the dialog itself and the stage around the
                // photo; clicks on the photo or the buttons don't close it.
                const t = e.target as HTMLElement;
                if (t === e.currentTarget || t.dataset.backdrop) onClose(i);
            }}
        >
            <div className={styles.lightboxStage} data-backdrop="true">
                <CatalogImage
                    key={image.srcLarge}
                    image={image}
                    large
                    alt={`${label}, photo ${i + 1} of ${total}`}
                />
            </div>
            <div className={styles.lightboxBar}>
                <span className={styles.lightboxCount} aria-hidden="true">
                    {i + 1} / {total}
                </span>
                <button
                    type="button"
                    className={styles.lightboxClose}
                    onClick={() => onClose(i)}
                    aria-label="Close"
                    autoFocus
                >
                    <Icon name="close" size={22} />
                </button>
            </div>
            {total > 1 && (
                <>
                    <button
                        type="button"
                        className={`${styles.lightboxArrow} ${styles.arrowPrev}`}
                        onClick={() => step(-1)}
                        aria-label="Previous photo"
                    >
                        <Icon name="arrowRight" size={24} />
                    </button>
                    <button
                        type="button"
                        className={`${styles.lightboxArrow} ${styles.arrowNext}`}
                        onClick={() => step(1)}
                        aria-label="Next photo"
                    >
                        <Icon name="arrowRight" size={24} />
                    </button>
                </>
            )}
        </dialog>
    );
}
