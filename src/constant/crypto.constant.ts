import { createHash } from "node:crypto";

import { name as projectName, version as projectVersion } from "@packageJson";

export const cryptoAlgorithm = "aes-256-ctr";

export const cryptoIVLength = 16;

export const cryptoKey = createHash("sha256").update(`crypto-${projectName}-${projectVersion}`).digest("base64").slice(0, 32);
