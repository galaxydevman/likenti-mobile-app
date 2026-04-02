import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/PlaceholderScreen.styles';

type Props = { title: string };

export default function PlaceholderScreen({ title }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}
