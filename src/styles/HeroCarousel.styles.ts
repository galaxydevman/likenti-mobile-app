import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');

export const SLIDE_W = SCREEN_W;
export const HERO_H = 300;

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.pageBg,
  },
  slide: {
    width: SLIDE_W,
    height: HERO_H,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandPill: {
    backgroundColor: 'rgba(236, 72, 153, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: '70%',
  },
  brandText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  cta: {
    marginTop: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ctaText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  title: {
    marginTop: 10,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    maxWidth: '75%',
  },
  subtitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 14,
    maxWidth: '75%',
  },
  dotStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  dotInactive: {
    width: 18,
    backgroundColor: 'rgba(200,200,200,0.55)',
  },
});
