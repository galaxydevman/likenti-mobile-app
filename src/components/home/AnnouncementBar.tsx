import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/AnnouncementBar.styles';

type Props = {
  message?: string;
};

export function AnnouncementBar({
  message = 'Hassle-free returns. 30-day postage paid returns.',
}: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.text} numberOfLines={1}>
        {message}
      </Text>
    </View>
  );
}
