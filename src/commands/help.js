import Settings from '../settings.js';
import { prefix } from '../../src/utils.js';
import { MessageEmbed } from 'discord.js';
import devSettings from '../../settings-development.json' assert { type: 'json' };

export const config = {
  name: `help`,
  aliases: [`cmds`, `commands`, `halp`],
  description: `Shows a list of all available bot commands`,
  usage: `${prefix}help {command_name}`,
  example: `${prefix}help handler`,
};
export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  const embed = new MessageEmbed();
  const { commands } = receivedMessage.client;

  console.log('args', args);
  if (!args.length) {
    embed
      .setColor('#3498db')
      .setTitle('Help Command')
      .setAuthor({
        name: devSettings.public.productName,
        iconURL: DiscordBot.user.avatarURL,
        URL: devSettings.public.productAddress,
      })
      .setDescription(
        `Here is a list of all my commands\n\nuse \`${prefix}help <command_name>\` or  \`${prefix}help <alias_name>\` to get info about a specific command.\n\nFor example:\n\`${prefix}help ${
          commands.first().config.name
        }\`\nor \n\`${prefix}help ${commands.first().config.aliases[0]}\``,
      )
      .addFields({
        name: 'Commands (aliases)',
        value: `\`\`\`${
          prefix +
          commands
            .map(
              (c) =>
                `${c.config.name} ${
                  c.config.aliases.length
                    ? '(' + c.config.aliases.join(`, `) + `)`
                    : ''
                }`,
            )
            .join(`\n${prefix}`)
        }\`\`\``,
      })
      .setTimestamp()
      .setFooter({
        text: '© SplitScreen.Me',
        iconURL: DiscordBot.user.avatarURL,
      });

    receivedMessage.channel.send({ embeds: [embed] });
    return;
  }

  const name = args[0];
  const cmd =
    commands.get(name) ||
    commands.find((c) => c.config.aliases && c.config.aliases.includes(name));

  if (!cmd) {
    receivedMessage.reply(`${name} is NOT a valid command`);
    return;
  }

  embed
    .setColor('#3498db')
    .setTitle('Help Command')
    .setAuthor({
      name: devSettings.public.productName,
      iconURL: DiscordBot.user.avatarURL,
      URL: devSettings.public.productAddress,
    })
    .setTimestamp()
    .setFooter({
      text: '© SplitScreen.Me',
      iconURL: DiscordBot.user.avatarURL,
    });
  if (cmd.config.name)
    embed.setDescription(
      `Help for the \`${prefix + cmd.config.name}\` command`,
    );
  if (cmd.config.description)
    embed.addFields({ name: 'Description', value: cmd.config.description });
  if (cmd.config.aliases.length)
    embed.addFields({
      name: 'Aliases',
      value: `\`\`\`${cmd.config.aliases.join(` , `)}\`\`\``,
    });
  if (cmd.config.usage)
    embed.addFields({
      name: 'Usage  [mandatory] <optional>',
      value: `\`\`\`${cmd.config.usage}\`\`\``,
    });
  if (cmd.config.example)
    embed.addFields({
      name: 'Example',
      value: `\`\`\`${cmd.config.example}\`\`\``,
    });

  receivedMessage.channel.send({ embeds: [embed] });
};
