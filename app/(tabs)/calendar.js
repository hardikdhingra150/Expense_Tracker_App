import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getAllExpenses, getMonthTotal } from '../../src/storage/expenseStorage';
import { useApp } from '../../src/context/AppContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS  = ['#6c63ff','#ff6584','#00d4aa','#ffd93d','#ff9f43','#54a0ff','#5f27cd','#ee5a24','#0abde3','#10ac84','#f368e0','#48dbfb'];

export default function CalendarScreen() {
  const [expenses, setExpenses]   = useState([]);
  const { currency, theme }       = useApp();
  const router                    = useRouter();
  const year                      = new Date().getFullYear();
  const currentMonth              = new Date().getMonth();
  const s                         = makeStyles(theme);

  useFocusEffect(useCallback(() => {
    getAllExpenses().then(setExpenses);
  }, []));

  const expenseList = expenses.filter(e => e.type !== 'income');

  return (
    <View style={s.container}>
      <Text style={s.header}>{year}</Text>
      <Text style={s.subHeader}>Tap a month to see daily breakdown</Text>
      <FlatList
        data={MONTHS}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const total = getMonthTotal(expenseList, year, index);
          const isNow = index === currentMonth;
          return (
            <TouchableOpacity
              style={[s.card, { borderColor: COLORS[index] + '55' }, isNow && { backgroundColor: COLORS[index] + '22' }]}
              onPress={() => router.push({ pathname: '/month-detail', params: { month: index, year } })}
            >
              <View style={[s.dot, { backgroundColor: COLORS[index] }]} />
              <Text style={s.monthName}>{item}</Text>
              <Text style={[s.total, total > 0 && { color: COLORS[index] }]}>
                {total > 0 ? `${currency.symbol}${total.toLocaleString(currency.locale)}` : '—'}
              </Text>
              {isNow && <Text style={[s.badge, { color: COLORS[index] }]}>NOW</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container:  { flex: 1, backgroundColor: theme.bg, padding: 14 },
    header:     { fontSize: 28, fontWeight: '800', textAlign: 'center', color: theme.text, marginTop: 8 },
    subHeader:  { fontSize: 13, color: theme.muted, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    card:       { flex: 1, margin: 6, padding: 16, backgroundColor: theme.surface, borderRadius: 18, alignItems: 'center', minHeight: 105, justifyContent: 'center', borderWidth: 1 },
    dot:        { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
    monthName:  { fontSize: 15, fontWeight: '700', color: theme.text },
    total:      { fontSize: 12, fontWeight: '600', color: theme.muted, marginTop: 6, textAlign: 'center' },
    badge:      { fontSize: 9, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  });
}