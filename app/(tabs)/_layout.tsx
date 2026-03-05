import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet } from "react-native";
import { colors, fontSize } from "../../theme";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>{label}</Text>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="garden"
        options={{
          title: t("tabs.garden"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="庭" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stones"
        options={{
          title: t("tabs.stones"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="石" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t("tabs.guide"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="導" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("tabs.journey"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="道" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused }) => (
            <TabIcon label="私" focused={focused} />
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
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: "500",
  },
  icon: {
    fontSize: 22,
    color: colors.textMuted,
  },
  iconFocused: {
    color: colors.primary,
  },
});
