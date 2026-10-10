import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { baseEmbed } from './embeds.js';
import { getAllHandlers } from './hub.js';
import { parseMention } from './mention.js';
import { findCommand, loadCommands } from './registry.js';

const ACTIVITY_REFRESH_INTERVAL = 60_000;
const FAILURE_MESSAGE = 'Sorry, something went wrong. Please try again later.';

const DiscordInit = async (secretDiscordToken) => {
  const commands = await loadCommands();
  const DiscordBot = new Client({
    // No privileged intent: without Message Content, GuildMessages only gives the content
    // of messages mentioning the bot, which is all the mention commands need.
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  DiscordBot.once(Events.ClientReady, async () => {
    console.log('[Debug] Connected as ' + DiscordBot.user.tag);
    console.log('[Debug] Servers:');
    DiscordBot.guilds.cache.forEach((guild) => {
      console.log('[Debug]  - ' + guild.name);
    });

    try {
      // Overwrites the whole global set, so registering on every start is idempotent.
      await DiscordBot.application.commands.set(
        [...commands.values()].map((command) => command.data.toJSON()),
      );
      console.log(`[Debug] Slash commands registered: ${[...commands.keys()].join(', ')}`);
    } catch (error) {
      console.error('[Error] Could not register slash commands', error);
    }

    const updateActivity = async () => {
      try {
        const handlers = await getAllHandlers();
        DiscordBot.user.setActivity(`Hosting ${handlers.length} handlers!`);
      } catch (error) {
        console.error('[Error] Could not refresh the handlers count', error);
      }
    };
    await updateActivity();
    setInterval(updateActivity, ACTIVITY_REFRESH_INTERVAL);
  });

  DiscordBot.on(Events.GuildCreate, (guild) => {
    console.log(
      `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`,
    );
  });

  DiscordBot.on(Events.GuildDelete, (guild) => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });

  DiscordBot.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isStringSelectMenu()) {
      await onSelect(interaction);
      return;
    }
    if (!interaction.isAutocomplete() && !interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;

    if (interaction.isAutocomplete()) {
      try {
        const focused = interaction.options.getFocused(true);
        await interaction.respond(await command.autocomplete({ ...focused, commands }));
      } catch (error) {
        console.error(`[Error] /${command.config.name} autocomplete`, error);
        await interaction.respond([]).catch(() => {});
      }
      return;
    }

    const options = Object.fromEntries(
      interaction.options.data.map((option) => [option.name, option.user ?? option.value]),
    );
    console.log(
      `[Slash] ${interaction.user.tag}: /${command.config.name}`,
      interaction.options.data.map((option) => `${option.name}:${option.value}`).join(' '),
    );

    try {
      // Hub requests can exceed the 3s Discord gives to answer: acknowledge first.
      await interaction.deferReply();
      await interaction.editReply(await command.run({ client: DiscordBot, commands, options }));
    } catch (error) {
      console.error(`[Error] /${command.config.name}`, error);
      const failure = interaction.deferred
        ? interaction.editReply({ content: FAILURE_MESSAGE })
        : interaction.reply({ content: FAILURE_MESSAGE, flags: MessageFlags.Ephemeral });
      await failure.catch(() => {});
    }
  });

  // Menus have a "<command>:<action>" custom id: the command that sent the menu handles the pick.
  const onSelect = async (interaction) => {
    const command = commands.get(interaction.customId.split(':')[0]);
    if (!command?.select) return;
    console.log(
      `[Select] ${interaction.user.tag}: ${interaction.customId} ${interaction.values.join(' ')}`,
    );

    try {
      const payload = await command.select({
        client: DiscordBot,
        values: interaction.values,
        menu: interaction.component.toJSON(),
      });
      // Only whoever asked can change the shared message, others get the result privately.
      const asker =
        interaction.message.interactionMetadata?.user.id ??
        interaction.message.mentions.repliedUser?.id;
      if (payload.components && asker === interaction.user.id) {
        await interaction.update(payload);
      } else {
        await interaction.reply({
          ...payload,
          flags: (payload.flags ?? 0) | MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error(`[Error] ${interaction.customId}`, error);
      await interaction
        .reply({ content: FAILURE_MESSAGE, flags: MessageFlags.Ephemeral })
        .catch(() => {});
    }
  };

  DiscordBot.on(Events.MessageCreate, async (receivedMessage) => {
    if (receivedMessage.author.bot) return; //Will ignore bots and it-self
    const mention = parseMention(receivedMessage.content, DiscordBot.user.id);
    if (!mention) return;

    const { commandName, args } = mention;
    try {
      if (!commandName) {
        await receivedMessage.reply({
          embeds: [
            baseEmbed(DiscordBot)
              .setTitle(`Hello! I am the bot for Splitscreen.me!`)
              .setURL('https://splitscreen.me/')
              .setDescription(
                `I connect with Splitscreen.me to get you data for handlers, statistics, and answer questions you may have! If you would like to see a list of my commands, please use \`/help\``,
              ),
          ],
        });
        return;
      }

      const command = findCommand(commands, commandName);
      if (!command) {
        await receivedMessage.reply(
          'Command NOT recognized, use `/help` to see all available commands',
        );
        return;
      }

      console.log(
        `[Mention] ${receivedMessage.author.tag}: ${command.config.name} ${args.join(' ')}`,
      );
      const mentionedUser = receivedMessage.mentions.users.find(
        (user) => user.id !== DiscordBot.user.id,
      );
      await receivedMessage.reply(
        await command.run({
          client: DiscordBot,
          commands,
          options: command.fromMessage({ args, mentionedUser }),
        }),
      );
    } catch (error) {
      console.error(`[Error] mention command ${commandName}`, error);
      await receivedMessage.reply(FAILURE_MESSAGE).catch(() => {});
    }
  });

  DiscordBot.on(Events.Error, (error) => console.error('[Error] Discord client', error));

  await DiscordBot.login(secretDiscordToken);
};

export default DiscordInit;
