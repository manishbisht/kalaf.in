import PolicyLayout, { HELP_CROSS_LINKS } from "../../components/PolicyLayout";
import { data } from "./data";

export default function SizeGuide() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="size-guide"
            crossLinks={HELP_CROSS_LINKS}
        />
    );
}
