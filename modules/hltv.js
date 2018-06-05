import Discord from 'discord.js';
import moment from 'moment';
import _ from 'lodash';
import { HLTV } from 'hltv';

import { myTeams } from '../config';

const getNextMatch = async () => {
  try {
    // get all matches from HLTV.org
    const allMatches = await HLTV.getMatches();
    // create new array with matches of myTeams
    const id = allMatches.filter(({ team1, team2, date }) => {
      // check if both teams exist
      if (team1 && team2)
        return (
          (date && myTeams.indexOf(team1.name) > -1) ||
          myTeams.indexOf(team2.name) > -1
        );
    })[0].id;
    return await HLTV.getMatch({ id });
  } catch (err) {
    console.log(err);
  }
};

export const nextMatchDetails = async msg => {
  const {
    team1,
    team2,
    date,
    format,
    event,
    maps,
    live,
    streams
  } = await getNextMatch();
  // create discord rich embed
  const matchEmbed = new Discord.RichEmbed()
    .setTitle(`${team1.name} vs. ${team2.name} ${live ? '(PLAYING)' : ''}`)
    .setColor('#44bbfc')
    .addField('Date', moment(new Date(date)).format('LLL'))
    .addField('Format', format)
    .addField('Event', event.name)
    .addField('Maps', maps.map(m => `${m.name} - ${m.result}`).join(', '))
    .addField(
      'Streams',
      streams.length > 0
        ? `${streams[0].name} (${streams[0].viewers}) - ${streams[0].link}`
        : 'No streams for this match'
    );
  // print embed in the chat
  return msg.channel.send(matchEmbed);
};

export const nextMatchAnnouncer = client => {
  let timeInMinutes = 30;
  // empty variable for current match
  let currentMatch = {};
  // find channel on every guild to print messages
  client.guilds.forEach(g => {
    let defaultChannel = '';
    g.channels.forEach(c => {
      if (c.type === 'text' && defaultChannel === '') {
        if (c.permissionsFor(g.me).has('SEND_MESSAGES')) {
          defaultChannel = c;
        }
      }
    });
    setInterval(async () => {
      const nextMatch = await getNextMatch();
      const { team1, team2, date, streams } = nextMatch;
      if (!_.isEqual(currentMatch, nextMatch)) {
        currentMatch = nextMatch;
        defaultChannel.send(
          `**${team1.name} vs. ${team2.name}** - *${moment(
            new Date(date)
          ).calendar()}* ${!_.isEmpty(streams) ? `\n${streams[0].link}` : ''}`
        );
      }
    }, timeInMinutes * 60 * 1000);
  });
};
