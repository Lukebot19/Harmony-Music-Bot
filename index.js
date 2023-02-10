require("dotenv").config({ path: "./.env" });

const Bot = require("../code/struct/Bot");

const client = new Bot();
(async () =>
  await client.start(
   process.env.TOKEN
  ))();
