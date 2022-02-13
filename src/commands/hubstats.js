import Axios from 'axios';
import Settings from '../../src/settings.js';
import { prefix } from '../../src/utils.js';
import { MessageEmbed } from 'discord.js';
import devSettings from '../../settings-development.json' assert { type: 'json' };

const publicSSMApiPath = 'https://hub.splitscreen.me/api/v1/';

export const config = {
  name: `hubstats`,
  aliases: [],
  description: `Return stats from the hub`,
  usage: `${prefix}hubstats`,
  example: `${prefix}hubstats`,
};

export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  const totalDownloadCountEver = await Axios.get(publicSSMApiPath + 'hubstats');
  const embed = new MessageEmbed();
  embed
    .setColor('#3498db')
    .setTitle('Hub Stats')
    .setAuthor({
      name: devSettings.public.productName,
      iconURL: DiscordBot.user.avatarURL,
      URL: devSettings.public.productAddress,
    })
    .setTimestamp()
    .setFooter({
      text: '© SplitScreen.Me',
      iconURL: DiscordBot.user.avatarURL.toString,
    })
    .addFields({ name: 'Stats', value: totalDownloadCountEver.data });

  receivedMessage.channel.send({ embeds: [embed] });
};
