export const HUB_URL = 'https://hub.splitscreen.me/';
const HUB_API = new URL('api/v1/', HUB_URL);

export const handlerPageUrl = (handler) => new URL(`handler/${handler._id}`, HUB_URL).href;

const get = async (path, timeout = 10_000) => {
  const response = await fetch(new URL(path, HUB_API), {
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) {
    throw new Error(`Hub API ${path} answered ${response.status}`);
  }
  return response;
};

// The Hub only decodes unreserved escapes (like decodeURI): reserved characters such as ":" or "&"
// must stay raw, and "/", "?", "#" cannot be sent at all, so search the longest part around them.
const toSearchPath = (query) =>
  encodeURI(
    query
      .split(/[/?#]/)
      .reduce((longest, part) => (part.length > longest.length ? part : longest), ''),
  );

// The Hub answers {} instead of { Handlers: [] } when nothing matches.
export const searchHandlers = async (query, { timeout } = {}) =>
  (await (await get(`handlers/${toSearchPath(query)}`, timeout)).json())
    .Handlers ?? [];

export const getHandler = async (id, { timeout } = {}) =>
  (await (await get(`handler/${encodeURIComponent(id)}`, timeout)).json())
    .Handlers?.[0];

export const getAllHandlers = async () =>
  (await (await get('allhandlers')).json()).Handlers ?? [];

export const getHubStats = async () => (await get('hubstats')).text();
