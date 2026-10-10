import { EmbedBuilder } from 'discord.js';
import Settings from './settings.js';

// Common look of every embed sent by the bot.
export const baseEmbed = (client) =>
  new EmbedBuilder()
    .setColor(0x3498db)
    .setAuthor({
      name: Settings.public.productName,
      iconURL: client.user.displayAvatarURL(),
      url: Settings.public.productAddress,
    })
    .setTimestamp()
    .setFooter({
      text: '© SplitScreen.Me',
      iconURL: client.user.displayAvatarURL(),
    });
