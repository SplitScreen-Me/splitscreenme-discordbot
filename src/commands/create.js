import Settings from '../settings.js';
import fs from 'fs';
import { prefix } from '../utils.js';
import { MessageEmbed } from 'discord.js';
import devSettings from '../../settings-development.json' assert { type: 'json' };

export const config = {
  name: `create`,
  aliases: [`c`, `make`],
  description: `Creates the handler for a chosen GameEngine. \nFor a list of supported Engines, use \`${prefix}create options\``,
  usage: `${prefix}create [engineName] <@user>`,
  example: `${prefix}create CryEngine`,
};

export const execute = async (DiscordBot, receivedMessage, args) => {
  console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS);
  console.log('received: ', receivedMessage.guild && receivedMessage.guild.id);
  console.log(`args`, args);

  /* TODO:
   *  Description: Due to differences in file systems production(Linux) is case sensitive, while local(Windows) isn't
   *  Task: Make create argument case-insensitive in production(Linux).
   *  Steps:
   *      1. Map handler_templates.filename to handler_templates.filename.toLowerCase()
   *      2. Check if args[0].toLowerCase() matches any handler_templates.filename.toLowerCase()
   *      3. If it matches, find the corresponding case sensitive version, and use that to get the file.
   */
  let userMentioned = receivedMessage.mentions.users.first();

  // NOT valid game engine
  if (!args.length || !getAvailableHandlerTemplates().includes(args[0])) {
    let embed = createAndGetHelpEmbed(DiscordBot);
    receivedMessage.channel.send({
      content: `${
        args.length ? `\`${args.join(' ')}\` is NOT a valid game engine.\n` : ``
      } Please provide a game engine.`,
      embeds: [embed],
    });
    return;
  }

  //normal command
  if (userMentioned) {
    receivedMessage.channel.send({
      content: `<@!${userMentioned.id}> Here's your template file!`,
      files: [`./src/handler_templates/${args[0]}.js`],
    });
  } else {
    receivedMessage.reply({
      content: "Here's your template file!",
      files: [`./src/handler_templates/${args[0]}.js`],
    });
  }
};

function createAndGetHelpEmbed(DiscordBot) {
  const embed = new MessageEmbed();
  const gameEngines = getAvailableHandlerTemplates();
  embed
    .setColor('#3498db')
    .setTitle(`Create Options`)
    .setAuthor({
      name: devSettings.public.productName,
      iconURL: DiscordBot.user.avatarURL,
      URL: devSettings.public.productAddress,
    })
    .setTimestamp()
    .setDescription(`Here are the possible options for the create command`)
    .setFooter({ text: '© SplitScreen.Me', iconURL: DiscordBot.user.avatarURL })
    .addFields({
      name: `Available Game Engines`,
      value: `\`\`\`${gameEngines.join('\n')}\`\`\``,
    });

  return embed;
}

function getAvailableHandlerTemplates() {
  const gameEngines = [];
  const templateFiles = fs
    .readdirSync('./src/handler_templates/')
    .filter((file) => file.endsWith('.js'));
  for (const file of templateFiles) {
    const engineName = file.split('.js')[0];
    gameEngines.push(engineName);
  }
  return gameEngines;
}

// function handlerTemplatePair(inputString) {
//     const gameEngines = getAvailableHandlerTemplates()
//     const handlerTemplatePair = {}
//     const templateFiles = fs.readdirSync('./src/handler_templates/').filter(file => file.endsWith('.js'));
//     for (const file of templateFiles) {
//         const engineName = file.split(".js")[0]
//         if(engineName.toLowerCase() == inputString.toLowerCase()) {
//             handlerTemplatePair.key = inputString
//             handlerTemplatePair.value = engineName
//             break;
//         }
//         return handlerTemplatePair;
//     }
// }
