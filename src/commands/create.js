import Axios from "axios";
import Settings from "../../src/settings"
const { prefix } = require('../../src/utils.js');

exports.config = {
    name: `create`,
    aliases: [`c`, `make`],
    description: `Creates the handler from the provided information.`,
    usage: `${prefix}create [game name]`,
    example: `${prefix}create Grand Theft Auto V`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    if (Settings.private.DEVELOPMENT_CHANNELS.includes(receivedMessage.guild.id)) {
        console.log("create access granted")
        receivedMessage.channel.send(`${prefix}create access granted`);
    }
};