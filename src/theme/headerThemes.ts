export type HeaderThemePreset = {
  id: string;
  backgroundColor?: string;
  gradientColors?: readonly [string, string];
  /** Icons and primary text on the header card */
  headerForeground: string;
  /** Search bar accent (icons, focused border) */
  accentColor: string;
  /** Screen / scroll background tuned to the header */
  pageBackground: string;
  statusBarStyle: 'light' | 'dark';
  /** Optional tint when the logo asset is white-on-transparent */
  logoTintColor?: string;
};

export const HEADER_THEME_PRESETS: HeaderThemePreset[] = [
  {
    id: 'dark',
    gradientColors: ['#0d1730', '#243f79'],
    headerForeground: '#FFFFFF',
    accentColor: '#1f3d74',
    pageBackground: '#E8EEF9',
    statusBarStyle: 'light',
  },
  {
    id: 'light',
    gradientColors: ['#fdf2f8', '#dbeafe'],
    headerForeground: '#1e2f56',
    accentColor: '#2f4f87',
    pageBackground: '#F7FAFF',
    statusBarStyle: 'dark',
    logoTintColor: '#1e2f56',
  },
];

export const DEFAULT_HEADER_THEME_ID = HEADER_THEME_PRESETS[0].id;

export function getHeaderThemeById(id: string): HeaderThemePreset {
  return HEADER_THEME_PRESETS.find((p) => p.id === id) ?? HEADER_THEME_PRESETS[0];
}
