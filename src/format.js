export const formatNumber = (number = 0) => number.toLocaleString('en-US');

// Discord renders it in each reader's language and time zone, e.g. "6 days ago".
export const relativeTime = (date) =>
  `<t:${Math.floor(Date.parse(date) / 1000)}:R>`;
