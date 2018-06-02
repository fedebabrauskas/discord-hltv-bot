import Discord from 'discord.js';
import { HLTV } from 'hltv';
import moment from 'moment';

export const getNextMatch = async (msg, myTeams) => {
  try {
    // get all matches from HLTV
    const allMatches = await HLTV.getMatches();
    // create new array with my prefered matches based on teams array
    const myMatches = allMatches.filter(({ team1, team2 }) => {
      // check if both teams exist
      if (team1 && team2) {
        return (
          myTeams.indexOf(team1.name) > -1 || myTeams.indexOf(team2.name) > -1
        );
      }
    });
    // select first match from myMatches which has date property (isnt currently playing)
    const { team1, team2, date, format, event, maps, live } = myMatches.filter(
      match => match.date
    )[0];
    // create discord rich embed
    const matchEmbed = new Discord.RichEmbed()
      .setTitle(`${team1.name} vs. ${team2.name} ${live ? '(PLAYING)' : ''}`)
      .setColor('#44bbfc')
      .addField('Date', moment(new Date(date)).format('LLL'))
      .addField('Format', format)
      .addField('Event', event.name)
      .addField('Maps', maps ? maps.map(m => m.name).join(', ') : 'TBA');
    // send embed to the current channel
    return msg.channel.send(matchEmbed);
  } catch (err) {
    console.log(err);
  }
};

export const getMatchStats = async (msg, team) => {
  try {
    // get all matches from HLTV
    const allMatches = await HLTV.getMatches();
    // get the first match based on my request
    const foundMatch = allMatches.filter(({ team1, team2 }) => {
      if (team1 && team2) {
        return team1.name == team || team2.name == team;
      }
    })[0];

    if (foundMatch) {
      // get full stats from the match with the found match id
      const {
        team1,
        team2,
        date,
        format,
        event,
        maps,
        streams,
        live
      } = await HLTV.getMatch({ id: foundMatch.id });
      // create the rich embed
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

      // send embed to the current channel
      msg.channel.send(matchEmbed);
    } else {
      // if match isnt valid, return error
      return msg.channel.send(`There are no matches for ${team}`);
    }
  } catch (err) {
    console.log(err);
  }
};
