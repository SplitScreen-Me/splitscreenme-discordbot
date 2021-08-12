import Axios from "axios";
import Settings from "../../src/settings"

module.exports = {
	name: 'create',
	aliases: ['c'],
	description: 'Creates the handler from the provided information. Example: "-create GameName"',
	async execute(receivedMessage, DiscordBot) {
		console.log('settings: ',Settings.private.DEVELOPMENT_CHANNELS)
		console.log('received: ',receivedMessage.guild.id);
		if(Settings.private.DEVELOPMENT_CHANNELS.includes(receivedMessage.guild.id)){
			console.log("access granted")
			receivedMessage.channel.send('-create access granted');
		}
		// 
	}
};