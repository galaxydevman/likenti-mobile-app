import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  outerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingHorizontal: 16,
    minHeight: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchBarRowFocused: {
    borderColor: colors.headerBlue,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(51, 51, 51, 0.35)',
    marginHorizontal: 10,
  },
  leftIcon: {
    paddingRight: 2,
  },
  rightIcon: {
    paddingLeft: 8,
  },
  favouriteBtn: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
