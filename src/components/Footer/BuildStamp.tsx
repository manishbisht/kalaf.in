import { ENV } from "../../env";
import styles from "./style.module.css";

export function BuildStamp() {
    return (
        <div className={styles.buildStamp}>
            Build {ENV.buildVersion || "dev"} ·{" "}
            {ENV.commitSha ? ENV.commitSha.slice(0, 7) : "local"}
        </div>
    );
}
