import Axios from "axios";
import Settings from "../../src/settings"
import fs from "fs";
const { prefix } = require('../../src/utils.js');

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
            let response = []
            response.push("Here are the possible options for the create command")
            response.push(`\`\`\``)
            const templateFiles = fs.readdirSync('./src/handler_templates/').filter(file => file.endsWith('.js'));
            for (const file of templateFiles) {
                const engineName = file.split(".js")[0]
                response.push(engineName)
            }
            response.push(`\`\`\``)
            receivedMessage.channel.send(response);
            return
        }

        //normal command
        receivedMessage.channel.send(`${prefix}create access granted`);
        receivedMessage.channel.send("Testing message.", { files: [`./src/handler_templates/${args}.js`] });
    }
};