import Axios from "axios";
const { prefix } = require('../../src/utils.js');

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

exports.config = {
    name: `handler`,
    aliases: [`h`, `script`],
    description: `Return handler for the specified game.`,
    usage: `${prefix}handler [game name]`,
    example: `${prefix}handler Grand Theft Auto V`
}

exports.execute = async (DiscordBot, receivedMessage, args) => {
    // console.log([...args]);
    if (args.length === 0) {
        receivedMessage.channel.send('Please, provide a game name.');
        return;
    }

    let totalGame = '';
    args.forEach(value => {
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
                fields: [
                    {
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
};