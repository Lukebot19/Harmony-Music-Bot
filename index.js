require("dotenv").config({ path: "./.env" });

const Bot = require("../code/struct/Bot");

const client = new Bot();
(async () =>
  await client.start(
    "OTgwMTQ1NDU1NDExMzgwMjk1.GACiA5.iE8lJtd9-ycqS56-G2FHOWdLIg4lrLsuc_NvWg"
  ))();
