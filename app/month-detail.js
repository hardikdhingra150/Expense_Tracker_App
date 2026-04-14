import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAllExpenses, getDayTotal } from '../src/storage/expenseStorage';
import { useApp } from '../src/context/AppContext';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthDetail() {
  const { month, year }     = useLocalSearchParams();
  const [expenses, setExpenses] = useState([]);
  const { currency, theme } = useApp();
  const m = parseInt(month), y = parseInt(year);
  const s = makeStyles(theme);

  useEffect(() => { getAllExpenses().then(setExpenses); }, []);

  const expenseList = expenses.filter(e => e.type !== 'income');
  const incomeList  = expenses.filter(e => e.type === 'income');

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dd = String(i + 1).padStart(2, '0');
    const mm = String(m + 1).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  });

  const monthExpense = expenseList
    .filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
    .reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  const monthIncome = incomeList
    .filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
    .reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  const fmt = (n) => `${currency.symbol}${n.toLocaleString(currency.locale)}`;

  return (
    <ScrollView style={s.container}>
      <Text style={s.header}>{MONTH_NAMES[m]} {y}</Text>

      {/* Summary Row */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { borderColor: '#ff658455' }]}>
          <Text style={s.summaryLabel}>Spent</Text>
          <Text style={[s.summaryVal, { color: '#ff6584' }]}>{fmt(monthExpense)}</Text>
        </View>
        <View style={[s.summaryCard, { borderColor: '#00d4aa55' }]}>
          <Text style={s.summaryLabel}>Earned</Text>
          <Text style={[s.summaryVal, { color: '#00d4aa' }]}>{fmt(monthIncome)}</Text>
        </View>
        <View style={[s.summaryCard, { borderColor: '#6c63ff55' }]}>
          <Text style={s.summaryLabel}>Balance</Text>
          <Text style={[s.summaryVal, { color: '#6c63ff' }]}>{fmt(monthIncome - monthExpense)}</Text>
        </View>
      </View>

      {/* Day Grid */}
      <FlatList
        data={days} numColumns={4} scrollEnabled={false}
        keyExtractor={d => d}
        renderItem={({ item }) => {
          const t = getDayTotal(expenseList, item);
          return (
            <View style={[s.day, t > 0 && s.dayActive]}>
              <Text style={s.dayNum}>{parseInt(item.split('-')[2])}</Text>
              {t > 0 && <Text style={s.dayAmt}>{currency.symbol}{t.toLocaleString(currency.locale)}</Text>}
            </View>
          );
        }}
      />

      {/* All Expenses */}
      <Text style={s.sectionTitle}>All Transactions</Text>
      {expenses
        .filter(e => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(e => (
          <View key={e.id} style={s.expRow}>
            <View>
              <Text style={s.expCat}>{e.category}</Text>
              <Text style={s.expDate}>{e.date}{e.note ? ` · ${e.note}` : ''}</Text>
            </View>
            <Text style={[s.expAmt, { color: e.type === 'income' ? '#00d4aa' : '#ff6584' }]}>
              {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
            </Text>
          </View>
        ))
      }
    </ScrollView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container:    { flex: 1, backgroundColor: theme.bg, padding: 14 },
    header:       { fontSize: 22, fontWeight: '800', color: theme.text, textAlign: 'center', marginBottom: 16 },
    summaryRow:   { flexDirection: 'row', gap: 8, marginBottom: 16 },
    summaryCard:  { flex: 1, backgroundColor: theme.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1 },
    summaryLabel: { fontSize: 11, color: theme.muted, marginBottom: 4, fontWeight: '600' },
    summaryVal:   { fontSize: 15, fontWeight: '800' },
    day:          { flex: 1, margin: 4, minHeight: 70, padding: 8, backgroundColor: theme.surface, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border },
    dayActive:    { backgroundColor: '#6c63ff22', borderColor: '#6c63ff55' },
    dayNum:       { fontSize: 16, fontWeight: '700', color: theme.text },
    dayAmt:       { fontSize: 9, color: '#6c63ff', fontWeight: '700', marginTop: 3, textAlign: 'center' },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.text, marginTop: 20, marginBottom: 10 },
    expRow:       { backgroundColor: theme.surface, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    expCat:       { fontSize: 15, fontWeight: '600', color: theme.text },
    expDate:      { fontSize: 12, color: theme.muted },
    expAmt:       { fontSize: 16, fontWeight: '700' },
  });
}