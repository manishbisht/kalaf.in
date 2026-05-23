import PolicyLayout, {
    POLICY_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function Privacy() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="privacy"
            crossLinks={POLICY_CROSS_LINKS}
        />
    );
}
