import Discord from "discord.js";

import { nextMatchDetails, nextMatchAnnouncer } from "./modules/hltv";
import { prefix, token } from "./config";

const client = new Discord.Client();

client.on("message", msg => {
  const { content } = msg;

  if (!content.startsWith(prefix)) return;

  const args = content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "nextmatch") return nextMatchDetails(client, msg);
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  nextMatchAnnouncer(client);
});

client.login(token);
