import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
export const OUTER_PAD = 16;
export const SLIDE_W = Math.max(1, SCREEN_W - OUTER_PAD * 2);

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    paddingHorizontal: OUTER_PAD,
    marginTop: 16,
  },
  slide: {
    width: SLIDE_W,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    borderRadius: 20,
  },
  dotStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingTop: 16,
    backgroundColor: 'transparent',
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
