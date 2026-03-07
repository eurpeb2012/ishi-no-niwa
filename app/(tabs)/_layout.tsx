import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, useWindowDimensions } from "react-native";
import { colors, fontSize } from "../../theme";

function TabIcon({ label, focused, size }: { label: string; focused: boolean; size: number }) {
  return (
    <Text style={[{ fontSize: size, color: colors.textMuted }, focused && { color: colors.primary }]}>
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const iconSize = isWide ? 24 : 20;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          isWide && styles.tabBarWide,
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
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
            <TabIcon label="庭" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="stones"
        options={{
          title: t("tabs.stones"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="石" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t("tabs.guide"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="導" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("tabs.journey"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="道" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t("tabs.community"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="輪" focused={focused} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="私" focused={focused} size={iconSize} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabBarWide: {
    height: 70,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: "500",
  },
  tabLabelWide: {
    fontSize: fontSize.sm,
  },
});
