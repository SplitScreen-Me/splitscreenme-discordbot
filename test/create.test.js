import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import * as create from '../src/commands/create.js';
import { fakeClient, fakeUser, toJSON } from './helpers.js';

const run = (options) => create.run({ client: fakeClient, options });

test('attaches the template of the requested engine, whatever its case', async () => {
  const payload = await run({ engine: 'Diesel' });

  assert.equal(payload.content, "Here's your template file!");
  assert.equal(payload.files.length, 1);
  assert.equal(payload.files[0].name, 'diesel.js');
  assert.ok(existsSync(payload.files[0].attachment));
  assert.match(readFileSync(payload.files[0].attachment, 'utf8'), /Game\./);
});

test('pings the requested user along with the template', async () => {
  const payload = await run({ engine: 'unity', user: fakeUser });

  assert.equal(payload.content, `<@${fakeUser.id}> Here's your template file!`);
  assert.equal(payload.files[0].name, 'unity.js');
  // The bot pings nobody by default (see boot.js): this user must be allowed explicitly.
  assert.deepEqual(payload.allowedMentions, { users: [fakeUser.id], repliedUser: true });
});

test('lists the available engines when the engine is unknown', async () => {
  const payload = await run({ engine: 'frostbite' });

  assert.equal(payload.files, undefined);
  assert.match(payload.content, /`frostbite` is NOT a valid game engine/);
  const [field] = toJSON(payload.embeds[0]).fields;
  assert.match(field.value, /unreal_engine_4/);
  assert.match(field.value, /cry_engine/);
});

test('asks for an engine when none is given', async () => {
  const payload = await run({});

  assert.equal(payload.files, undefined);
  assert.match(payload.content, /Please provide a game engine/);
  assert.equal(payload.embeds.length, 1);
});

test('reads the engine and the pinged user from a mention', () => {
  assert.deepEqual(
    create.fromMessage({ args: ['Diesel'], mentionedUser: fakeUser }),
    { engine: 'Diesel', user: fakeUser },
  );
});
