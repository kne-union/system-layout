import { Card, preset, createThemeColors } from '@kne/react-box';
import '@kne/react-box/dist/index.css';

// 主题注册色：实例未传 color 时走 --sl-* 变量，跟随宿主主色；传了其它色则按该色计算
const SYSTEM_COLOR = '#4183f0';

export const CARD_THEME = {
  glass: 'system-glass',
  solid: 'system-solid',
  tint: 'system-tint',
  accent: 'system-accent'
};

const mix = (color, percent) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

const pickDefined = (overrides = {}) => Object.fromEntries(Object.entries(overrides).filter(([, value]) => value != null));

const createPalette = build => (color, overrides) => {
  const isSystem = !color || color.toLowerCase() === SYSTEM_COLOR;
  const primary = isSystem ? `var(--sl-primary, ${SYSTEM_COLOR})` : color;
  return Object.assign(
    {},
    createThemeColors(color || SYSTEM_COLOR),
    {
      color: primary,
      accentDeep: primary,
      glow: mix(primary, 45),
      subtitleColor: primary,
      titleColor: 'var(--sl-text-1, #1f2329)',
      mutedColor: 'var(--sl-text-2, #646a73)',
      descriptionColor: 'var(--sl-text-2, #646a73)',
      itemBorderColor: 'var(--sl-divider, rgba(17, 24, 39, 0.06))',
      itemBackground: 'rgba(255, 255, 255, 0.72)',
      itemTitleColor: 'var(--sl-text-1, #1f2329)',
      itemPrefixBg: mix(primary, 12),
      itemPrefixColor: primary,
      footerBorder: 'var(--sl-divider, rgba(17, 24, 39, 0.06))',
      footerValue: 'var(--sl-text-1, #1f2329)',
      metricColor: primary,
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease'
    },
    build(primary),
    pickDefined(overrides)
  );
};

const baseTheme = {
  color: SYSTEM_COLOR,
  accent: true,
  accentBar: false,
  radius: 12,
  padding: 20,
  titleFontSize: 16,
  titleFontWeight: 600,
  titleLetterSpacing: 0,
  subtitleFontSize: 12,
  subtitleFontWeight: 500,
  subtitleLetterSpacing: 0,
  subtitleTextTransform: 'none',
  extraFontSize: 13,
  descriptionFontSize: 13,
  headerMarginBottom: 12,
  contentGap: 12,
  itemRadius: 10,
  itemTitleFontSize: 14,
  itemTitleFontWeight: 500
};

// liquid glass：半透明渐变底 + 左上斜向高光 + 白色高光描边 + 内侧顶部亮边 + 背景模糊增饱和
const SHEEN = 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 42%)';
const glassBody = (top, bottom) => `linear-gradient(180deg, rgba(255, 255, 255, ${top}) 0%, rgba(255, 255, 255, ${bottom}) 100%)`;
const glassShadow = (depth = 0.1) => `inset 0 1px 0 0 rgba(255, 255, 255, 0.9), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4), 0 1px 2px 0 rgba(78, 96, 139, 0.06), 0 6px 20px -4px rgba(78, 96, 139, ${depth})`;
const glassHoverShadow = `inset 0 1px 0 0 rgba(255, 255, 255, 0.95), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5), 0 2px 4px 0 rgba(78, 96, 139, 0.08), 0 12px 32px -6px rgba(78, 96, 139, 0.2)`;
const glassCss = `& { backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }`;

const liquidGlass = ({ top, bottom, tint = [], depth }) => ({
  surface: 'transparent',
  backgroundImage: [SHEEN, ...tint, glassBody(top, bottom)].join(', '),
  borderColor: 'rgba(255, 255, 255, 0.7)',
  shadow: glassShadow(depth),
  hoverShadow: glassHoverShadow,
  hoverBorderColor: 'rgba(255, 255, 255, 0.9)'
});

preset({
  card: {
    createThemeColors: {
      [CARD_THEME.glass]: createPalette(() => liquidGlass({ top: 0.62, bottom: 0.36, depth: 0.08 })),
      [CARD_THEME.solid]: createPalette(() => ({
        ...liquidGlass({ top: 0.9, bottom: 0.72, depth: 0.12 }),
        itemBackground: 'var(--sl-field-bg, rgba(118, 118, 128, 0.1))',
        itemBorderColor: 'transparent'
      })),
      [CARD_THEME.tint]: createPalette(primary => ({
        ...liquidGlass({
          top: 0.56,
          bottom: 0.32,
          depth: 0.1,
          tint: [`linear-gradient(135deg, ${mix(primary, 16)} 0%, ${mix(primary, 4)} 100%)`]
        }),
        titleColor: primary
      })),
      [CARD_THEME.accent]: createPalette(primary => ({
        ...liquidGlass({
          top: 0.72,
          bottom: 0.46,
          depth: 0.1,
          tint: [`linear-gradient(180deg, ${mix(primary, 10)} 0%, transparent 56px)`]
        }),
        hoverBorderColor: mix(primary, 28)
      }))
    },
    themes: {
      [CARD_THEME.glass]: {
        ...baseTheme,
        createThemeColors: CARD_THEME.glass,
        css: glassCss
      },
      [CARD_THEME.solid]: {
        ...baseTheme,
        createThemeColors: CARD_THEME.solid,
        padding: 16,
        titleFontSize: 15,
        css: glassCss
      },
      [CARD_THEME.tint]: {
        ...baseTheme,
        createThemeColors: CARD_THEME.tint,
        css: glassCss,
        hover: false,
        padding: '16px 20px',
        titleFontSize: 15,
        headerMarginBottom: 6,
        contentGap: 8
      },
      [CARD_THEME.accent]: {
        ...baseTheme,
        createThemeColors: CARD_THEME.accent,
        css: glassCss,
        accentBar: true,
        accentBarHeight: 3,
        accentBarOpacity: 0.85
      }
    }
  }
});

export default Card;
