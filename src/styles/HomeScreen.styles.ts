import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingBottom: 32,
  },
  stickyHeader: {
    zIndex: 200,
    elevation: 200,
    backgroundColor: colors.headerBlue,
  },
});
