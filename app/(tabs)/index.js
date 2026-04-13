import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getAllExpenses, getMonthTotal } from '../../src/storage/expenseStorage';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState([]);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  useFocusEffect(useCallback(() => {
    getAllExpenses().then(setExpenses);
  }, []));

  const todayTotal = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + parseFloat(e.amount), 0);
  const monthTotal = getMonthTotal(expenses, now.getFullYear(), now.getMonth());
  const yearTotal  = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const recent     = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💰 Expense Tracker</Text>

      <View style={styles.row}>
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.label}>Today</Text>
          <Text style={styles.amount}>₹{todayTotal.toLocaleString('en-IN')}</Text>
        </View>
        <View style={{ width: 12 }} />
        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.label}>This Month</Text>
          <Text style={styles.amount}>₹{monthTotal.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Year Total ({now.getFullYear()})</Text>
        <Text style={[styles.amount, { fontSize: 28 }]}>₹{yearTotal.toLocaleString('en-IN')}</Text>
      </View>

      <Link href="/add-expense" asChild>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Expense</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.sectionTitle}>Recent</Text>
      {recent.length === 0
        ? <Text style={styles.empty}>No expenses yet. Add one above!</Text>
        : recent.map(e => (
          <View key={e.id} style={styles.expRow}>
            <View>
              <Text style={styles.expCat}>{e.category}</Text>
              <Text style={styles.expDate}>{e.date}</Text>
            </View>
            <Text style={styles.expAmt}>₹{parseFloat(e.amount).toLocaleString('en-IN')}</Text>
          </View>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f7f6f2', padding: 16 },
  title:        { fontSize: 24, fontWeight: '700', color: '#28251d', marginBottom: 20 },
  row:          { flexDirection: 'row', marginBottom: 12 },
  card:         { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 12, elevation: 2 },
  label:        { fontSize: 13, color: '#7a7974', marginBottom: 4 },
  amount:       { fontSize: 22, fontWeight: '700', color: '#01696f' },
  addBtn:       { backgroundColor: '#01696f', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 24 },
  addBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#28251d', marginBottom: 10 },
  empty:        { color: '#7a7974', textAlign: 'center', marginTop: 20 },
  expRow:       { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expCat:       { fontSize: 15, fontWeight: '600', color: '#28251d' },
  expDate:      { fontSize: 12, color: '#7a7974' },
  expAmt:       { fontSize: 16, fontWeight: '700', color: '#01696f' },
});