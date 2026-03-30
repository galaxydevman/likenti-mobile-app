import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPressQrScanner?: () => void;
  onPressFavourite?: () => void;
};

export function HomeSearchBar({
  placeholder = 'Rechercher',
  onChangeText,
  onPressQrScanner,
  onPressFavourite,
}: Props) {
  return (
    <View style={styles.outerRow}>
      <View style={styles.searchBarRow}>
        <View style={styles.leftIcon}>
          <Ionicons name="search" size={22} color={colors.textLabel} />
        </View>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="rgba(51, 51, 51, 0.35)"
          style={styles.input}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        <Pressable
          onPress={onPressQrScanner ?? (() => Alert.alert('QR Scanner', 'Coming soon'))}
          hitSlop={12}
          style={styles.rightIcon}
        >
          <Ionicons name="qr-code-outline" size={22} color={colors.headerBlue} />
        </Pressable>
      </View>

      <Pressable
        onPress={onPressFavourite ?? (() => Alert.alert('Favoris', 'Coming soon'))}
        hitSlop={12}
        style={styles.favouriteBtn}
      >
        <Ionicons name="heart-outline" size={22} color={colors.headerBlue} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: colors.textDark,
    paddingVertical: 10,
    marginHorizontal: 6,
  },
  leftIcon: {
    paddingRight: 2,
  },
  rightIcon: {
    paddingLeft: 8,
  },
  favouriteBtn: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
