import PolicyLayout, {
    POLICY_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function ShippingReturns() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="returns"
            crossLinks={POLICY_CROSS_LINKS}
        />
    );
}
