import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

export function HomeSearchBar({ placeholder = 'Rechercher', onChangeText }: Props) {
  return (
    <View style={styles.row}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.55)"
        style={styles.input}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={22} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBarFill,
    borderRadius: 999,
    paddingLeft: 18,
    paddingRight: 12,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    paddingVertical: 8,
  },
  searchIcon: {
    padding: 4,
  },
});
