import { SlashCommandBuilder } from 'discord.js';

export const config = {
  name: `discord`,
  aliases: [`d`, `disc`],
  description: `Return invite link to the Nucleus Coop Discord`,
  usage: ``,
  example: ``,
};

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description);

export const fromMessage = () => ({});

export const run = async () => ({ content: 'https://discord.gg/qnbZtpECYg' });
