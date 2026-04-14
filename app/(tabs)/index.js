import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { getAllExpenses, getMonthTotal } from '../../src/storage/expenseStorage';
import { useApp } from '../../src/context/AppContext';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState([]);
  const { currency, theme } = useApp();
  const router = useRouter();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const s = makeStyles(theme);

  useFocusEffect(useCallback(() => {
    getAllExpenses().then(setExpenses);
  }, []));

  const fmt = (n) => `${currency.symbol}${Math.abs(n).toLocaleString(currency.locale)}`;

  const incomeList  = expenses.filter(e => e.type === 'income');
  const expenseList = expenses.filter(e => e.type !== 'income');

  const todayExpense = expenseList.filter(e => e.date === todayStr).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const todayIncome  = incomeList.filter(e => e.date === todayStr).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const monthExpense = getMonthTotal(expenseList, now.getFullYear(), now.getMonth());
  const monthIncome  = incomeList.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalIncome  = incomeList.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalExpense = expenseList.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const balance      = totalIncome - totalExpense;

  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const CAT_COLORS = {
    '🍔 Food': '#ff6584', '🚗 Transport': '#6c63ff',
    '🛍 Shopping': '#ffd93d', '💡 Bills': '#00d4aa',
    '💊 Health': '#ff9f43', '📦 Other': '#8b8b9e',
    '💰 Salary': '#00d4aa', '🎁 Gift': '#f368e0',
    '📈 Investment': '#54a0ff', '🪙 Pocket Money': '#ffd93d',
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>
            {now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'} 👋
          </Text>
          <Text style={s.headerTitle}>Your Finances</Text>
        </View>
        <TouchableOpacity style={s.addIconBtn} onPress={() => router.push('/add-expense')}>
          <Text style={s.addIconTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Hero Card */}
      <View style={s.heroCard}>
        <Text style={s.heroLabel}>Net Balance</Text>
        <Text style={StyleSheet.flatten([s.heroAmount, { color: balance >= 0 ? '#00d4aa' : '#ff6584' }])}>
          {balance >= 0 ? '+' : '-'}{fmt(balance)}
        </Text>
        <View style={s.heroRow}>
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>↑ Income</Text>
            <Text style={StyleSheet.flatten([s.heroStatVal, { color: '#00d4aa' }])}>{fmt(totalIncome)}</Text>
          </View>
          <View style={s.heroDivider} />
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>↓ Expenses</Text>
            <Text style={StyleSheet.flatten([s.heroStatVal, { color: '#ff6584' }])}>{fmt(totalExpense)}</Text>
          </View>
        </View>
      </View>

      {/* Today + Month Row */}
      <View style={s.row}>
        <View style={StyleSheet.flatten([s.miniCard, { flex: 1 }])}>
          <Text style={s.miniLabel}>Today Spent</Text>
          <Text style={StyleSheet.flatten([s.miniVal, { color: '#ff6584' }])}>{fmt(todayExpense)}</Text>
          <Text style={s.miniSub}>earned {fmt(todayIncome)}</Text>
        </View>
        <View style={{ width: 12 }} />
        <View style={StyleSheet.flatten([s.miniCard, { flex: 1 }])}>
          <Text style={s.miniLabel}>Month Spent</Text>
          <Text style={StyleSheet.flatten([s.miniVal, { color: '#ff6584' }])}>{fmt(monthExpense)}</Text>
          <Text style={s.miniSub}>earned {fmt(monthIncome)}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={s.row}>
        <TouchableOpacity
          style={s.expenseBtn}
          onPress={() => router.push({ pathname: '/add-expense', params: { defaultType: 'expense' } })}
        >
          <Text style={s.expenseBtnTxt}>↓ Add Expense</Text>
        </TouchableOpacity>
        <View style={{ width: 12 }} />
        <TouchableOpacity
          style={s.incomeBtn}
          onPress={() => router.push({ pathname: '/add-expense', params: { defaultType: 'income' } })}
        >
          <Text style={s.incomeBtnTxt}>↑ Add Income</Text>
        </TouchableOpacity>
      </View>

      {/* Recent */}
      <Text style={s.sectionTitle}>Recent Transactions</Text>
      {recent.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyIcon}>🧾</Text>
          <Text style={s.emptyText}>No transactions yet</Text>
          <Text style={s.emptySubText}>Add an expense or income to get started</Text>
        </View>
      ) : (
        recent.map(e => (
          <View key={e.id} style={s.txRow}>
            <View style={StyleSheet.flatten([s.txDot, { backgroundColor: (CAT_COLORS[e.category] || '#6c63ff') + '33' }])}>
              <Text style={s.txEmoji}>{e.category?.split(' ')[0]}</Text>
            </View>
            <View style={s.txInfo}>
              <Text style={s.txCat}>{e.category?.split(' ').slice(1).join(' ')}</Text>
              <Text style={s.txDate}>{e.date}{e.note ? ` · ${e.note}` : ''}</Text>
            </View>
            <Text style={StyleSheet.flatten([s.txAmt, { color: e.type === 'income' ? '#00d4aa' : '#ff6584' }])}>
              {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container:    { flex: 1, backgroundColor: theme.bg, padding: 20 },
    header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 },
    greeting:     { fontSize: 13, color: theme.muted, marginBottom: 2 },
    headerTitle:  { fontSize: 24, fontWeight: '800', color: theme.text },
    addIconBtn:   { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6c63ff', alignItems: 'center', justifyContent: 'center' },
    addIconTxt:   { fontSize: 26, color: '#fff', lineHeight: 30 },
    heroCard:     { backgroundColor: theme.surface, borderRadius: 24, padding: 24, marginBottom: 14, borderWidth: 1, borderColor: theme.border },
    heroLabel:    { fontSize: 13, color: theme.muted, marginBottom: 6 },
    heroAmount:   { fontSize: 36, fontWeight: '800', marginBottom: 20 },
    heroRow:      { flexDirection: 'row', alignItems: 'center' },
    heroStat:     { flex: 1 },
    heroStatLabel:{ fontSize: 12, color: theme.muted, marginBottom: 4 },
    heroStatVal:  { fontSize: 18, fontWeight: '700' },
    heroDivider:  { width: 1, height: 36, backgroundColor: theme.border, marginHorizontal: 16 },
    row:          { flexDirection: 'row', marginBottom: 14 },
    miniCard:     { backgroundColor: theme.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
    miniLabel:    { fontSize: 12, color: theme.muted, marginBottom: 4 },
    miniVal:      { fontSize: 20, fontWeight: '800' },
    miniSub:      { fontSize: 11, color: theme.muted, marginTop: 4 },
    expenseBtn:   { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', backgroundColor: '#ff658422', borderWidth: 1, borderColor: '#ff658466' },
    expenseBtnTxt:{ fontSize: 15, fontWeight: '700', color: '#ff6584' },
    incomeBtn:    { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', backgroundColor: '#00d4aa22', borderWidth: 1, borderColor: '#00d4aa66' },
    incomeBtnTxt: { fontSize: 15, fontWeight: '700', color: '#00d4aa' },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 },
    emptyBox:     { alignItems: 'center', paddingVertical: 40 },
    emptyIcon:    { fontSize: 40, marginBottom: 12 },
    emptyText:    { fontSize: 16, fontWeight: '700', color: theme.text },
    emptySubText: { fontSize: 13, color: theme.muted, marginTop: 4, textAlign: 'center' },
    txRow:        { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
    txDot:        { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    txEmoji:      { fontSize: 20 },
    txInfo:       { flex: 1 },
    txCat:        { fontSize: 15, fontWeight: '600', color: theme.text },
    txDate:       { fontSize: 12, color: theme.muted, marginTop: 2 },
    txAmt:        { fontSize: 16, fontWeight: '700' },
  });
}