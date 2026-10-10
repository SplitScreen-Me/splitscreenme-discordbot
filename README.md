# SplitScreen.Me Discord Bot 🤖
<img src="https://www.splitscreen.me/img/splitscreen-me-logo.png" alt="SplitScreen.Me Logo" width="100" height="100"></img>

![CI/CD](https://github.com/SplitScreen-Me/splitscreenme-discordbot/workflows/CI/badge.svg)
![Swag](https://img.shields.io/badge/SayWhat-BeepBop-green)
![Love](https://img.shields.io/badge/Love-MUCH-ff69b4)

> SplitScreen.Me is an open-source project attempting to make any game playable, in splitscreen mode.

[Visit our website](https://www.splitscreen.me/) - [Join our Discord](https://discord.gg/S5jGb9T)

## About the bot 🤖

The Bot is created using basic EcmaScript (JavaScript) code, interpreted by [NodeJS](https://nodejs.org/), along with the powerful [Discord.js](https://discord.js.org/) module.

Behind the scene, it requests to the [public SplitScreen.Me Hub API](https://github.com/SplitScreen-Me/splitscreenme-hub) using [Axios](https://github.com/axios/axios).

Feel free to **contribute & help** us build the most amazing **bot for splitscreened games** ever !

## How to use 💻

> The bot is public, anyone can invite it to its own Discord server.

Commands are **slash commands**: type `/` in Discord to see them. They can also be called by mentioning the bot, e.g. `@SplitScreen Bot handler Borderlands` (the bot does not need the privileged *Message Content* intent: Discord gives bots the content of messages that mention them).

### Commands
| Slash command                 | Mention usage (`[mandatory] <optional>`) | Aliases                    | Description                                         |
| ----------------------------- | ---------------------------------------- | -------------------------- | --------------------------------------------------- |
| `/help [command]`             | `@bot help <command name>`               | `cmds`, `commands`, `halp` | Shows a list of all available bot commands          |
| `/handler game:`              | `@bot handler [game name]`               | `h`, `script`              | Return handler for the specified game (autocompleted from the Hub) |
| `/create engine: [user:]`     | `@bot create [engine name] <@user>`      | `c`, `make`                | Sends the handler template of a game engine         |
| `/discord`                    | `@bot discord`                           | `d`, `disc`                | Return invite link to the Nucleus Coop Discord      |
| `/hubstats`                   | `@bot hubstats`                          |                            | Return stats from the hub                           |
| `/release [user:]`            | `@bot release <@user>`                   | `r`, `nucleus`             | Return link to the latest Nucleus Co-op release     |

## Building 🚧

### Create and invite  Discord bot/application
To run the bot locally, you need to create a [Discord bot](https://discord.com/developers/applications) through the Discord developer portal, and invite it to your server.
Watch the first 2 minutes of this video, to see how: https://youtu.be/JMmUW4d3Noc

### Adding DISCORD_BOT_SECRET_TOKEN
From the [Discord bot](https://discord.com/developers/applications) you just made, copy the token for your bot into the value field of `DISCORD_BOT_SECRET_TOKEN` in [settings-development.json](settings-development.json). To select which channels you want the bot to access, copy the channel id's into the `DEVELOPMENT_CHANNELS` array, in the same file.

### Running locally
Requires [NodeJS](https://nodejs.org/) 22 or later. Slash commands are registered globally when the bot starts.

**Development:**
```console
yarn install
yarn run start:dev
```
**Tests:**
```console
yarn test
```
**Production:**

```console
yarn install
yarn run start:prod
```

