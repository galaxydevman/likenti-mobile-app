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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  liveGlowA: {
    position: 'absolute',
    top: 10,
    left: -38,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  liveGlowB: {
    position: 'absolute',
    right: -44,
    bottom: -56,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
});
