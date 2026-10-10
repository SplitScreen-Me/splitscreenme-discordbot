import { readdirSync } from 'node:fs';

const commandsDir = new URL('./commands/', import.meta.url);

// Every file of src/commands is a command module exporting:
// config, data (slash definition), fromMessage (mention args -> options), run, and optionally autocomplete.
export const loadCommands = async () => {
  const commands = new Map();
  const files = readdirSync(commandsDir).filter((file) => file.endsWith('.js'));
  for (const file of files) {
    const command = await import(new URL(file, commandsDir));
    commands.set(command.config.name, command);
  }
  return commands;
};

export const findCommand = (commands, name) =>
  commands.get(name) ??
  [...commands.values()].find((command) => command.config.aliases.includes(name));
