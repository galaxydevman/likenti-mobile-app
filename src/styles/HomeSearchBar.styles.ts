import { Platform, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const barShadow =
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    default: {
      elevation: 3,
    },
  }) ?? {};

const heartShadow =
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    default: {
      elevation: 3,
    },
  }) ?? {};

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
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 48,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    ...barShadow,
  },
  searchBarRowFocused: {
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(51, 51, 51, 0.35)',
    marginHorizontal: 8,
  },
  leftIcon: {
    paddingRight: 2,
  },
  rightIcon: {
    paddingLeft: 8,
  },
  favouriteBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    ...heartShadow,
  },
});
