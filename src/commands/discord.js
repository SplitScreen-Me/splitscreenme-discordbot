import Settings from '../../src/settings.js';
import { prefix } from '../../src/utils.js';

export const config = {
  name: `discord`,
  aliases: [`d`, `disc`],
  description: `Return invite link to the Nucleus Coop Discord`,
  usage: `${prefix}discord`,
  example: `${prefix}discord`,
};

export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  receivedMessage.reply('\nhttps://discord.gg/a9ssM5pxTW');
};
