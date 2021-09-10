import Axios from "axios";
import Settings from "../../src/settings"
const { prefix } = require('../../src/utils.js');

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

exports.config = {
    name: `hubstats`,
    aliases: [],
    description: `Return stats from the hub`,
    usage: `${prefix}hubstats`,
    example: `${prefix}hubstats`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    console.log(`args`, args)

    const totalDownloadCountEver = await Axios.get(publicSSMApiPath + 'totalDownloadCountEver');
    console.log('settings: ', Settings.private.DEVELOPMENT_CHANNELS)
    console.log('received: ', receivedMessage.guild.id);
    if (Settings.private.DEVELOPMENT_CHANNELS.includes(receivedMessage.guild.id)) {
        console.log("hubstats access granted")
        receivedMessage.channel.send(`${totalDownloadCountEver.data}`);
    }
};