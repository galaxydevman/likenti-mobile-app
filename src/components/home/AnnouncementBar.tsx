import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

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

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.announcementBlue,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
