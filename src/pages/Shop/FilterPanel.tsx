import { FILTER_GROUPS, facetOptions, type Selection } from "./filters";
import type { ListingItem } from "../../data/catalog";
import { Swatch } from "../../components/Swatch";
import styles from "./style.module.css";

// Representative colour code per colour family, for the filter swatches.
const FAMILY_SWATCH: Record<string, string> = {
    Black: "BK",
    Green: "GR",
    Maroon: "MA",
    Pink: "PI",
    Blue: "RB",
    Red: "RED",
    Yellow: "YEL",
    White: "WH",
    Beige: "BE",
    Multicolour: "MU",
};

export function FilterPanel({
    items,
    selection,
    onToggle,
}: {
    items: ListingItem[];
    selection: Selection;
    onToggle: (group: string, value: string) => void;
}) {
    return (
        <div className={styles.filterGroups}>
            {FILTER_GROUPS.map((group) => {
                const options = facetOptions(items, group, selection);
                if (options.length < 2) return null;
                return (
                    <fieldset key={group.key} className={styles.group}>
                        <legend className={styles.groupLabel}>
                            {group.label}
                        </legend>
                        {options.map(({ value, count }) => {
                            const checked =
                                selection[group.key]?.includes(value) ?? false;
                            return (
                                <label
                                    key={value}
                                    className={`${styles.option} ${count === 0 && !checked ? styles.optionEmpty : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            onToggle(group.key, value)
                                        }
                                    />
                                    {group.key === "colour" && (
                                        <Swatch
                                            code={FAMILY_SWATCH[value] ?? ""}
                                            size={16}
                                        />
                                    )}
                                    <span className={styles.optionLabel}>
                                        {value}
                                    </span>
                                    <span className={styles.optionCount}>
                                        {count}
                                    </span>
                                </label>
                            );
                        })}
                    </fieldset>
                );
            })}
        </div>
    );
}
