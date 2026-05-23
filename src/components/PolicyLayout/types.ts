// Data shapes consumed by PolicyLayout. Exported so each page can type its data.

export type PolicyBodyBlock =
    | { kind: "p"; text: string }
    | { kind: "list"; items: string[] };

export type PolicySection = {
    id: string;
    title: string;
    body: PolicyBodyBlock[];
    steps?: string[];
    callout?: { label: string; value: string };
};

export type PolicyPromise = {
    kicker: string;
    label: string;
    body: string;
};

export type PolicyData = {
    eyebrow: string;
    title: string;
    ornament: string;
    summary: string;
    updated: string;
    readTime: string;
    crossLinksHeader?: string;
    promises?: PolicyPromise[];
    sections: PolicySection[];
};

export type CrossLink = {
    slug: string;
    num: string;
    label: string;
    to: string;
};
