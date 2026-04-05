import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textLabel,
    fontSize: 15,
    marginTop: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    marginTop: 16,
  },
  loadingWrap: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.textLabel,
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  imageWrap: {
    width: '100%',
    height: 170,
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  cardBody: {
    padding: 12,
  },
  title: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  priceRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  newPrice: {
    color: '#E11D48',
    fontSize: 20,
    fontWeight: '800',
  },
  oldPrice: {
    color: '#8A94A6',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 12,
    borderRadius: 6,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerBlue,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
