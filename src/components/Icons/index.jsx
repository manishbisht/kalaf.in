const ic = {
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
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  pinterest: (p) => (
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9 19c.5-1.5 2-7 2-7" />
      <path d="M8 11.5c0-2.5 1.7-4.5 4-4.5 2.2 0 3.7 1.5 3.7 3.7 0 2.5-1.5 4.3-3.4 4.3-1 0-1.8-.7-1.6-1.7" />
    </svg>
  ),
  tiktok: (p) => (
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
      <path d="M16 4v4a4 4 0 0 0 4 4" />
      <path d="M16 4v11a4 4 0 1 1-4-4" />
    </svg>
  ),
  youtube: (p) => (
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
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
    </svg>
  ),
}

export function Icon({ name, size }) {
  return ic[name] ? ic[name]({ size }) : null
}
