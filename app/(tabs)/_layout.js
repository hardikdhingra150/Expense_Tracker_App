import { Tabs } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function TabLayout() {
  const { theme } = useApp();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#6c63ff',
      tabBarInactiveTintColor: theme.muted,
      tabBarStyle: {
        backgroundColor: theme.surface,
        borderTopColor: theme.border,
        borderTopWidth: 1,
        height: 64,
        paddingBottom: 10,
      },
      tabBarLabelStyle:  { fontSize: 13, fontWeight: '700' },
      tabBarShowIcon:    false,
      tabBarIcon:        () => null,
      headerStyle:       { backgroundColor: theme.bg },
      headerTitleStyle:  { fontWeight: '800', color: theme.text, fontSize: 18 },
      headerTintColor:   theme.text,
    }}>
      <Tabs.Screen name="index"    options={{ title: 'Home',     tabBarLabel: '🏠  Home',     tabBarIcon: () => null }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarLabel: '📅  Calendar', tabBarIcon: () => null }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarLabel: '⚙️  Settings', tabBarIcon: () => null }} />
    </Tabs>
  );
}