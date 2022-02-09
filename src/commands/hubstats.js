import Axios from 'axios';
import Settings from '../../src/settings';
const { prefix } = require('../../src/utils.js');
const { MessageEmbed } = require('discord.js');
import devSettings from '../../settings-development';

const publicSSMApiPath = 'https://hub.splitscreen.me/api/v1/';

exports.config = {
  name: `hubstats`,
  aliases: [],
  description: `Return stats from the hub`,
  usage: `${prefix}hubstats`,
  example: `${prefix}hubstats`,
};

exports.execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  const totalDownloadCountEver = await Axios.get(publicSSMApiPath + 'hubstats');
  const embed = new MessageEmbed();
  embed
    .setColor('#3498db')
    .setTitle('Hub Stats')
    .setAuthor(
      devSettings.public.productName,
      DiscordBot.user.avatarURL,
      devSettings.public.productAddress,
    )
    .setTimestamp()
    .setFooter('© SplitScreen.Me', DiscordBot.user.avatarURL)
    .addFields({ name: 'Stats', value: totalDownloadCountEver.data });

  receivedMessage.channel.send({ embeds: [embed] });
};
