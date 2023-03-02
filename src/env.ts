import { config as setupEnv } from "dotenv";
import * as z from "zod";

setupEnv();

const env = z
  .object({
    OPENAI_API_KEY: z.string(),
  })
  .parse(process.env);

export { env };
