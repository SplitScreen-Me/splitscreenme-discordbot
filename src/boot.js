import Discord from "discord.js";
import Axios from "axios";
import fs from "fs";
const { prefix } = require('../src/utils.js');
const { MessageEmbed } = require('discord.js');
import devSettings from '../settings-development';

const publicSSMApiPath = "https://hub.splitscreen.me/api/v1/";
let botPrefix = prefix;
const DiscordInit = secretDiscordToken => {

    const DiscordBot = new Discord.Client();

    DiscordBot.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        const commandName = file.split('.')[0];
        console.log(commandName);

        DiscordBot.commands.set(commandName, command);
    }

    DiscordBot.on('ready', async () => {
        console.log("botPrefix = " + botPrefix);
        console.log('[Debug] Connected as ' + DiscordBot.user.tag);
        console.log('[Debug] Servers:');

        DiscordBot.guilds.cache.forEach((guild) => {
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
        let mentionRegex = receivedMessage.content.match(new RegExp(`^<@!?(${DiscordBot.user.id})>`, "gi"))
        if(mentionRegex) {
            botPrefix = `${mentionRegex}`
        } else {
            botPrefix = prefix
        }
        console.log("botPrefix = " + botPrefix);

        if (receivedMessage.author.bot) return; //Will ignore bots and it-self
        if (!receivedMessage.content.startsWith(botPrefix)) return; //Ignore messages from users which not start with {botPrefix}
        const fullCommand = receivedMessage.content.substr(botPrefix.length); // Remove the leading {botPrefix}
        const splitCommand = fullCommand.trim().split(' '); // Split the message up in to pieces for each space
        const args = splitCommand.slice(1); //arguments
        const commandName = splitCommand[0].toLowerCase(); // The first word directly after the {botPrefix} is the command or alias
        const command = //get the command based on a command or alias
            DiscordBot.commands.get(commandName) || DiscordBot.commands.find(cmd => cmd.config.aliases && cmd.config.aliases.includes(commandName));

        console.log(`args => ${args}`);
        console.log(`botPrefix.length => ${botPrefix.length}`);
        console.log(`commandName => ${commandName}`);
        console.log(`command => ${command}`);

        if (command) {
            console.log("command recognized");
            try {

                command.execute(DiscordBot, receivedMessage, args);
            } catch (error) {
                console.error(error);
            }
        } else if(botPrefix !== prefix && !command && !fullCommand.length) {
            const embed = new MessageEmbed()
            embed.setColor('#3498db')
                .setTitle(`Hello! I am the bot for Splitscreen.me!`)
                .setURL('https://splitscreen.me/')
                .setAuthor(devSettings.public.productName, DiscordBot.user.avatarURL, devSettings.public.productAddress)
                .setTimestamp()
                .setFooter('© SplitScreen.Me', DiscordBot.user.avatarURL)
                .setDescription(`I connect with Splitscreen.me to get you data for handles, statistics, and answer questions you may have! If you would like you see a list of my commands, please do \`${prefix}help\``)
            receivedMessage.channel.send(embed)
        } else if(!command && fullCommand.length > 0 && fullCommand.charAt(0) !== ' ') {
            console.log("Command NOT recognized");
            receivedMessage.channel.send(`Command NOT recognized, use \`${prefix}help\` to see all available commands`)
        } else {
            console.log("Command either has length 0, or is an empty string"); //Ignore CMDs which are not imported
        }
    });

};

export default DiscordInit;