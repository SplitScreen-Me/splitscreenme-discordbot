import Settings from "./src/settings"
import DiscordInit from "./src/boot"

if(Settings.private.DISCORD_BOT_SECRET_TOKEN && Settings.private.DISCORD_BOT_SECRET_TOKEN.length > 0){

DiscordInit(Settings.private.DISCORD_BOT_SECRET_TOKEN);

}else{
  console.log("[Error] No discord bot secret token set. Please, provide one. Aborting.");
}