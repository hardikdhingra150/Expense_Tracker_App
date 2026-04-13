import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@expenses';

export async function getAllExpenses() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function addExpense(expense) {
  const existing = await getAllExpenses();
  const updated = [...existing, { ...expense, id: Date.now().toString() }];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export function getMonthTotal(expenses, year, monthIndex) {
  return expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    })
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

export function getDayTotal(expenses, dateStr) {
  return expenses
    .filter(e => e.date === dateStr)
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}