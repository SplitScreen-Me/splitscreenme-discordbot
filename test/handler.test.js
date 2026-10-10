import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as handler from '../src/commands/handler.js';
import {
  ComponentType,
  componentsOfType,
  fakeClient,
  handlerRecord,
  jsonResponse,
  mockFetch,
  textOf,
} from './helpers.js';

const HUB = 'https://hub.splitscreen.me/api/v1/';
const IS_COMPONENTS_V2 = 1 << 15;
const GREEN = 0x2ecc71;
const ORANGE = 0xe67e22;

const run = (options) => handler.run({ client: fakeClient, options });
const selectOf = (payload) => componentsOfType(payload, ComponentType.StringSelect)[0];
const buttonsOf = (payload) => componentsOfType(payload, ComponentType.Button);

// The Hub only decodes unreserved escapes: "%3A" finds nothing where ":" works (205 games have one).
test('sends reserved characters of the game name raw to the Hub', async (t) => {
  const fetch = mockFetch(t, () => jsonResponse({}));

  await run({ game: "Kane & Lynch 2: Baldur's +, 100%" });

  assert.equal(
    fetch.mock.calls[0].arguments[0].toString(),
    `${HUB}handlers/Kane%20&%20Lynch%202:%20Baldur's%20+,%20100%25`,
  );
});

test('searches the longest part of a name split by /, ? or #, which cannot be sent', async (t) => {
  const fetch = mockFetch(t, () => jsonResponse({}));

  await run({ game: 'Split/Second' });
  await run({ game: 'RV There Yet?' });

  assert.deepEqual(
    fetch.mock.calls.map((call) => call.arguments[0].toString()),
    [`${HUB}handlers/Second`, `${HUB}handlers/RV%20There%20Yet`],
  );
});

test('answers with a Components V2 card of the handler', async (t) => {
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord()] }));

  const payload = await run({ game: 'left 4 dead 2' });

  assert.equal(payload.flags & IS_COMPONENTS_V2, IS_COMPONENTS_V2);
  assert.equal(payload.content, undefined);
  assert.equal(payload.embeds, undefined);
  assert.equal(componentsOfType(payload, ComponentType.Container).length, 1);
});

test('shows the exact game first, then verified handlers, then the most downloaded', async (t) => {
  mockFetch(t, () =>
    jsonResponse({
      Handlers: [
        handlerRecord({ _id: 'A', gameName: 'Borderlands 2', verified: false, downloadCount: 900 }),
        handlerRecord({ _id: 'B', gameName: 'Borderlands 3', verified: true, downloadCount: 100 }),
        handlerRecord({ _id: 'C', gameName: 'Borderlands', verified: false, downloadCount: 1 }),
        handlerRecord({ _id: 'D', gameName: 'Borderlands 3', verified: true, downloadCount: 500 }),
      ],
    }),
  );

  const payload = await run({ game: 'borderlands' });

  assert.match(textOf(payload), /^## Borderlands$/m);
  assert.deepEqual(
    selectOf(payload).options.map((option) => option.value),
    ['C', 'D', 'B', 'A'],
  );
});

test('describes the handler: author, version, last publication, players, inputs, stats', async (t) => {
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord()] }));

  const text = textOf(await run({ game: 'left 4 dead 2' }));

  assert.match(text, /\[Talos91\]\(https:\/\/hub\.splitscreen\.me\/user\/eeL7HAz8zJovChWw4\)/);
  assert.match(text, /Verified/);
  assert.match(text, /v17/);
  assert.match(text, /<t:1741541701:R>/);
  assert.match(text, /2–6 players/);
  assert.match(text, /Controllers/);
  assert.match(text, /Multiple keyboards & mice/);
  assert.match(text, /162,133 downloads/);
  assert.match(text, /39 hotness/);
  assert.match(text, /4 comments/);
});

test('colors the card green when verified, orange otherwise', async (t) => {
  const card = async (verified) => {
    mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord({ verified })] }));
    const payload = await run({ game: 'left 4 dead 2' });
    t.mock.restoreAll();
    return componentsOfType(payload, ComponentType.Container)[0];
  };

  assert.equal((await card(true)).accent_color, GREEN);
  assert.equal((await card(false)).accent_color, ORANGE);
});

test('shows the game cover when the Hub has one', async (t) => {
  mockFetch(t, () =>
    jsonResponse({ Handlers: [handlerRecord(), handlerRecord({ _id: 'X', gameCover: '' })] }),
  );

  const payload = await run({ game: 'left 4 dead 2' });

  assert.deepEqual(
    componentsOfType(payload, ComponentType.Thumbnail).map((thumbnail) => thumbnail.media.url),
    ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1qrl.jpg'],
  );
});

test('links the download, the Hub page and IGDB with buttons', async (t) => {
  mockFetch(t, () =>
    jsonResponse({
      Handlers: [handlerRecord({ _id: 'ID1', currentPackage: 'PKG1', currentVersion: 3 })],
    }),
  );

  const buttons = buttonsOf(await run({ game: 'left 4 dead 2' }));

  assert.deepEqual(
    buttons.map((button) => button.url),
    [
      'https://hub.splitscreen.me/cdn/storage/packages/PKG1/original/handler-ID1-v3.nc?download=true',
      'https://hub.splitscreen.me/handler/ID1',
      'https://www.igdb.com/games/left-4-dead-2',
    ],
  );
  assert.match(buttons[0].label, /v3/);
});

test('quotes the beginning of the author notes, cut on a line', async (t) => {
  const description = `First line of the guide.\n${'x'.repeat(400)}`;
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord({ description })] }));

  const text = textOf(await run({ game: 'left 4 dead 2' }));

  assert.match(text, /First line of the guide\.…/);
  assert.doesNotMatch(text, /xxxx/);
});

