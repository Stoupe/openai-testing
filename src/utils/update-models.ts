import { openai } from "./config.js";
import { createFile } from "./helper-functions.js";

// Find and export models lisit
const models = await openai.listModels();
const modelList = models.data.data.map((model) => model.id);

const fileContents = `const models = ${JSON.stringify(
  modelList,
  null,
  2
)} as const;

export type Model = (typeof models)[number];

`;

createFile("./src/types/models.d.ts", fileContents);

