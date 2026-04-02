import React, { useState, type RefObject } from 'react';
import { View, TextInput, Pressable, Alert, Text, type TextInput as TextInputType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styles } from '../../styles/HomeSearchBar.styles';

type Props = {
  placeholder?: string;
  value?: string;
  /** Uncontrolled initial text (e.g. chip). Omit `value` when using this. */
  defaultValue?: string;
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
  defaultValue,
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
            {...(value !== undefined ? { value } : defaultValue !== undefined ? { defaultValue } : {})}
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
