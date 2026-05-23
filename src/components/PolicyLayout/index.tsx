import { BRAND } from "../../constants";
import { PolicyHero } from "./PolicyHero";
import { Promises } from "./Promises";
import { TocRail } from "./TocRail";
import { SectionBlock } from "./SectionBlock";
import { CrossLinks } from "./CrossLinks";
import type { PolicyData, CrossLink } from "./types";
import styles from "./style.module.css";

// Public surface — pages import everything they need from this file.
export type {
    PolicyData,
    PolicySection,
    PolicyPromise,
    PolicyBodyBlock,
    CrossLink,
} from "./types";
export { POLICY_CROSS_LINKS, HELP_CROSS_LINKS } from "./links";

type PolicyLayoutProps = {
    data: PolicyData;
    currentSlug: string;
    crossLinks: CrossLink[];
};

export default function PolicyLayout({
    data,
    currentSlug,
    crossLinks,
}: PolicyLayoutProps) {
    return (
        <div className={styles.wrapper}>
            <PolicyHero data={data} />

            {data.promises && <Promises promises={data.promises} />}

            <section className={styles.body}>
                <div className="container">
                    <div className={styles.bodyGrid}>
                        <TocRail sections={data.sections} />

                        <article className={styles.mainCol}>
                            {data.sections.map((s, i) => (
                                <SectionBlock
                                    key={s.id}
                                    section={s}
                                    index={i}
                                />
                            ))}

                            <div className={styles.signature}>
                                <div className={styles.sigWordmark}>
                                    {BRAND.wordmark}
                                </div>
                                <div className={styles.sigMeta}>
                                    {BRAND.legalName} · {BRAND.location}
                                    <br />
                                    CIN {BRAND.cin} · Effective {data.updated}
                                </div>
                            </div>
                        </article>

                        {/* Right spacer column for breathing room */}
                        <aside />
                    </div>
                </div>
            </section>

            <CrossLinks
                crossLinks={crossLinks}
                currentSlug={currentSlug}
                header={data.crossLinksHeader}
            />
        </div>
    );
}
