# OpenAI testing

This repo is exists simply to make it easy and quick to play with the OpenAI API

## Installation and use

To use the OpenAI API, you need your own API key. Type `cp .env.example .env` to create your env file, then add your key to `.env`

This project uses pnpm. To install, you can use `npm i -g pnpm`

To install dependencies, use `pnpm i`

This project is setup with typescript and ts-node. Script files are in `src/`. To run any file, simply use `pnpm ts-node src/filename`, or you can `cd` into `src` first and run from there. No `tsc` required :)

## Typed models

Because different API keys will have different models available, you can generate a type containing the models your key has access to using the `update-models.ts` script, by running `pnpm update-models`
