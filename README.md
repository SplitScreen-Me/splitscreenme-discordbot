# SplitScreen.Me Discord Bot 🤖
<img src="https://www.splitscreen.me/img/splitscreen-me-logo.png" alt="SplitScreen.Me Logo" width="100" height="100"></img>

![CI/CD](https://github.com/SplitScreen-Me/splitscreenme-discordbot/workflows/CI/badge.svg)
![Swag](https://img.shields.io/badge/SayWhat-BeepBop-green)
![Love](https://img.shields.io/badge/Love-MUCH-ff69b4)

> SplitScreen.Me is an open-source project attempting to make any game playable, in splitscreen mode.

[Visit our website](https://www.splitscreen.me/) - [Join our Discord](https://discord.gg/S5jGb9T)

## About the bot 🤖

The Bot is created using basic EcmaScript (JavaScript) code, interpreted by [NodeJS](https://nodejs.org/) and the [ESM](https://github.com/standard-things/esm) module, along with the powerful [Discord.js](https://discord.js.org/) module.

Behind the scene, it requests to the [public SplitScreen.Me Hub API](https://github.com/SplitScreen-Me/splitscreenme-hub) using [Axios](https://github.com/axios/axios).

Feel free to **contribute & help** us build the most amazing **bot for splitscreened games** ever !

## How to use 💻

> The bot is public, anyone can invite it to its own Discord server.

### Parameter types
| Available parameter types | Explanation        |
| ------------------------- | ------------------ |
| < >                       | Optional parameter |
| [ ]                       | Required parameter |

### Commands
| Command name  | Aliases                            | Usage                                         | Example Usage                                                            |
| ------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| help          | `cmds`, `commands`, `halp`         | ${prefix}help {command_name}                  | Shows a list of all available bot commands                               |
| handler       | `h`, `script`                      | ${prefix}handler Borderlands                  | Return handler for the specified game.                                   |
| create        | `c`, `make`                        | ${prefix}create [engineName] <@user>          | Creates the handler for a chosen GameEngine. For a list of supported Engines, use ${prefix}create options |
| discord       | `d`, `disc`                        | ${prefix}discord                              | Return invite link to the Nucleus Coop Discord                           |
| hubstats      |                                    | ${prefix}hubstats                             | Return stats from the hub                                                |

### Examples
| Commmand            | Screenshot                                                                                                                |
| --------------------| ------------------------------------------------------------------------------------------------------------------------- |
| -help               | ![-help](https://user-images.githubusercontent.com/43886029/134237392-205043e3-0619-4852-99c9-0cfbcba177b5.png)           |
| -h left 4 dead      | ![-h left 4 dead](https://user-images.githubusercontent.com/43886029/134236654-dd8e888c-9b16-481e-ba41-3cc62e18f949.png)  |
| -c diesel           | ![-c diesel](https://user-images.githubusercontent.com/43886029/134236614-02f5386e-831a-4d60-84bd-35680d7a675c.png)       |
| -d                  | ![-d](https://user-images.githubusercontent.com/43886029/134236851-d11db3dc-8853-4f32-9c3a-e0d10d084e6c.png)              |
| -hubstats           | ![-hubstats](https://user-images.githubusercontent.com/43886029/134237049-0c361f13-f69d-40c9-8f5e-f1cb9c0ebb8f.png)       |
