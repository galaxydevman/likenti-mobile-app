export type HeaderThemePreset = {
  id: string;
  backgroundColor?: string;
  gradientColors?: readonly [string, string];
  /** Icons and primary text on the header card */
  headerForeground: string;
  /** Search bar accent (icons, focused border) */
  accentColor: string;
  statusBarStyle: 'light' | 'dark';
  /** Optional tint when the logo asset is white-on-transparent */
  logoTintColor?: string;
};

export const HEADER_THEME_PRESETS: HeaderThemePreset[] = [
  {
    id: 'navy',
    backgroundColor: '#1a2744',
    headerForeground: '#FFFFFF',
    accentColor: '#1a2744',
    statusBarStyle: 'light',
  },
  {
    id: 'blush',
    backgroundColor: '#f5dde6',
    headerForeground: '#1a2744',
    accentColor: '#1a2744',
    statusBarStyle: 'dark',
    logoTintColor: '#1a2744',
  },
  {
    id: 'purple',
    gradientColors: ['#6d4bc8', '#9b7fd9'],
    headerForeground: '#FFFFFF',
    accentColor: '#5c3fb0',
    statusBarStyle: 'light',
  },
  {
    id: 'teal',
    gradientColors: ['#0a5c61', '#1ba3ad'],
    headerForeground: '#FFFFFF',
    accentColor: '#0a5c61',
    statusBarStyle: 'light',
  },
];

export const DEFAULT_HEADER_THEME_ID = HEADER_THEME_PRESETS[0].id;

export function getHeaderThemeById(id: string): HeaderThemePreset {
  return HEADER_THEME_PRESETS.find((p) => p.id === id) ?? HEADER_THEME_PRESETS[0];
}
