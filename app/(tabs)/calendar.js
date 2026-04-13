import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getAllExpenses, getMonthTotal } from '../../src/storage/expenseStorage';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarScreen() {
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();
  const year = new Date().getFullYear();

  useFocusEffect(useCallback(() => {
    getAllExpenses().then(setExpenses);
  }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{year} — All Months</Text>
      <FlatList
        data={MONTHS}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => {
          const total = getMonthTotal(expenses, year, index);
          return (
            <TouchableOpacity
              style={[styles.card, total > 0 && styles.cardFilled]}
              onPress={() => router.push({ pathname: '/month-detail', params: { month: index, year } })}
            >
              <Text style={styles.monthName}>{item}</Text>
              <Text style={styles.total}>{total > 0 ? `₹${total.toLocaleString('en-IN')}` : '—'}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f7f6f2', padding: 12 },
  header:     { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#28251d' },
  card:       { flex: 1, margin: 6, padding: 20, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', minHeight: 95, justifyContent: 'center', elevation: 2 },
  cardFilled: { backgroundColor: '#cedcd8' },
  monthName:  { fontSize: 16, fontWeight: '700', color: '#28251d' },
  total:      { fontSize: 13, fontWeight: '600', color: '#01696f', marginTop: 6 },
});