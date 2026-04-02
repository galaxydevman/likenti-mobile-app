import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    overflow: 'hidden',
    position: 'relative',
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
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sheenBand: {
    position: 'absolute',
    top: -70,
    left: -260,
    width: 220,
    height: 320,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
});
