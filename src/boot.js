import Discord from "discord.js";
import Axios from "axios";
import fs from "fs";

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";
const botPrefix = "-";
const DiscordInit = secretDiscordToken => {

  const DiscordBot = new Discord.Client();

  DiscordBot.commands = new Discord.Collection();

  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  let availableCMDs = [];
  for (const file of commandFiles) {
    availableCMDs.push(file.replace('.js',''));
    const command = require(`./commands/${file}`);
    DiscordBot.commands.set(command.name, command);
  }

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
    } catch (e) {
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

  DiscordBot.on('message', async receivedMessage => {
    if (receivedMessage.author.bot) return; //Will ignore bots and it-self
    if (!receivedMessage.content.startsWith(botPrefix)) return; //Ignore messages from users which not start with {botPrefix}
    const fullCommand = receivedMessage.content.substr(1); // Remove the leading {botPrefix}
    const splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
    const commandName = splitCommand[0].toLowerCase(); // The first word directly after the {botPrefix} is the command
    if (availableCMDs.includes(commandName)){
      const command = DiscordBot.commands.get(commandName);
      try {
        
        command.execute(receivedMessage,DiscordBot);
      } catch (error) {
        console.error(error);
      }
    } else {
      return; //Ignore CMDs which are not imported
    }
  });

};

export default DiscordInit;