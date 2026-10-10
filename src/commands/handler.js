import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  escapeMarkdown,
} from 'discord.js';
import { formatNumber, relativeTime } from '../format.js';
import { HUB_URL, getHandler, handlerPageUrl, searchHandlers } from '../hub.js';

const VERIFIED_COLOR = 0x2ecc71;
const UNVERIFIED_COLOR = 0xe67e22;
const NOTES_LENGTH = 300;
// Discord limits: 25 choices/options, 100 characters per choice and option text, 150 per placeholder,
// and 3s to answer an autocomplete or a component interaction.
const MAX_CHOICES = 25;
const MAX_CHOICE_LENGTH = 100;
const MAX_PLACEHOLDER_LENGTH = 150;
const QUICK_ANSWER_TIMEOUT = 2_500;

export const config = {
  name: `handler`,
  aliases: [`h`, `script`],
  description: `Return handler for the specified game.`,
  usage: `[game name]`,
  example: `Borderlands`,
};

const PICK_ID = `${config.name}:pick`;

export const data = new SlashCommandBuilder()
  .setName(config.name)
  .setDescription(config.description)
  .addStringOption((option) =>
    option
      .setName('game')
      .setDescription('Name of the game')
      .setRequired(true)
      .setAutocomplete(true),
  );

export const fromMessage = ({ args }) => ({ game: args.join(' ') });

export const autocomplete = async ({ value }) => {
  const query = value.trim();
  if (query.length < 2) return [];

  const handlers = await searchHandlers(query, { timeout: QUICK_ANSWER_TIMEOUT });
  return [...new Set(handlers.map((handler) => handler.gameName))]
    .slice(0, MAX_CHOICES)
    .map((gameName) => {
      const choice = gameName.slice(0, MAX_CHOICE_LENGTH);
      return { name: choice, value: choice };
    });
};

export const run = async ({ options: { game } }) => {
  const query = game?.trim();
  if (!query) return { content: 'Please provide a game name.' };

  const handlers = await searchHandlers(query);
  if (!handlers.length) {
    return { content: 'Sorry, no handler found matching your query!' };
  }

  const ranked = rank(handlers, query);
  return handlerMessage(
    ranked[0],
    ranked.length > 1 ? resultsMenu(ranked, query) : undefined,
  );
};

// A result picked in the menu: show it, with the same menu to keep browsing.
export const select = async ({ values: [id], menu }) => {
  const handler = await getHandler(id, { timeout: QUICK_ANSWER_TIMEOUT });
  if (!handler) {
    return { content: 'This handler is no longer available on the Hub.' };
  }
  return handlerMessage(handler, menu);
};

// The Hub returns every game containing the query: exact game first, then verified, then popular.
const rank = (handlers, query) => {
  const isExact = (handler) =>
    handler.gameName.toLowerCase() === query.toLowerCase();
  return [...handlers].sort(
    (a, b) =>
      isExact(b) - isExact(a) ||
      b.verified - a.verified ||
      b.downloadCount - a.downloadCount,
  );
};

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

const resultsMenu = (handlers, query) =>
  new StringSelectMenuBuilder()
    .setCustomId(PICK_ID)
    .setPlaceholder(
      truncate(
        `🔎 ${handlers.length} results for "${query}" — pick another handler`,
        MAX_PLACEHOLDER_LENGTH,
      ),
    )
    .addOptions(
      handlers.slice(0, MAX_CHOICES).map((handler) => ({
        label: truncate(handler.gameName, MAX_CHOICE_LENGTH),
        description: truncate(
          `by ${handler.ownerName} · ${handler.verified ? '✅ Verified' : 'Unverified'} · ⬇️ ${formatNumber(handler.downloadCount)}`,
          MAX_CHOICE_LENGTH,
        ),
        value: handler._id,
      })),
    )
    .toJSON();

const byline = (handler) => {
  const published =
    handler.lastPublicationAt ?? handler.createdAt;
  return [
    `by [${escapeMarkdown(handler.ownerName)}](${HUB_URL}user/${handler.owner})`,
    handler.verified ? '✅ Verified' : '⚠️ Unverified',
    `v${handler.currentVersion}`,
    ...(published
      ? [`updated ${relativeTime(published)}`]
      : []),
  ].join(' · ');
};

const features = (handler) =>
  [
    handler.maxPlayers >= 2 &&
      `👥 ${handler.maxPlayers > 2 ? `2–${handler.maxPlayers}` : '2'} players`,
    handler.playableControllers && '🎮 Controllers',
    handler.playableMultiMouseKeyboard
      ? '⌨️ Multiple keyboards & mice'
      : handler.playableMouseKeyboard && '⌨️ Keyboard & mouse',
  ]
    .filter(Boolean)
    .join(' · ');

const stats = (handler) =>
  `🔥 ${formatNumber(handler.stars)} hotness · ⬇️ ${formatNumber(handler.downloadCount)} downloads · 💬 ${formatNumber(handler.commentCount)} comments`;

// Beginning of the author notes (often a guide link): whole lines when possible, else whole words.
const notes = (description) => {
  const text = (description ?? '').trim();
  if (text.length <= NOTES_LENGTH) return text;

  let kept = '';
  for (const line of text.split('\n')) {
    const next = kept ? `${kept}\n${line}` : line;
    if (next.length > NOTES_LENGTH) break;
    kept = next;
  }
  if (!kept) {
    const cut = text.slice(0, NOTES_LENGTH);
    kept = cut.slice(0, cut.lastIndexOf(' ')) || cut;
  }
  return `${kept.trimEnd()}…`;
};

const linkButton = (label, emoji, url) =>
  new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel(label)
    .setEmoji(emoji)
    .setURL(url);

const handlerMessage = (handler, menu) => {
  const container = new ContainerBuilder().setAccentColor(
    handler.verified ? VERIFIED_COLOR : UNVERIFIED_COLOR,
  );

  const header = [
    `## ${escapeMarkdown(handler.gameName)}\n${byline(handler)}`,
    [features(handler), stats(handler)].filter(Boolean).join('\n'),
  ].map((content) => new TextDisplayBuilder().setContent(content));
  if (handler.gameCover) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(...header)
        .setThumbnailAccessory(
          new ThumbnailBuilder()
            .setURL(
              `https://images.igdb.com/igdb/image/upload/t_cover_big/${handler.gameCover}.jpg`,
            )
            .setDescription(handler.gameName),
        ),
    );
  } else {
    container.addTextDisplayComponents(...header);
  }

  const excerpt = notes(handler.description);
  if (excerpt) {
    container
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`>>> ${excerpt}`));
  }

  container.addSeparatorComponents(new SeparatorBuilder()).addActionRowComponents(
    new ActionRowBuilder().addComponents(
      linkButton(
        `Download v${handler.currentVersion}`,
        '⬇️',
        `${HUB_URL}cdn/storage/packages/${handler.currentPackage}/original/handler-${handler._id}-v${handler.currentVersion}.nc?download=true`,
      ),
      linkButton('View on Hub', '🌐', handlerPageUrl(handler)),
      ...(/^https?:\/\//.test(handler.gameUrl ?? '')
        ? [linkButton('IGDB', '🎮', handler.gameUrl)]
        : []),
    ),
  );

  if (menu) {
    container.addActionRowComponents(
      new ActionRowBuilder().addComponents(new StringSelectMenuBuilder(menu)),
    );
  }

  return { components: [container], flags: MessageFlags.IsComponentsV2 };
};
