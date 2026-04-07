import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  message?: string;
  /** When true (default), fills the parent and centers content for a full-screen gate. */
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function StoreLoadingView({ message = 'Loading store…', fullScreen = true, style }: Props) {
  const { headerTheme } = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        fullScreen ? styles.fullScreen : styles.inline,
        { backgroundColor: headerTheme.pageBackground },
        style,
      ]}
    >
      <ActivityIndicator size="large" color={colors.headerBlue} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  fullScreen: {
    flex: 1,
  },
  inline: {
    flexGrow: 1,
    minHeight: 200,
    paddingVertical: 32,
  },
  text: {
    color: colors.textLabel,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
