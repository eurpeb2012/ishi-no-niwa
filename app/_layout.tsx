import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../theme";
import "../i18n";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const maxWidth = width >= 1024 ? 900 : width >= 600 ? 600 : width;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      {isWide ? (
        <View style={styles.wideWrapper}>
          <View style={[styles.contentShell, { maxWidth }]}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </View>
        </View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  wideWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  contentShell: {
    flex: 1,
    width: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
});
