import Axios from "axios";
import Settings from "../../src/settings"
const { prefix } = require('../../src/utils.js');

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

exports.config = {
    name: `invite`,
    aliases: ["i", "inv"],
    description: `Return invite link to the Nucleus Coop Discord`,
    usage: `${prefix}invite`,
    example: `${prefix}invite`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    console.log(`args`, args)

    receivedMessage.reply("\nhttps://discord.gg/a9ssM5pxTW")
};