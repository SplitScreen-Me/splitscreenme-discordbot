import Settings from '../../src/settings.js';
import { prefix } from '../../src/utils.js';

const latestNucleusReleaseLink =
  'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases/latest';

export const config = {
  name: `release`,
  aliases: ['r', 'nucleus'],
  description: `Return link to the latest Nucleus Co-op release`,
  usage: `${prefix}release <@user>`,
  example: `${prefix}release`,
};

export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  let userMentioned = receivedMessage.mentions.users.first();

  if (userMentioned) {
    receivedMessage.channel.send({
      content: `<@!${userMentioned.id}>\nHere's a link to the latest Nucleus Co-op version:\n${latestNucleusReleaseLink}`,
    });
  } else {
    receivedMessage.reply(latestNucleusReleaseLink);
  }
};
