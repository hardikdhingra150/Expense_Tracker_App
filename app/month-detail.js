import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAllExpenses, getDayTotal } from '../src/storage/expenseStorage';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthDetail() {
  const { month, year } = useLocalSearchParams();
  const [expenses, setExpenses] = useState([]);
  const m = parseInt(month), y = parseInt(year);

  useEffect(() => { getAllExpenses().then(setExpenses); }, []);

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dd = String(i + 1).padStart(2, '0');
    const mm = String(m + 1).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  });

  const monthTotal = expenses
    .filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
    .reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{MONTH_NAMES[m]} {y}</Text>
      <Text style={styles.total}>Total: ₹{monthTotal.toLocaleString('en-IN')}</Text>
      <FlatList
        data={days} numColumns={4} scrollEnabled={false}
        keyExtractor={d => d}
        renderItem={({ item }) => {
          const t = getDayTotal(expenses, item);
          return (
            <View style={[styles.day, t > 0 && styles.dayActive]}>
              <Text style={styles.dayNum}>{parseInt(item.split('-')[2])}</Text>
              {t > 0 && <Text style={styles.dayAmt}>₹{t.toLocaleString('en-IN')}</Text>}
            </View>
          );
        }}
      />
      <Text style={styles.sectionTitle}>All Expenses</Text>
      {expenses
        .filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(e => (
          <View key={e.id} style={styles.expRow}>
            <View>
              <Text style={styles.expCat}>{e.category}</Text>
              <Text style={styles.expDate}>{e.date}{e.note ? ` · ${e.note}` : ''}</Text>
            </View>
            <Text style={styles.expAmt}>₹{parseFloat(e.amount).toLocaleString('en-IN')}</Text>
          </View>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f7f6f2', padding: 14 },
  header:       { fontSize: 22, fontWeight: '700', color: '#28251d', textAlign: 'center' },
  total:        { fontSize: 16, fontWeight: '700', color: '#01696f', textAlign: 'center', marginBottom: 16, marginTop: 4 },
  day:          { flex: 1, margin: 4, minHeight: 70, padding: 8, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  dayActive:    { backgroundColor: '#cedcd8' },
  dayNum:       { fontSize: 16, fontWeight: '700', color: '#28251d' },
  dayAmt:       { fontSize: 10, color: '#01696f', fontWeight: '700', marginTop: 3, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#28251d', marginTop: 20, marginBottom: 10 },
  expRow:       { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  expCat:       { fontSize: 15, fontWeight: '600', color: '#28251d' },
  expDate:      { fontSize: 12, color: '#7a7974' },
  expAmt:       { fontSize: 16, fontWeight: '700', color: '#01696f' },
});