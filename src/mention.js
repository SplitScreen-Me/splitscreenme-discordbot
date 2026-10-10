// Discord only gives the bot the content of messages that mention it (no Message Content intent),
// so "@SplitScreen.Me <command> [args]" is the only text-based way to call a command.
export const parseMention = (content, botId) => {
  const match = content.match(new RegExp(`^<@!?${botId}>(.*)$`, 's'));
  if (!match) return null;

  const [commandName = '', ...args] = match[1].trim().split(/\s+/).filter(Boolean);
  return { commandName: commandName.toLowerCase(), args };
};
