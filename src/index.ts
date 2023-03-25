import fs from "fs";
import { ChatCompletionRequestMessage } from "openai";
import { openai } from "./utils/config.js";
import { Model } from "./types/models.js";

const messageThread: ChatCompletionRequestMessage[] = [
  {
    role: "user",
    name: "t3dotgg",
    content: `
    ===
    Replying to The Primeagen (@ThePrimeagen)'s tweet:
    i cannot believe how many devs use 2 monitors

    you just don't know the power of a good window manager and work flow
    ===
    I still do most of my work on my laptop on the couch.
    `,
  },
  {
    role: "user",
    name: "iamredseal",
    content: `
    I wish I could do that. I can't shake the multiple screens but that may be because of the 13" Mac.
    `,
  },
  {
    role: "user",
    name: "t3dotgg",
    content: `
    I did this on the 11” MacBook Air for years. Never enjoyed a computer bigger than 14
    `,
  },
  {
    role: "user",
    name: "iamredseal",
    content: `
    being on a couch with an 11"...I feel like my neck would hate me!
    `,
  },
  {
    role: "system",
    content: `
    Write a response to the above chat thread, as a new user to the conversation. It should be short, edgy, and could be a controversial hot take, but must make sense. It must be less than 240 characters. It could cause some nice chaos in the chat thread.
    `,
  },
];

const model: Model = "gpt-4";
const res = await openai.createChatCompletion({
  model,
  messages: messageThread,
  // messages: [
  //   {
  //     role: "user",
  //     content: input,
  //   },
  // ],
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

