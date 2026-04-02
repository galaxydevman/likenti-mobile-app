import React, { useState, type RefObject } from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert, Text, type TextInput as TextInputType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onPressSearch?: () => void;
  onPressQrScanner?: () => void;
  onPressFavourite?: () => void;
  autoFocus?: boolean;
  showFavouriteButton?: boolean;
  showQrScannerButton?: boolean;
  /** When editable (no `onPressSearch`), attach ref for imperative `focus()` — e.g. search screen header. */
  inputRef?: RefObject<TextInputType | null>;
};

export function HomeSearchBar({
  placeholder = 'Rechercher',
  value,
  onChangeText,
  onFocus,
  onPressSearch,
  onPressQrScanner,
  onPressFavourite,
  autoFocus = false,
  showFavouriteButton = true,
  showQrScannerButton = true,
  inputRef,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const BarWrapper = onPressSearch ? Pressable : View;
  const barWrapperProps = onPressSearch
    ? ({ onPress: onPressSearch } as const)
    : ({} as const);

  return (
    <View style={styles.outerRow}>
      <BarWrapper
        style={[styles.searchBarRow, isFocused && styles.searchBarRowFocused]}
        {...barWrapperProps}
      >
        <View style={styles.leftIcon}>
          <Ionicons name="search" size={22} color={isFocused ? colors.headerBlue : colors.textLabel} />
        </View>
        {onPressSearch ? (
          <Text style={styles.placeholderText}>{placeholder}</Text>
        ) : (
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            placeholderTextColor="rgba(51, 51, 51, 0.35)"
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            autoFocus={autoFocus}
          />
        )}
        {showQrScannerButton ? (
          <Pressable
            onPress={onPressQrScanner ?? (() => Alert.alert('QR Scanner', 'Coming soon'))}
            hitSlop={12}
            style={styles.rightIcon}
          >
            <Ionicons name="qr-code-outline" size={22} color={colors.headerBlue} />
          </Pressable>
        ) : null}
      </BarWrapper>

      {showFavouriteButton ? (
        <Pressable
          onPress={onPressFavourite ?? (() => Alert.alert('Favoris', 'Coming soon'))}
          hitSlop={12}
          style={styles.favouriteBtn}
        >
          <Ionicons name="heart-outline" size={22} color={colors.headerBlue} />
        </Pressable>
      ) : null}
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
    borderRadius: 6,
    paddingHorizontal: 16,
    minHeight: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchBarRowFocused: {
    borderColor: colors.headerBlue,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(51, 51, 51, 0.35)',
    marginHorizontal: 10,
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
