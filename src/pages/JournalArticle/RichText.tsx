import { Fragment } from "react";
import { Link } from "react-router-dom";
import { parseLinks } from "../Journal/articles";

// Article text with its [label](/path) links rendered as router <Link>s.
export function RichText({ text }: { text: string }) {
    return (
        <>
            {parseLinks(text).map((part, i) =>
                typeof part === "string" ? (
                    <Fragment key={i}>{part}</Fragment>
                ) : (
                    <Link key={i} to={part.to}>
                        {part.label}
                    </Link>
                )
            )}
        </>
    );
}
