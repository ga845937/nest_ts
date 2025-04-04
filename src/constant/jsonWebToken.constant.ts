import { createHash } from "node:crypto";

import { name as projectName, version as projectVersion } from "@packageJson";

export const jwtSecret = createHash("sha256").update(`jwt-${projectName}-${projectVersion}`).digest("base64").slice(0, 32);
