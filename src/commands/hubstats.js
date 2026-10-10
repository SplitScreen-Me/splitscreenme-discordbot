import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SlashCommandBuilder,
  TextDisplayBuilder,
  escapeMarkdown,
} from 'discord.js';
import { formatNumber, relativeTime } from '../format.js';
import { HUB_URL, getAllHandlers, getHubStats, handlerPageUrl } from '../hub.js';

const NUCLEUS_RELEASE_URL =
  'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases/latest';
const LIST_LENGTH = 5;
const TOTALS = [
  ['handlers', '🎮'],
  ['users', '👥'],
  ['downloads', '⬇️'],
  ['hotness', '🔥'],
  ['comments', '💬'],
];

export const config = {
  name: `hubstats`,
  aliases: [],
  description: `Return stats from the hub`,
  usage: ``,
  example: ``,
};

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description);

export const fromMessage = () => ({});

// "Total downloads: 6076149\n...\nTotal comments 230" -> { downloads: 6076149, ..., comments: 230 }
const parseStats = (text) =>
  Object.fromEntries(
    [...text.matchAll(/Total (\w+):?\s*(\d+)/g)].map(([, name, value]) => [
      name.toLowerCase(),
      Number(value),
    ]),
  );

const totals = (statsText) => {
  const stats = parseStats(statsText);
  const known = TOTALS.filter(([name]) => name in stats);
  if (!known.length) return statsText;
  return known
    .map(([name, emoji]) => `${emoji} ${formatNumber(stats[name])} ${name}`)
    .join(' · ');
};

const top = (handlers, score) =>
  [...handlers].sort((a, b) => score(b) - score(a)).slice(0, LIST_LENGTH);

const link = (handler) =>
  `[${escapeMarkdown(handler.gameName)}](${handlerPageUrl(handler)})`;

const published = (handler) => handler.lastPublicationAt ?? handler.createdAt;

export const run = async () => {
  const [statsText, handlers] = await Promise.all([
    getHubStats(),
    getAllHandlers(),
  ]);

  const trending = top(handlers, (handler) => handler.trendScore ?? 0).map(
    (handler, index) =>
      `${index + 1}. **${link(handler)}** — by ${escapeMarkdown(handler.ownerName)} · ⬇️ ${formatNumber(handler.downloadCount)}`,
  );
  const latest = top(handlers, (handler) => Date.parse(published(handler)) || 0).map(
    (handler) =>
      `- ${link(handler)} — v${handler.currentVersion} · ${relativeTime(published(handler))}`,
  );

  const container = new ContainerBuilder()
    .setAccentColor(0x3498db)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## 📊 SplitScreen.Me Hub\n${totals(statsText)}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`### 🔥 Trending\n${trending.join('\n')}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`### 🆕 Latest updates\n${latest.join('\n')}`),
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Browse the Hub')
          .setEmoji('🌐')
          .setURL(HUB_URL),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Get Nucleus Co-op')
          .setEmoji('⬇️')
          .setURL(NUCLEUS_RELEASE_URL),
      ),
    );

  return { components: [container], flags: MessageFlags.IsComponentsV2 };
};
