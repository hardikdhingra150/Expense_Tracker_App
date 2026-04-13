import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#01696f',
      tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 8 },
      headerStyle: { backgroundColor: '#f7f6f2' },
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Tabs.Screen name="index"    options={{ title: '🏠 Home' }} />
      <Tabs.Screen name="calendar" options={{ title: '📅 Calendar' }} />
      <Tabs.Screen name="settings" options={{ title: '⚙️ Settings' }} />
    </Tabs>
  );
}