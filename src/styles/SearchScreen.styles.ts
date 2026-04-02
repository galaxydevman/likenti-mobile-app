import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  headerSearchWrap: {
    flex: 1,
    minWidth: 240,
    paddingRight: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  trendingWrap: {
    gap: 24,
    paddingBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  keywordText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
  resultsHeader: {
    marginBottom: 16,
    gap: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingHint: {
    fontSize: 14,
    color: colors.textLabel,
    fontWeight: '500',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  row: {
    gap: 12,
  },
  emptyBlock: {
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textLabel,
    fontSize: 15,
    textAlign: 'center',
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
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
    borderRadius: 999,
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
