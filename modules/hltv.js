import { MessageEmbed } from "discord.js";
import moment from "moment";
import _ from "lodash";
import { HLTV } from "hltv";

import { myTeams } from "../config";

const getNextMatch = async () => {
  try {
    // Get matches from HLTV
    const allMatches = await HLTV.getMatches();
    // Create new array with matches of my teams
    const filteredMatches = allMatches.filter(({ team1, team2, date }) => {
      if (team1 && team2) {
        return (
          date &&
          myTeams.some(team => team === team1.name || team === team2.name)
        );
      }
    });
    return HLTV.getMatch({ id: filteredMatches[0].id });
  } catch (error) {
    console.log(error);
  }
};

export const nextMatchDetails = async (client, message) => {
  const {
    team1,
    team2,
    date,
    format,
    event,
    maps,
    live,
    streams,
  } = await getNextMatch();
  return message.channel.send({
    embed: new MessageEmbed({
      color: 4504572,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: `${team1.name} vs. ${team2.name} ${live ? "(PLAYING)" : ""}`,
      fields: [
        {
          name: "Date",
          value: moment(new Date(date)).format("LLL"),
        },
        {
          name: "Format",
          value: format,
        },
        {
          name: "Event",
          value: event.name,
        },
        {
          name: "Maps",
          value: maps
            .map(m => `${m.name} ${m.name === "tba" ? "" : `- ${m.result}`}`)
            .join(", "),
        },
        {
          name: "Streams",
          value:
            streams.length > 0
              ? `${streams[0].name} (${streams[0].viewers}) - https://www.hltv.org${streams[0].link}`
              : "No streams for this match",
        },
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© 2020",
      },
    }),
  });
};

export const nextMatchAnnouncer = client => {
  let timeInMinutes = 30;
  // empty variable for current match
  let currentMatch = {};
  // find channel on every guild to print messages
  client.guilds.cache.forEach(guild => {
    let defaultChannel;
    guild.channels.cache.forEach(channel => {
      if (channel.type === "text" && !defaultChannel) {
        if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
          defaultChannel = channel;
        }
      }
    });
    setInterval(async () => {
      const nextMatch = await getNextMatch();
      const { team1, team2, date, streams } = nextMatch;
      if (currentMatch.id !== nextMatch.id) {
        currentMatch = nextMatch;
        const matchDate = moment(new Date(date)).calendar();
        defaultChannel.send(
          `**${team1.name} vs. ${team2.name}** - ${matchDate} ${streams &&
            `\nhttps://www.hltv.org${streams[0].link}`}`,
        );
      }
    }, timeInMinutes * 60 * 1000);
  });
};
