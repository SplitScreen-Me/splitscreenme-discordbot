import { SlashCommandBuilder } from 'discord.js';

const latestNucleusReleaseLink =
  'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases/latest';

export const config = {
  name: `release`,
  aliases: ['r', 'nucleus'],
  description: `Return link to the latest Nucleus Co-op release`,
  usage: `<@user>`,
  example: ``,
};

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description)
  .addUserOption((option) =>
    option.setName('user').setDescription('User to send the link to'),
  );

export const fromMessage = ({ mentionedUser }) => ({ user: mentionedUser });

export const run = async ({ options: { user } }) => ({
  content: user
    ? `<@${user.id}>\nHere's a link to the latest Nucleus Co-op version:\n${latestNucleusReleaseLink}`
    : latestNucleusReleaseLink,
});
