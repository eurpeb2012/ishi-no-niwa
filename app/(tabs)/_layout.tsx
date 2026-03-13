import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { colors, fontSize } from "../../theme";
import { GemStone } from "../../components/common/GemStone";

// Map each tab to a representative crystal
const TAB_STONES: Record<string, { stoneId: string; colorHex: string }> = {
  garden: { stoneId: "jade_jadeite", colorHex: "#5B8C5A" },
  stones: { stoneId: "amethyst", colorHex: "#9B59B6" },
  journey: { stoneId: "citrine", colorHex: "#F0C75E" },
  community: { stoneId: "rose_quartz", colorHex: "#F7CAC9" },
  profile: { stoneId: "moonstone", colorHex: "#C5D0E6" },
};

function TabCrystalIcon({ tab, focused, size }: { tab: string; focused: boolean; size: number }) {
  const stone = TAB_STONES[tab];
  if (!stone) return null;
  return (
    <View style={{ opacity: focused ? 1 : 0.45 }}>
      <GemStone stoneId={stone.stoneId} colorHex={stone.colorHex} size={size} />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const iconSize = isWide ? 22 : 18;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "top",
        tabBarStyle: [
          styles.tabBar,
          isWide && styles.tabBarWide,
        ],
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: [
          styles.tabLabel,
          isWide && styles.tabLabelWide,
        ],
      }}
    >
      <Tabs.Screen
        name="garden"
        options={{
          title: t("tabs.garden"),
          tabBarIcon: ({ focused }) => (
            <TabCrystalIcon tab="garden" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="stones"
        options={{
          title: t("tabs.stones"),
          tabBarIcon: ({ focused }) => (
            <TabCrystalIcon tab="stones" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("tabs.journey"),
          tabBarIcon: ({ focused }) => (
            <TabCrystalIcon tab="journey" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t("tabs.community"),
          tabBarIcon: ({ focused }) => (
            <TabCrystalIcon tab="community" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused }) => (
            <TabCrystalIcon tab="profile" focused={focused} size={iconSize} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    height: 72,
    paddingTop: 28,
    paddingBottom: 4,
  },
  tabBarWide: {
    height: 64,
    paddingTop: 16,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  tabLabelWide: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
