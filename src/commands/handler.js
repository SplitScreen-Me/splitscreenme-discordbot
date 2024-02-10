import Axios from 'axios';
import Settings from '../settings.js';
import { prefix } from '../../src/utils.js';

const publicSSMApiPath = 'https://hub.splitscreen.me/api/v1/';

export const config = {
  name: `handler`,
  aliases: [`h`, `script`],
  description: `Return handler for the specified game.`,
  usage: `${prefix}handler [game name]`,
  example: `${prefix}handler Borderlands`,
};

export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  if (!args.length) {
    receivedMessage.channel.send('Please provide a game name.');
    return;
  }

  let totalGame = '';
  args.forEach((value) => {
    totalGame = `${totalGame} ${value.toLowerCase()}`;
  });
  totalGame.toLowerCase();
  totalGame = totalGame.substr(1);
  console.log('totalGame: ', totalGame);
  const allHandlers = await Axios.get(
    publicSSMApiPath + 'handlers/' + totalGame,
  );
  if (!allHandlers.data.Handlers) {
    receivedMessage.channel.send(
      'Sorry, no handler found matching your query!',
    );
    return;
  }
  const foundHandlers =
    allHandlers.data.Handlers.length > 3
      ? allHandlers.data.Handlers.slice(0, 3)
      : allHandlers.data.Handlers;
  let downloadLink = ' ';
  foundHandlers.forEach((handler) => {
    downloadLink = `https://hub.splitscreen.me/cdn/storage/packages/${handler.currentPackage}/original/handler-${handler._id}-v${handler.currentVersion}.nc?download=true`;
    receivedMessage.channel.send({
      embeds: [
        {
          color: 3447003,
          author: {
            name: DiscordBot.user.username,
            icon_url: DiscordBot.user.avatarURL,
          },
          title: handler.gameName,
          url: `https://hub.splitscreen.me/handler/${handler._id}`,
          thumbnail: {
            url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${handler.gameCover}.jpg`,
          },
          fields: [
            {
              name: 'Author',
              inline: true,
              value: `[${handler.ownerName}](https://hub.splitscreen.me/user/${handler.owner})`,
            },
            {
              name: 'Hotness',
              inline: true,
              value: handler.stars.toString(),
            },
            {
              name: 'Total downloads',
              inline: true,
              value: handler.downloadCount.toString(),
            },
            {
              name: 'Players',
              inline: true,
              value: handler.maxPlayers > 2 ? `2 - ${handler.maxPlayers.toString()}` : handler.maxPlayers.toString(),
            },
            {
              name: 'Status',
              inline: true,
              value: handler.verified ? 'Verified' : 'Unverified',
            },
            {
              name: `Download`,
              inline: false,
              value: `[Download Handler (v${handler.currentVersion})](${downloadLink})`,
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: DiscordBot.user.avatarURL,
            text: '© SplitScreen.Me',
          },
        },
      ],
    });
  });
};
