import PolicyLayout, {
    HELP_CROSS_LINKS,
} from "../../components/PolicyLayout";
import { data } from "./data";

export default function TrackOrder() {
    return (
        <PolicyLayout
            data={data}
            currentSlug="track-order"
            crossLinks={HELP_CROSS_LINKS}
        />
    );
}
