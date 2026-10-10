import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMention } from '../src/mention.js';

const BOT_ID = '660278429941497906';

test('extracts the command name and arguments after a bot mention', () => {
  assert.deepEqual(parseMention(`<@${BOT_ID}> handler Left 4 Dead`, BOT_ID), {
    commandName: 'handler',
    args: ['Left', '4', 'Dead'],
  });
});

test('accepts the nickname mention form and lowercases the command name', () => {
  assert.deepEqual(parseMention(`<@!${BOT_ID}>   H   borderlands `, BOT_ID), {
    commandName: 'h',
    args: ['borderlands'],
  });
});

test('returns an empty command name when the bot is mentioned alone', () => {
  assert.deepEqual(parseMention(`<@${BOT_ID}>`, BOT_ID), {
    commandName: '',
    args: [],
  });
});

test('ignores messages that do not start with a mention of the bot', () => {
  assert.equal(parseMention('-handler borderlands', BOT_ID), null);
  assert.equal(parseMention(`hey <@${BOT_ID}> help`, BOT_ID), null);
  assert.equal(parseMention('<@123456789> help', BOT_ID), null);
  assert.equal(parseMention('', BOT_ID), null);
});
