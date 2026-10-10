import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCommand, loadCommands } from '../src/registry.js';

test('loads every command, keyed by its name', async () => {
  const commands = await loadCommands();

  assert.deepEqual(
    [...commands.keys()].sort(),
    ['create', 'discord', 'handler', 'help', 'hubstats', 'release'],
  );
});

test('every command registers a valid slash command under its own name', async () => {
  const commands = await loadCommands();

  for (const [name, command] of commands) {
    const definition = command.data.toJSON(); // throws if Discord would reject it
    assert.equal(definition.name, name);
    assert.equal(typeof command.run, 'function', `${name}.run`);
    assert.equal(typeof command.fromMessage, 'function', `${name}.fromMessage`);
    if (definition.options?.some((option) => option.autocomplete)) {
      assert.equal(typeof command.autocomplete, 'function', `${name}.autocomplete`);
    }
  }
});

test('finds a command by name or alias', async () => {
  const commands = await loadCommands();

  assert.equal(findCommand(commands, 'handler').config.name, 'handler');
  assert.equal(findCommand(commands, 'h').config.name, 'handler');
  assert.equal(findCommand(commands, 'make').config.name, 'create');
  assert.equal(findCommand(commands, 'nope'), undefined);
});
