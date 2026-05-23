export type Colourway = {
    id: string;
    name: string;
    swatch: string;
    code: string;
};

export const COLOURWAYS: Colourway[] = [
    { id: "chambray", name: "Chambray", swatch: "#5d7b94", code: "DENIM" },
    { id: "olive", name: "Olive", swatch: "#6B6A47", code: "OLIVE" },
    { id: "sand", name: "Sand", swatch: "#c9b79c", code: "SAND" },
    { id: "bone", name: "Bone", swatch: "#ede8df", code: "BONE" },
    { id: "ink", name: "Ink", swatch: "#1a1a1a", code: "INK" },
];

// Tint applied to the variant image so a single source asset can stand in
// for every colourway. Sand and bone leave the image untouched.
export function imageFilter(id: string) {
    if (id === "sand" || id === "bone") return "none";
    const rotate =
        id === "olive" ? "40deg" : id === "chambray" ? "180deg" : "0deg";
    const bright = id === "ink" ? "0.35" : "0.95";
    return `sepia(0.3) saturate(1.4) hue-rotate(${rotate}) brightness(${bright})`;
}
