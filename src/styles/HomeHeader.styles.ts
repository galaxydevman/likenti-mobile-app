import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.headerBlue,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRowContainer: {
    overflow: 'hidden',
  },
  topRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBlock: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  logo: {
    width: 168,
    height: 48,
    maxWidth: '72%',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 4,
  },
});
