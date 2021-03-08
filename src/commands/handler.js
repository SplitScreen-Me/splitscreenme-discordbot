import Axios from "axios";
const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

module.exports = {
	name: 'handler',
	description: 'Return handler for the specified game. Example: "-handler Game name"',
	async execute(receivedMessage, DiscordBot) {
		let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
		let splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
		let argume = splitCommand.slice(1);
		// console.log(argume);olafsbestfriend123
		if (argume.length === 0) {
			receivedMessage.channel.send('Please, provide a game name.');
			return;
		}

		let totalGame = '';
		argume.forEach(value => {
			totalGame = totalGame + ' ' + value;
		});
		totalGame = totalGame.substr(1);
		const allHandlers = await Axios.get(publicSSMApiPath + 'handlers/' + totalGame.replace(/[^a-z0-9 -]/g, ""));
		if (!allHandlers.data.Handlers) {
			receivedMessage.channel.send('Sorry, no handler found matching your query!');
			return;
		}
		const foundHandlers = allHandlers.data.Handlers.length > 3 ? allHandlers.data.Handlers.slice(0, 3) : allHandlers.data.Handlers;
    		var downloadLink = " ";
		foundHandlers.forEach(handler => {
     			downloadLink = `https://hub.splitscreen.me/cdn/storage/packages/${handler.currentPackage}/original/handler-${handler._id}-v${handler.currentVersion}.nc?download=true`
			receivedMessage.channel.send({
				embed: {
					color: 3447003,
					author: {
						name: DiscordBot.user.username,
						icon_url: DiscordBot.user.avatarURL,
					},
					title: handler.gameName,
					url: `https://hub.splitscreen.me/handler/${handler._id}`,
					thumbnail: {
						url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${handler.gameCover}.jpg`,
					},
					fields: [{
							name: 'Author',
							inline: true,
							value: `[${handler.ownerName}](https://hub.splitscreen.me/user/${handler.owner})`
						},
						{
							name: 'Hotness',
							inline: true,
							value: handler.stars,
						},
						{
							name: 'Total downloads',
							inline: true,
							value: handler.downloadCount,
						},
						{
							name: 'Status',
							inline: true,
							value: handler.verified ? 'Verified' : 'Unverified',
						},
            					{
              						name: `Download`,
             						inline: false,
					   		value: `[Download Handler (v${handler.currentVersion})](${downloadLink})`,
				  		},
					],
					timestamp: new Date(),
					footer: {
						icon_url: DiscordBot.user.avatarURL,
						text: '© SplitScreen.Me',
					},
				},
			});
		});
	}
};
