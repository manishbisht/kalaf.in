import PolicyLayout, {
    POLICY_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function CookiePolicy() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="cookies"
            crossLinks={POLICY_CROSS_LINKS}
        />
    );
}
