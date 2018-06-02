import Discord from 'discord.js';
import moment from 'moment';
import { HLTV } from 'hltv';

import { getNextMatch, getMatchStats } from './modules/hltv';
import { prefix, token, myTeams } from './config';

const client = new Discord.Client();

client.on('message', msg => {
  const { content } = msg;
  if (!content.startsWith(prefix)) return;

  const args = content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  // !nextmatch command
  if (command === 'nextmatch') return getNextMatch(msg, myTeams);

  // !match command
  if (command === 'match')
    return getMatchStats(msg, !args[1] ? args[0] : args.join(' '));
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(token);
