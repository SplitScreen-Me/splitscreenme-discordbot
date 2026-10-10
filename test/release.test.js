import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as release from '../src/commands/release.js';
import { fakeClient, fakeUser } from './helpers.js';

const LINK = 'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases/latest';

test('answers with the latest Nucleus Co-op release link', async () => {
  const payload = await release.run({ client: fakeClient, options: {} });

  assert.equal(payload.content, LINK);
});

test('pings the requested user along with the link', async () => {
  const payload = await release.run({
    client: fakeClient,
    options: { user: fakeUser },
  });

  assert.equal(
    payload.content,
    `<@${fakeUser.id}>\nHere's a link to the latest Nucleus Co-op version:\n${LINK}`,
  );
  // The bot pings nobody by default (see boot.js): this user must be allowed explicitly.
  assert.deepEqual(payload.allowedMentions, { users: [fakeUser.id], repliedUser: true });
});

test('reads the pinged user from a mention', () => {
  assert.deepEqual(release.fromMessage({ args: [], mentionedUser: fakeUser }), {
    user: fakeUser,
  });
});
