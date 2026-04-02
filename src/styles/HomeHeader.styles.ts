import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRowContainer: {
    overflow: 'hidden',
  },
  topRow: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topColSide: {
    flex: 1,
    justifyContent: 'center',
  },
  topColCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 244,
    height: 72,
    maxWidth: '100%',
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
