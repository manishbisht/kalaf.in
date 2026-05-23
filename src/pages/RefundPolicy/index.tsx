import PolicyLayout, {
    POLICY_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function RefundPolicy() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="refund"
            crossLinks={POLICY_CROSS_LINKS}
        />
    );
}
