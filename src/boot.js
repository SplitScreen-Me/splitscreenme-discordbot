import Discord from "discord.js";
import Axios from "axios";

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";

const DiscordInit = secretDiscordToken => {

  const DiscordBot = new Discord.Client();
  DiscordBot.on('ready', async () => {
    console.log('[Debug] Connected as ' + DiscordBot.user.tag);
    console.log('[Debug] Servers:');
    DiscordBot.guilds.forEach(guild => {
      console.log('[Debug]  - ' + guild.name);
    });
    console.log(
      `[Debug] Bot has started, with ${DiscordBot.users.size} user(s), in ${DiscordBot.channels.size} channel(s) of ${DiscordBot.guilds.size} server(s).`,
    );
    try {
      const allHandlers = await Axios.get(publicSSMApiPath + 'allhandlers');
      const totalHandlers = allHandlers.data.Handlers.length;

      await DiscordBot.user.setActivity('Hosting ' + totalHandlers + ' handlers!');

      setInterval(async () => {
        const allHandlers = await Axios.get(publicSSMApiPath + 'allhandlers');
        const totalHandlers = allHandlers.data.Handlers.length;
        await DiscordBot.user.setActivity('Hosting ' + totalHandlers + ' handlers!');
      }, 60000);
    }catch(e){
      console.log("error", e)
    }
  });

  DiscordBot.on('guildCreate', guild => {
    // This event triggers when the bot joins a guild.
    console.log(
      `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`,
    );
  });

  DiscordBot.on('guildDelete', guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });

  DiscordBot.login(secretDiscordToken);

  const DiscordBotCmd = {
    sendEverywhere: message => {
      let guildList = DiscordBot.guilds.array();
      guildList.forEach(guild => {
        try {
          let channelID;
          let channels = guild.channels;
          channelLoop: for (let c of channels) {
            let channelType = c[1].type;
            if (channelType === 'text') {
              channelID = c[0];
              break channelLoop;
            }
          }

          let channel = DiscordBot.channels.get(guild.systemChannelID || channelID);
          channel.send(message);
        } catch (err) {
          console.log('Could not send message to ' + guild.name);
        }
      });
    },
    setActivity: description => {
      DiscordBot.user.setActivity(description);
    },
  };

  DiscordBot.on('message', async receivedMessage => {
    if (receivedMessage.author == DiscordBot.user) {
      // Prevent bot from responding to its own messages
      return;
    }

    if (receivedMessage.content.startsWith('-')) {
      await processCommand(receivedMessage);
    }
  });

  async function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
    let argume = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

    if (primaryCommand === 'handler') {
      await handlerCommand(argume, receivedMessage);
    } else {
      receivedMessage.channel.send("I don't understand the command. Try `-handler [game name]`");
    }
  }

  async function handlerCommand(argume, receivedMessage) {
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
    const foundHandlers = allHandlers.data.Handlers.length > 3 ? allHandlers.data.Handlers.slice(0, 3)  : allHandlers.data.Handlers;
    if (!foundHandlers || foundHandlers.length === 0) {
      receivedMessage.channel.send('Sorry, no handler found matching your query!');
    } else {
      foundHandlers.forEach(handler => {
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
                value: handler.ownerName,
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
  }
};

export default DiscordInit;