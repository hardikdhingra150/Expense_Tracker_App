import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="add-expense"  options={{ presentation: 'modal', title: 'Add Expense' }} />
        <Stack.Screen name="month-detail" options={{ title: 'Month Details' }} />
      </Stack>
    </AppProvider>
  );
}