test('cuts long notes on a word when their first line is too long', async (t) => {
  const description = `${'word '.repeat(100)}end`;
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord({ description })] }));

  const text = textOf(await run({ game: 'left 4 dead 2' }));
  const notes = text.split('\n').find((line) => line.includes('word'));

  assert.ok(notes.length <= 310, `notes length ${notes.length}`);
  assert.match(notes, /word…$/);
  assert.doesNotMatch(text, /end/);
});

test('has no notes section when the author wrote none', async (t) => {
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord({ description: '' })] }));

  const payload = await run({ game: 'left 4 dead 2' });

  // Only the header (title + byline, features + stats) remains.
  assert.equal(componentsOfType(payload, ComponentType.TextDisplay).length, 2);
});

test('offers no menu when the Hub found a single handler', async (t) => {
  mockFetch(t, () => jsonResponse({ Handlers: [handlerRecord()] }));

  assert.equal(selectOf(await run({ game: 'left 4 dead 2' })), undefined);
});

test('lists up to 25 results in the menu, within Discord limits', async (t) => {
  mockFetch(t, () =>
    jsonResponse({
      Handlers: Array.from({ length: 30 }, (_, i) =>
        handlerRecord({ _id: `id${i}`, gameName: `${'G'.repeat(120)} ${i}`, ownerName: 'O'.repeat(120) }),
      ),
    }),
  );

  const menu = selectOf(await run({ game: 'g' }));

  assert.equal(menu.custom_id, 'handler:pick');
  assert.equal(menu.options.length, 25);
  for (const option of menu.options) {
    assert.ok(option.label.length <= 100);
    assert.ok(option.description.length <= 100);
  }
  assert.match(menu.placeholder, /30 results/);
});

test('says so when the Hub has no handler for the game', async (t) => {
  // The Hub answers {} (no Handlers key) when nothing matches.
  mockFetch(t, () => jsonResponse({}));

  const payload = await run({ game: 'zzzzqq' });

  assert.equal(payload.content, 'Sorry, no handler found matching your query!');
  assert.equal(payload.components, undefined);
});

test('asks for a game name without querying the Hub when none is given', async (t) => {
  const fetch = mockFetch(t, () => jsonResponse({}));

  const payload = await run({ game: '' });

  assert.equal(payload.content, 'Please provide a game name.');
  assert.equal(fetch.mock.callCount(), 0);
});

test('picking another result shows that handler and keeps the same menu', async (t) => {
  mockFetch(t, () =>
    jsonResponse({
      Handlers: [
        handlerRecord({ _id: 'A', gameName: 'Borderlands' }),
        handlerRecord({ _id: 'B', gameName: 'Borderlands 2' }),
      ],
    }),
  );
  const first = await run({ game: 'borderlands' });
  t.mock.restoreAll();
  const fetch = mockFetch(t, () =>
    jsonResponse({ Handlers: [handlerRecord({ _id: 'B', gameName: 'Borderlands 2' })] }),
  );

  const payload = await handler.select({
    client: fakeClient,
    values: ['B'],
    menu: selectOf(first),
  });

  assert.equal(fetch.mock.calls[0].arguments[0].toString(), `${HUB}handler/B`);
  assert.match(textOf(payload), /^## Borderlands 2$/m);
  assert.deepEqual(selectOf(payload), selectOf(first));
});

test('picking a handler removed from the Hub says so', async (t) => {
  mockFetch(t, () => jsonResponse({}));

  const payload = await handler.select({ client: fakeClient, values: ['gone'], menu: {} });

  assert.equal(payload.content, 'This handler is no longer available on the Hub.');
  assert.equal(payload.components, undefined);
});

test('joins the words typed after a mention into the game name', () => {
  assert.deepEqual(handler.fromMessage({ args: ['Left', '4', 'Dead'] }), {
    game: 'Left 4 Dead',
  });
});

test('suggests each matching game once', async (t) => {
  const fetch = mockFetch(t, () =>
    jsonResponse({
      Handlers: [
        handlerRecord({ _id: 'a', gameName: 'Borderlands 2' }),
        handlerRecord({ _id: 'b', gameName: 'Borderlands 2' }),
        handlerRecord({ _id: 'c', gameName: 'Borderlands 3' }),
      ],
    }),
  );

  const choices = await handler.autocomplete({ name: 'game', value: 'border' });

  assert.equal(fetch.mock.calls[0].arguments[0].toString(), `${HUB}handlers/border`);
  assert.deepEqual(choices, [
    { name: 'Borderlands 2', value: 'Borderlands 2' },
    { name: 'Borderlands 3', value: 'Borderlands 3' },
  ]);
});

test('keeps suggestions within Discord limits (25 choices, 100 chars)', async (t) => {
  const longName = 'A'.repeat(120);
  mockFetch(t, () =>
    jsonResponse({
      Handlers: [
        handlerRecord({ gameName: longName }),
        ...Array.from({ length: 30 }, (_, i) => handlerRecord({ gameName: `Game ${i}` })),
      ],
    }),
  );

  const choices = await handler.autocomplete({ name: 'game', value: 'ga' });

  assert.equal(choices.length, 25);
  assert.equal(choices[0].name.length, 100);
  assert.equal(choices[0].value.length, 100);
});

test('does not query the Hub for suggestions under 2 characters', async (t) => {
  const fetch = mockFetch(t, () => jsonResponse({}));

  assert.deepEqual(await handler.autocomplete({ name: 'game', value: 'b' }), []);
  assert.equal(fetch.mock.callCount(), 0);
});
