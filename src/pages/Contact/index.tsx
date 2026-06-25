import PolicyLayout, { HELP_CROSS_LINKS } from "../../components/PolicyLayout";
import { data } from "./data";

export default function Contact() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="contact"
            crossLinks={HELP_CROSS_LINKS}
        />
    );
}
