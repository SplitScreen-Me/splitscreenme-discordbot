import Settings from "../../src/settings"
import fs from "fs";
const { prefix } = require('../../src/utils.js');
const { MessageEmbed } = require('discord.js');
import devSettings from '../../settings-development'

exports.config = {
    name: `create`,
    aliases: [`c`, `make`],
    description: `Creates the handler for a chosen GameEngine. \nFor a list of supported Engines, use \`${prefix}create options\``,
    // parameters: ``, //Parameters. For create command this will be all files in handler_templates
    usage: `${prefix}create [engineName] <@user>`,
    example: `${prefix}create CryEngine`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    console.log(`args`, args)

    let userMentioned = receivedMessage.mentions.users.first()

    if (Settings.private.DEVELOPMENT_CHANNELS.includes(receivedMessage.guild.id)) {

        if(!args.length || !getAvailableHandlerTemplates().includes(args[0].toLowerCase())) {
            let embed = createAndGetHelpEmbed(DiscordBot)
            receivedMessage.reply(`${args.length ? `\`${args.join(" ")}\` is not a valid game engine.\n` : ``}Please provide a game engine.`, embed)
            return
        }
        // help command
        if(args[0] === "options" || args[0] === "help") {
            let embed = createAndGetHelpEmbed(DiscordBot)
            receivedMessage.reply(embed);
            return
        }

        //normal command
        if(userMentioned) {
            receivedMessage.channel.send(`<@!${userMentioned.id}> Here's your template file!`, { files: [`./src/handler_templates/${args[0]}.js`] })
        } else {
            receivedMessage.reply("Here's your template file!", { files: [`./src/handler_templates/${args[0]}.js`] });
        }

    }
};

function createAndGetHelpEmbed(DiscordBot) {
    const embed = new MessageEmbed()
    const gameEngines = getAvailableHandlerTemplates()
    embed.setColor('#3498db')
        .setTitle('Create Options')
        .setAuthor(devSettings.public.productName, DiscordBot.user.avatarURL, devSettings.public.productAddress)
        .setTimestamp()
        .setDescription("Here are the possible options for the create command")
        .setFooter('© SplitScreen.Me', DiscordBot.user.avatarURL)
        .addFields({name: `Available Game Engines`, value: `\`\`\`${gameEngines.join("\n")}\`\`\``});

    return embed
}

function getAvailableHandlerTemplates() {
    const gameEngines = []
    const templateFiles = fs.readdirSync('./src/handler_templates/').filter(file => file.endsWith('.js'));
    console.log(templateFiles)
    for (const file of templateFiles) {
        const engineName = file.split(".js")[0]
        gameEngines.push(engineName.toLowerCase())
    }
    return gameEngines
}