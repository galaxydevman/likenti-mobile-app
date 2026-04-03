import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  row: {
    alignItems: 'stretch',
    gap: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.02)',
    marginBottom: 5,
    marginTop: 5,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.categoryCircleBg,
  },
  /** Fixed height so every card matches regardless of 1 vs 2 title lines (2× lineHeight + vertical padding). */
  labelWrap: {
    height: 52,
    paddingHorizontal: 6,
    paddingVertical: 8,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    lineHeight: 18,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    gap: 10,
  },
  loadingText: {
    color: colors.textLabel,
    fontSize: 14,
    fontWeight: '500',
  },
});
