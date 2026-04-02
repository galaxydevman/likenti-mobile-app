import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
export const OUTER_PAD = 8;
export const GAP = 10;

const PARTIAL_VISIBLE_COUNT = 2.3;
export const CARD_W = Math.max(
  150,
  Math.round((SCREEN_W - OUTER_PAD * 2 - GAP) / PARTIAL_VISIBLE_COUNT)
);
export const CARD_H = 400;

export const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 26,
    fontWeight: '400',
    color: colors.textDark,
    marginBottom: 10,
  },
});
