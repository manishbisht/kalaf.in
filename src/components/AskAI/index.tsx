import { Icon } from "../Icons";
import { usePageProduct, SITE_URL } from "../../hooks/usePageProduct";
import { trackAskAIClick, trackClicks } from "../../analytics";
import styles from "./style.module.css";

// "Ask AI": opens an AI assistant with a ready-made question about the page
// (or about Kalaf as a whole). /llms.txt gives the assistant a plain-text
// summary of the brand and catalogue to answer from.
const ASSISTANTS = [
    { name: "Claude", url: (q: string) => `https://claude.ai/new?q=${q}` },
    { name: "ChatGPT", url: (q: string) => `https://chatgpt.com/?q=${q}` },
    {
        name: "Perplexity",
        url: (q: string) => `https://www.perplexity.ai/search?q=${q}`,
    },
];

function usePrompt() {
    const { product, variant, url } = usePageProduct();
    const sources = `Use ${url} and ${SITE_URL}/llms.txt.`;
    if (product && variant) {
        return `Tell me about the Kalaf ${product.title} in ${variant.colour}: what it's made of, fit and sizes, price, how to care for it, and where I can buy it. ${sources}`;
    }
    return `What is Kalaf (${SITE_URL}), the clothing label from Jaipur? Summarise what it sells, prices, where to buy, shipping and returns, and how to contact them. ${sources}`;
}

export function AskAI({ dark = false }: { dark?: boolean }) {
    const q = encodeURIComponent(usePrompt());
    return (
        <div className={`${styles.wrap} ${dark ? styles.dark : ""}`}>
            <span className={styles.label}>Ask AI about this page</span>
            <div className={styles.links}>
                {ASSISTANTS.map((a) => (
                    <a
                        key={a.name}
                        href={a.url(q)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        {...trackClicks(() => trackAskAIClick(a.name))}
                    >
                        {a.name} <Icon name="arrowUpRight" size={12} />
                    </a>
                ))}
            </div>
        </div>
    );
}
