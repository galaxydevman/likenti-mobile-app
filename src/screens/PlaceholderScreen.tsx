import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/PlaceholderScreen.styles';
import { useTheme } from '../theme/ThemeContext';

type Props = { title: string };

export default function PlaceholderScreen({ title }: Props) {
  const { headerTheme } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: headerTheme.pageBackground }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}
