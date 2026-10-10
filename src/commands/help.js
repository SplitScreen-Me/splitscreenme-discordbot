import { SlashCommandBuilder } from 'discord.js';
import { baseEmbed } from '../embeds.js';
import { findCommand } from '../registry.js';

export const config = {
  name: `help`,
  aliases: [`cmds`, `commands`, `halp`],
  description: `Shows a list of all available bot commands`,
  usage: `<command name>`,
  example: `handler`,
};

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description)
  .addStringOption((option) =>
    option
      .setName('command')
      .setDescription('Command to get info about')
      .setAutocomplete(true),
  );

export const fromMessage = ({ args }) => ({ command: args[0] });

export const autocomplete = async ({ value, commands }) =>
  [...commands.keys()]
    .filter((name) => name.startsWith(value.toLowerCase()))
    .map((name) => ({ name, value: name }));

export const run = async ({ client, commands, options: { command } }) => {
  const mention = `@${client.user.username}`;

  if (!command) {
    return {
      embeds: [
        baseEmbed(client)
          .setTitle('Help Command')
          .setDescription(
            `Type \`/\` to see all my commands, or mention me: \`${mention} <command>\`.\n\nUse \`/help command:<name>\` to get info about a specific command.`,
          )
          .addFields({
            name: 'Commands',
            value: [...commands.values()]
              .map((cmd) => `\`/${cmd.config.name}\` — ${cmd.config.description}`)
              .join('\n'),
          }),
      ],
    };
  }

  const cmd = findCommand(commands, command.toLowerCase());
  if (!cmd) return { content: `\`${command}\` is NOT a valid command` };

  const { name, aliases, description, usage, example } = cmd.config;
  const slashOptions = (cmd.data.toJSON().options ?? []).map(
    (option) =>
      `• \`${option.name}\`${option.required ? ' (required)' : ''}: ${option.description}`,
  );

  const embed = baseEmbed(client)
    .setTitle('Help Command')
    .setDescription(`Help for the \`/${name}\` command`)
    .addFields(
      { name: 'Description', value: description },
      { name: 'Slash command', value: [`\`/${name}\``, ...slashOptions].join('\n') },
      {
        name: 'Mention  [mandatory] <optional>',
        value: `\`\`\`${mention} ${name}${usage ? ` ${usage}` : ''}\`\`\`${
          aliases.length ? `Aliases: ${aliases.map((alias) => `\`${alias}\``).join(', ')}` : ''
        }`,
      },
    );
  if (example) {
    embed.addFields({ name: 'Example', value: `\`\`\`${mention} ${name} ${example}\`\`\`` });
  }
  return { embeds: [embed] };
};
