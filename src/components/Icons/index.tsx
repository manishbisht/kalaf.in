import type { ReactElement } from "react";

export type IconName =
    | "search"
    | "bag"
    | "account"
    | "menu"
    | "close"
    | "arrowRight"
    | "arrowUpRight"
    | "plus"
    | "minus"
    | "facebook"
    | "instagram"
    | "linkedin"
    | "x";

type IconRenderer = (p: { size?: number }) => ReactElement;

const ic: Record<IconName, IconRenderer> = {
    search: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    ),
    bag: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    ),
    account: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    ),
    menu: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    ),
    close: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    arrowRight: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
    arrowUpRight: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
        </svg>
    ),
    plus: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    minus: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 20}
            height={p.size || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    facebook: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 18}
            height={p.size || 18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    ),
    instagram: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 18}
            height={p.size || 18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <circle cx="12" cy="12" r="4" />
            <circle
                cx="17.5"
                cy="6.5"
                r="0.75"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    ),
    linkedin: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 18}
            height={p.size || 18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
    x: (p) => (
        <svg
            viewBox="0 0 24 24"
            width={p.size || 18}
            height={p.size || 18}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 4L6 20" />
            <path d="M6 4l12 16" />
        </svg>
    ),
};

export function Icon({ name, size }: { name: IconName; size?: number }) {
    return ic[name]({ size });
}
