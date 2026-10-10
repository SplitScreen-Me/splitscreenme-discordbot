import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as help from '../src/commands/help.js';
import { loadCommands } from '../src/registry.js';
import { fakeClient, toJSON } from './helpers.js';

const commands = await loadCommands();
const run = (options) => help.run({ client: fakeClient, commands, options });

test('lists every slash command and explains the mention alternative', async () => {
  const embed = toJSON((await run({})).embeds[0]);

  const listed = embed.fields.map((field) => field.value).join('\n');
  for (const name of ['create', 'discord', 'handler', 'help', 'hubstats', 'release']) {
    assert.match(listed, new RegExp(`/${name}\\b`));
  }
  assert.match(embed.description, /@SplitScreen\.Me/);
});

test('details a command found by alias, for both slash and mention usage', async () => {
  const embed = toJSON((await run({ command: 'H' })).embeds[0]);
  const text = JSON.stringify(embed);

  assert.match(embed.description, /`\/handler`/);
  assert.match(text, /`game` \(required\)/);
  assert.match(text, /@SplitScreen\.Me handler \[game name\]/);
  assert.match(text, /script/);
});

test('rejects an unknown command', async () => {
  const payload = await run({ command: 'foo' });

  assert.equal(payload.content, '`foo` is NOT a valid command');
  assert.equal(payload.embeds, undefined);
});

test('suggests commands whose name starts with what was typed', async () => {
  const choices = await help.autocomplete({ name: 'command', value: 'h', commands });

  assert.deepEqual(
    choices.map((choice) => choice.value).sort(),
    ['handler', 'help', 'hubstats'],
  );
});

test('reads the command to describe from a mention', () => {
  assert.deepEqual(help.fromMessage({ args: ['create'] }), { command: 'create' });
});
