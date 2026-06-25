import PolicyLayout, { HELP_CROSS_LINKS } from "../../components/PolicyLayout";
import { data } from "./data";

export default function CareGuide() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="care-guide"
            crossLinks={HELP_CROSS_LINKS}
        />
    );
}
