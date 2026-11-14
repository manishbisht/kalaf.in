import PolicyLayout, { HELP_CROSS_LINKS } from "../../components/PolicyLayout";
import { data } from "./data";

export default function Faq() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="faq"
            crossLinks={HELP_CROSS_LINKS}
        />
    );
}
