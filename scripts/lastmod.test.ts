import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error -- plain .mjs build script, no type declarations
import { makeLastmod, sourcesFor } from "./lastmod.mjs";
import { prerenderPaths } from "../src/seo";

const root = join(import.meta.dirname, "..");

describe("sitemap lastmod sources", () => {
    it("every prerendered page maps to source files that exist", () => {
        for (const path of prerenderPaths()) {
            const files = sourcesFor(path) as string[] | null;
            expect(files, path).not.toBeNull();
            for (const f of files!) {
                expect(existsSync(join(root, f)), `${path} → ${f}`).toBe(true);
            }
        }
    });

    it("uses the last commit date, today when dirty, and caches lookups", () => {
        const calls: string[][] = [];
        const git = (_cwd: string, args: string[]) => {
            calls.push(args);
            if (args[0] === "status") {
                return args.includes("src/pages/Privacy") ? " M x" : "";
            }
            return "2026-11-02";
        };
        const lastmod = makeLastmod({ cwd: root, today: "2026-11-14", git });
        expect(lastmod("/terms")).toBe("2026-11-02");
        expect(lastmod("/privacy")).toBe("2026-11-14");
        expect(lastmod("/unknown")).toBe("2026-11-14");
        const before = calls.length;
        lastmod("/products/a");
        lastmod("/products/b");
        expect(calls.length - before).toBe(2); // one status + one log
    });

    it("falls back to the build date when git fails", () => {
        const lastmod = makeLastmod({
            cwd: root,
            today: "2026-11-14",
            git: () => {
                throw new Error("not a git repo");
            },
        });
        expect(lastmod("/")).toBe("2026-11-14");
    });
});
