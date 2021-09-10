import Axios from "axios";
import Settings from "../../src/settings"
import fs from "fs";
const { prefix } = require('../../src/utils.js');
const { MessageEmbed } = require('discord.js');
import devSettings from '../../settings-development'

exports.config = {
    name: `create`,
    aliases: [`c`, `make`],
    description: `Creates the handler for a chosen GameEngine. \nFor a list of supported Engines, use \`${prefix}create options\``,
    usage: `${prefix}create [engineName]`,
    example: `${prefix}create CryEngine`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    console.log(`args`, args)

    if (Settings.private.DEVELOPMENT_CHANNELS.includes(receivedMessage.guild.id)) {

        // help command
        if(args[0] === "options" || args[0] === "help") {
            const embed = new MessageEmbed()
            const gameEngines = []
            const templateFiles = fs.readdirSync('./src/handler_templates/').filter(file => file.endsWith('.js'));
            for (const file of templateFiles) {
                const engineName = file.split(".js")[0]
                gameEngines.push(engineName)
            }
            embed.setColor('#3498db')
                .setTitle('Create Options')
                .setAuthor(devSettings.public.productName, DiscordBot.user.avatarURL, devSettings.public.productAddress)
                .setTimestamp()
                .setDescription("Here are the possible options for the create command")
                .setFooter('© SplitScreen.Me', DiscordBot.user.avatarURL)
                .addFields({name: `Available Game Engines`, value: `\`\`\`${gameEngines.join("\n")}\`\`\``});


            receivedMessage.channel.send(embed);
            return
        }

        //normal command
        receivedMessage.reply("Here's your template file!", { files: [`./src/handler_templates/${args}.js`] });
    }
};