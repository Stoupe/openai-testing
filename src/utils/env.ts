import { config as setupEnv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import * as z from "zod";

// This pulls the .env file relative to this file, allowing you to not have to run
// scripts from the project root.
const absolutePathToThisDir = path.dirname(fileURLToPath(import.meta.url));
setupEnv({ path: `${absolutePathToThisDir}/../../.env` });

const env = z
  .object({
    OPENAI_API_KEY: z.string(),
  })
  .parse(process.env);

export { env };

