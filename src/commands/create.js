import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SlashCommandBuilder } from 'discord.js';
import { baseEmbed } from '../embeds.js';

const templatesDir = fileURLToPath(
  new URL('../handler_templates/', import.meta.url),
);
const engines = readdirSync(templatesDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => file.slice(0, -'.js'.length));

export const config = {
  name: `create`,
  aliases: [`c`, `make`],
  description: `Creates the handler template for a chosen game engine.`,
  usage: `[engine name] <@user>`,
  example: `cry_engine`,
};

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description)
  .addStringOption((option) =>
    option
      .setName('engine')
      .setDescription('Game engine of the template')
      .setRequired(true)
      .addChoices(...engines.map((engine) => ({ name: engine, value: engine }))),
  )
  .addUserOption((option) =>
    option.setName('user').setDescription('User to send the template to'),
  );

export const fromMessage = ({ args, mentionedUser }) => ({
  engine: args[0],
  user: mentionedUser,
});

export const run = async ({ client, options: { engine, user } }) => {
  // Template file names are case sensitive on Linux, user input is not.
  const match = engines.find(
    (name) => name.toLowerCase() === engine?.toLowerCase(),
  );

  if (!match) {
    return {
      content: `${
        engine ? `\`${engine}\` is NOT a valid game engine.\n` : ''
      }Please provide a game engine.`,
      embeds: [
        baseEmbed(client)
          .setTitle('Create Options')
          .setDescription('Here are the possible options for the create command')
          .addFields({
            name: 'Available Game Engines',
            value: `\`\`\`${engines.join('\n')}\`\`\``,
          }),
      ],
    };
  }

  return {
    content: `${user ? `<@${user.id}> ` : ''}Here's your template file!`,
    files: [{ attachment: join(templatesDir, `${match}.js`), name: `${match}.js` }],
  };
};
