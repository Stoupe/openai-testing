import { ChatCompletionRequestMessage } from "openai";
import { createInterface } from "readline/promises";
import { Model } from "./types/models.js";
import { openai } from "./utils/config.js";
import { createFile } from "./utils/helper-functions.js";

const allMessages: ChatCompletionRequestMessage[] = [];

// Parse parameters from the command line arguments
const args = process.argv.slice(2);

// Check if debug mode is enabled from the command line arguments
const DEBUG = args.find((arg) => ["--debug", "-d"].includes(arg));

// Get the model from the command line arguments (either 4 or 3.5)
const MODEL_FROM_ARGS =
  args
    .find((arg) => arg.includes("--model") || arg.includes("-m"))
    ?.split("=")[1] ?? "4";
if (MODEL_FROM_ARGS !== "4" && MODEL_FROM_ARGS !== "3.5") {
  console.log("Invalid model. Please use either 4 or 3.5.");
  process.exit(1);
}

console.log(
  `\n===================== GPT-${MODEL_FROM_ARGS} Chat =====================\n`
);
console.log("Pass in --debug or -d to enable debug mode.");
console.log("Pass in --model=4 or -m=4 to use GPT-4. (default)");
console.log("Pass in --model=3.5 or -m=3.5 to use GPT-3.5.");
console.log("");
console.log(
  "Type [stop, exit, quit or save] to exit and save the chat to a file."
);
console.log("Use ^c to exit without saving the chat.");

if (DEBUG) {
  console.log("\n║ ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  ║");
  console.log("║ Debug mode is enabled. ║");
  console.log("║ ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  ║");
}

while (true) {
  // Create readline interface to get user input from the terminal
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Await user input
  const input = await rl.question("\n> ");
  rl.close();

  if (["stop", "exit", "quit", "save"].includes(input.toLowerCase())) {
    // Save the chat to a file
    createFile(
      `src/out/chats/${new Date().toISOString()}.json`,
      JSON.stringify(allMessages, null, 2)
    );
    break;
  }

  if (input.length < 1) {
    console.log("Please enter a message.");
    continue;
  }

  // Add user input to the list of all messages
  allMessages.push({
    role: "user",
    content: input.trim(),
  });

  const model: Model = MODEL_FROM_ARGS === "3.5" ? "gpt-3.5-turbo" : "gpt-4";

  try {
    const completion = await openai.createChatCompletion({
      model,
      messages: allMessages,
      temperature: 0.8,
      max_tokens: model === "gpt-4" ? 4000 : 2000,
    });

    // Check if the bot's response is empty
    if (!completion.data.choices[0].message?.content?.trim()) {
      console.error("The bot's response was empty. Try again.");
      console.error("Status:", completion.status);
      console.error("Finish reason:", completion.data.choices[0].finish_reason);
      continue;
    } else {
      if (DEBUG) {
        console.log("Status:", completion.status);
        console.log("Finish reason:", completion.data.choices[0].finish_reason);
        console.log("Usage", { usage: completion.data.usage });
      }
    }

    // Print the bot's response to the terminal
    console.log(completion.data.choices[0].message?.content?.trim() ?? "");

    // Add the bot's response to the list of messages
    allMessages.push({
      role: "system",
      content: completion.data.choices[0].message?.content?.trim() ?? "",
    });
  } catch (e: any) {
    console.log(e?.message ?? "");
    console.log(e?.response?.data?.error ?? "");
    continue;
  }
}

