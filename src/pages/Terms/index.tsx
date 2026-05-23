import PolicyLayout, {
    POLICY_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function Terms() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="terms"
            crossLinks={POLICY_CROSS_LINKS}
        />
    );
}
