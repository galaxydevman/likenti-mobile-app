import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
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
    fontWeight: '600',
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
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    minWidth: '47%',
  },
  keywordText: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '600',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
  },
  categoryCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textDark,
    fontWeight: '500',
    textAlign: 'center',
    minHeight: 36,
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
