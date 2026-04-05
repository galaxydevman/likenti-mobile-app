import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CartStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<CartStackParamList, 'CheckoutWebView'>;

export default function CheckoutWebViewScreen({ route }: Props) {
  const { checkoutUrl } = route.params;
  const [firstPaint, setFirstPaint] = useState(true);

  const onLoadEnd = useCallback(() => {
    setFirstPaint(false);
  }, []);

  return (
    <View style={styles.root}>
      {firstPaint ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.headerBlue} />
        </View>
      ) : null}
      <WebView
        source={{ uri: checkoutUrl }}
        onLoadEnd={onLoadEnd}
        setSupportMultipleWindows={false}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    zIndex: 1,
  },
});
