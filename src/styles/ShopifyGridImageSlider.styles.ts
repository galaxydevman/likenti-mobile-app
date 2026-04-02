import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
export const OUTER_PAD = 8;
export const GAP = 10;

const PARTIAL_VISIBLE_COUNT = 2.3;
export const CARD_W = Math.max(150, Math.round((SCREEN_W - OUTER_PAD * 2 - GAP) / PARTIAL_VISIBLE_COUNT));
export const CARD_H = Math.round(CARD_W * 1.18);

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    marginTop: 16,
    paddingTop: 6,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
