import Axios from "axios";
import Settings from "../settings";
const { prefix } = require('../../src/utils.js');

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

exports.config = {
    name: `help`,
    aliases: [`commands`, `commandlist`],
    description: `Shows a list of all available bot commands`,
    usage: `${prefix}help [command_name]`,
    example: `${prefix}help handler`
}
exports.execute = async (DiscordBot, receivedMessage, args) => {
    const data = [];
    const {commands} = receivedMessage.client;
    console.log("args" + args)
    if (!args.length) {
        console.log("we got this far");
        data.push("Here is a list of all my commands");
        data.push( prefix + commands.map(c => ` ${c.config.name} \`${c.config.aliases.join(` , `)}\``).join(`\n-`));
        data.push(`\n use ${prefix}help [command name] to get info about a specific command`);
        receivedMessage.channel.send(data);
        return;
    }

    const name = args[0];
    const cmd = commands.get(name) || commands.find(c => c.config.aliases && c.config.aliases.includes(name));

    if (!cmd) {
        receivedMessage.reply(`${name} is not a valid command`)
        return;
    }


    if (cmd.config.name) data.push(`**Name**: ${cmd.config.name}`);
    if (cmd.config.description) data.push(`**Description:** ${cmd.config.description}`);
    if (cmd.config.aliases) data.push(`**Aliases:** ${cmd.config.aliases.join(` , `)}`);
    if (cmd.config.usage) data.push(`**Usage:** ${cmd.config.usage}`);
    if (cmd.config.example) data.push(`**Example:** ${cmd.config.example}`);

    receivedMessage.channel.send(data);

    /*receivedMessage.channel.send({

        embed: {
            color: 3447003,
            author: {
                name: DiscordBot.user.username,
                icon_url: DiscordBot.user.avatarURL,
            },
            title: "Commandlist",
            thumbnail: {
                url: `https://images.igdb.com/igdb/image/upload/t_cover_big/.jpg`,
            },
            fields: [{
                name: DiscordBot.commands.name,
                inline: true,
                value: `[](https://hub.splitscreen.me/user/)`
            },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: DiscordBot.user.avatarURL,
                text: '© SplitScreen.Me',
            },
        },
    });*/
};