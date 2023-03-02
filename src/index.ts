import { Configuration, OpenAIApi } from "openai";
import { env } from "./env.js";
import fs from "fs";
import { Model } from "./models.js";
import * as readline from "readline/promises";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Find and export models lisit
// const models = await openai.listModels();
// const modelList = models.data.data.map((model) => model.id);
// fs.writeFileSync("src/models.json", JSON.stringify(modelList, null, 2));

// Get user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = await rl.question("Enter your question: ");
rl.close();

const model: Model = "gpt-3.5-turbo";
const res = await openai.createChatCompletion({
  model,
  messages: [
    {
      role: "user",
      content: input,
    },
  ],
  temperature: 1,
  max_tokens: 512,
});

console.log(res.data.choices[0].message?.content?.trim() ?? "");

// Save the response to a file
fs.existsSync("src/out") || fs.mkdirSync("src/out");
fs.writeFileSync("src/out/res.json", JSON.stringify(res.data, null, 2));
fs.writeFileSync(
  "src/out/res.txt",
  res.data.choices[0].message?.content?.trim() ?? ""
);
