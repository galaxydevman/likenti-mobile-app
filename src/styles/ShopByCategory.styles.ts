import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const CIRCLE = 88;
export const LABEL_LINES = 2;
export const LABEL_LINE_HEIGHT = 18;
export const LABEL_MT = 8;
export const TILE_W = CIRCLE + 6;
export const TILE_H = CIRCLE + LABEL_MT + LABEL_LINES * LABEL_LINE_HEIGHT;
const OVERLAP_Y = 0;
export const ROW_GAP = 12;
export const H_GAP = 12;

export const styles = StyleSheet.create({
  section: {
    position: 'relative',
    zIndex: 1,
    elevation: 1,
    overflow: 'visible',
    paddingTop: 20,
    paddingBottom: 20,
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: OVERLAP_Y,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  content: {
    paddingHorizontal: 16,
    zIndex: 2,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 14,
  },
  scrollContent: {
    paddingRight: 16,
  },
  columnsWrap: {
    flexDirection: 'row',
    marginTop: 0,
    gap: H_GAP,
    zIndex: 3,
  },
  column: {
    width: TILE_W,
    gap: ROW_GAP,
  },
  item: {
    width: TILE_W,
    minHeight: TILE_H,
    alignItems: 'center',
  },
  itemSpacer: {
    width: TILE_W,
    height: TILE_H,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.categoryCircleBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleImage: {
    width: CIRCLE - 8,
    height: CIRCLE - 8,
    borderRadius: (CIRCLE - 8) / 2,
  },
  imagePlaceholder: {
    position: 'absolute',
    width: CIRCLE - 8,
    height: CIRCLE - 8,
    borderRadius: (CIRCLE - 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
  label: {
    marginTop: LABEL_MT,
    fontSize: 13,
    lineHeight: LABEL_LINE_HEIGHT,
    color: colors.textLabel,
    textAlign: 'center',
    fontWeight: '500',
    minHeight: LABEL_LINES * LABEL_LINE_HEIGHT,
  },
});
