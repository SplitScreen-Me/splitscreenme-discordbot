import Settings from './src/settings.js';
import DiscordInit from './src/boot.js';

if (
  Settings.private.DISCORD_BOT_SECRET_TOKEN &&
  Settings.private.DISCORD_BOT_SECRET_TOKEN.length > 0
) {
  DiscordInit(Settings.private.DISCORD_BOT_SECRET_TOKEN);
} else {
  console.log(
    '[Error] No discord bot secret token set. Please provide one. Aborting.',
  );
}
