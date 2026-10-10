export const fakeClient = {
  user: {
    id: '660278429941497906',
    username: 'SplitScreen.Me',
    displayAvatarURL: () =>
      'https://cdn.discordapp.com/avatars/660278429941497906/avatar.png',
  },
};

export const fakeUser = { id: '111122223333444455', username: 'someone' };

export const toJSON = (embed) => (embed.toJSON ? embed.toJSON() : embed);

// Every component of a Components V2 message, depth first (sections' accessories included).
export const flattenComponents = (components) =>
  components
    .map(toJSON)
    .flatMap((component) => [
      component,
      ...flattenComponents(component.components ?? []),
      ...(component.accessory ? [component.accessory] : []),
    ]);

export const componentsOfType = (payload, type) =>
  flattenComponents(payload.components).filter((component) => component.type === type);

export const ComponentType = {
  Button: 2,
  StringSelect: 3,
  TextDisplay: 10,
  Thumbnail: 11,
  Container: 17,
};

export const textOf = (payload) =>
  componentsOfType(payload, ComponentType.TextDisplay)
    .map((text) => text.content)
    .join('\n');

// Shape copied from a real https://hub.splitscreen.me/api/v1/handlers/<query> record.
export const handlerRecord = (overrides = {}) => ({
  _id: 'wFsXDjoAkHpL4XZm8',
  owner: 'eeL7HAz8zJovChWw4',
  ownerName: 'Talos91',
  description: 'Guide: ...',
  title: 'Left 4 Dead 2',
  gameName: 'Left 4 Dead 2',
  gameDescription: 'Left 4 Dead 2 is a cooperative first-person shooter...',
  gameCover: 'co1qrl',
  gameId: 124,
  gameUrl: 'https://www.igdb.com/games/left-4-dead-2',
  createdAt: '2019-11-12T20:59:13.910Z',
  updatedAt: '2026-10-10T09:59:27.132Z',
  stars: 39,
  downloadCount: 162133,
  verified: true,
  private: false,
  commentCount: 4,
  currentVersion: 17,
  currentPackage: 'pHuADg4vFfGXMCj2g',
  lastPublicationAt: '2025-03-09T17:35:01.184Z',
  reports: 35,
  maxPlayers: 6,
  playableControllers: true,
  playableMouseKeyboard: true,
  playableMultiMouseKeyboard: true,
  trendScore: 317,
  trendScoreLastUpdate: '2026-10-10T09:42:57.809Z',
  publicAuthorized: true,
  ...overrides,
});

// The Hub API is external: replace fetch with a responder (url => Response) and record the calls.
export const mockFetch = (t, responder) =>
  t.mock.method(globalThis, 'fetch', async (url) => responder(String(url)));

export const jsonResponse = (body) => new Response(JSON.stringify(body));
