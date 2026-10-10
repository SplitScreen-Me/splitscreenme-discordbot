import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as hubstats from '../src/commands/hubstats.js';
import {
  ComponentType,
  componentsOfType,
  fakeClient,
  handlerRecord,
  jsonResponse,
  mockFetch,
  textOf,
} from './helpers.js';

const IS_COMPONENTS_V2 = 1 << 15;
// Real answer of https://hub.splitscreen.me/api/v1/hubstats (note the missing colon on comments).
const STATS =
  'Total downloads: 6076149\nTotal hotness: 5030\nTotal handlers: 890\nTotal users: 3577\nTotal comments 230';

const handlers = [
  handlerRecord({ _id: 'mc', gameName: 'Minecraft', trendScore: 1249, lastPublicationAt: '2025-01-01T00:00:00.000Z' }),
  handlerRecord({ _id: 'bo', gameName: 'Call of Duty: Black Ops II', trendScore: 1163, lastPublicationAt: '2024-01-01T00:00:00.000Z' }),
  handlerRecord({ _id: 'pk', gameName: 'Peak', trendScore: 372, lastPublicationAt: '2026-09-02T16:52:24.736Z' }),
  handlerRecord({ _id: 'er', gameName: 'Elden Ring', trendScore: 351, lastPublicationAt: '2023-01-01T00:00:00.000Z' }),
  handlerRecord({ _id: 'b2', gameName: 'Call of Duty: Black Ops II', trendScore: 347, ownerName: 'Zensuu', lastPublicationAt: '2022-01-01T00:00:00.000Z' }),
  handlerRecord({ _id: 'ds', gameName: 'Dark Souls III', trendScore: 10, lastPublicationAt: '2026-10-04T20:39:24.968Z' }),
  handlerRecord({ _id: 'db', gameName: 'Dragon Ball: Xenoverse 2', trendScore: 5, lastPublicationAt: '2026-09-30T13:51:01.746Z' }),
  handlerRecord({ _id: 'dl', gameName: 'Dying Light: The Beast', trendScore: 1, lastPublicationAt: '2026-08-16T11:24:13.943Z' }),
];

const hubResponder = (stats = STATS) => (url) =>
  url.endsWith('/hubstats') ? new Response(stats) : jsonResponse({ Handlers: handlers });

const run = () => hubstats.run({ client: fakeClient, options: {} });

// Lines of a "### heading" section, up to the next heading.
const linesAfter = (text, heading) =>
  text
    .split(`### ${heading}\n`)[1]
    .split('\n### ')[0]
    .split('\n')
    .filter((line) => line.trim());

test('answers with a Components V2 card', async (t) => {
  mockFetch(t, hubResponder());

  const payload = await run();

  assert.equal(payload.flags & IS_COMPONENTS_V2, IS_COMPONENTS_V2);
  assert.equal(componentsOfType(payload, ComponentType.Container).length, 1);
});

test('shows the Hub totals, formatted', async (t) => {
  mockFetch(t, hubResponder());

  const text = textOf(await run());

  assert.match(text, /890 handlers/);
  assert.match(text, /3,577 users/);
  assert.match(text, /6,076,149 downloads/);
  assert.match(text, /5,030 hotness/);
  assert.match(text, /230 comments/);
});

test('shows the raw stats if the Hub changes their wording', async (t) => {
  mockFetch(t, hubResponder('Something new: 42'));

  assert.match(textOf(await run()), /Something new: 42/);
});

test('lists the 5 trending handlers, linked to the Hub', async (t) => {
  mockFetch(t, hubResponder());

  const trending = linesAfter(textOf(await run()), '🔥 Trending');

  assert.equal(trending.length, 5);
  assert.match(trending[0], /^1\. \*\*\[Minecraft\]\(https:\/\/hub\.splitscreen\.me\/handler\/mc\)\*\*/);
  assert.match(trending[1], /Call of Duty: Black Ops II/);
  assert.match(trending[2], /Peak/);
  assert.match(trending[3], /Elden Ring/);
  assert.match(trending[4], /by Zensuu/);
});

test('lists the 5 latest handler updates, with relative dates', async (t) => {
  mockFetch(t, hubResponder());

  const latest = linesAfter(textOf(await run()), '🆕 Latest updates');

  assert.deepEqual(
    latest.map((line) => line.match(/handler\/(\w+)/)[1]),
    ['ds', 'db', 'pk', 'dl', 'mc'],
  );
  // 2026-10-04T20:39:24.968Z
  assert.match(latest[0], /<t:1791146364:R>/);
});

test('links the Hub and the latest Nucleus Co-op release', async (t) => {
  mockFetch(t, hubResponder());

  const buttons = componentsOfType(await run(), ComponentType.Button);

  assert.deepEqual(
    buttons.map((button) => button.url),
    [
      'https://hub.splitscreen.me/',
      'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases/latest',
    ],
  );
});
