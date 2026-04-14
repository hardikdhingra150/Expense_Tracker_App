import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { addExpense } from '../src/storage/expenseStorage';
import { useApp } from '../src/context/AppContext';

const EXPENSE_CATS = ['🍔 Food','🚗 Transport','🛍 Shopping','💡 Bills','💊 Health','📦 Other'];
const INCOME_CATS  = ['💰 Salary','🪙 Pocket Money','🎁 Gift','📈 Investment','📦 Other'];

export default function AddExpense() {
  const router = useRouter();
  const { defaultType } = useLocalSearchParams();
  const { currency, theme } = useApp();
  const s = makeStyles(theme);

  const [type, setType]         = useState(defaultType || 'expense');
  const [amount, setAmount]     = useState('');
  const [note, setNote]         = useState('');
  const [category, setCategory] = useState(defaultType === 'income' ? '💰 Salary' : '🍔 Food');
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  async function save() {
    if (!amount || parseFloat(amount) <= 0) return Alert.alert('Error', 'Enter a valid amount.');
    await addExpense({ amount: parseFloat(amount), note, category, date, type });
    router.back();
  }

  return (
    <ScrollView style={s.container}>
      <Text style={s.heading}>New Transaction</Text>

      {/* Type Toggle */}
      <View style={s.typeRow}>
        <TouchableOpacity
          style={[s.typeBtn, type === 'expense' && s.typeBtnExpense]}
          onPress={() => { setType('expense'); setCategory('🍔 Food'); }}
        >
          <Text style={[s.typeBtnTxt, type === 'expense' && { color: '#ff6584' }]}>↓ Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.typeBtn, type === 'income' && s.typeBtnIncome]}
          onPress={() => { setType('income'); setCategory('💰 Salary'); }}
        >
          <Text style={[s.typeBtnTxt, type === 'income' && { color: '#00d4aa' }]}>↑ Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.label}>Amount ({currency.symbol})</Text>
      <TextInput
        style={s.input} keyboardType="numeric"
        placeholder="e.g. 450" placeholderTextColor={theme.muted}
        value={amount} onChangeText={setAmount}
      />

      <Text style={s.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={s.input} placeholder="2026-04-13"
        placeholderTextColor={theme.muted} value={date} onChangeText={setDate}
      />

      <Text style={s.label}>Category</Text>
      <View style={s.catRow}>
        {cats.map(c => (
          <TouchableOpacity
            key={c}
            style={[s.cat, category === c && (type === 'income' ? s.catOnIncome : s.catOnExpense)]}
            onPress={() => setCategory(c)}
          >
            <Text style={[s.catTxt, category === c && s.catTxtOn]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>Note (optional)</Text>
      <TextInput
        style={[s.input, { height: 80 }]}
        placeholder="e.g. Monthly allowance"
        placeholderTextColor={theme.muted}
        value={note} onChangeText={setNote} multiline
      />

      <TouchableOpacity
        style={[s.saveBtn, { backgroundColor: type === 'income' ? '#00d4aa' : '#6c63ff' }]}
        onPress={save}
      >
        <Text style={s.saveTxt}>💾 Save {type === 'income' ? 'Income' : 'Expense'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container:      { flex: 1, backgroundColor: theme.bg, padding: 20 },
    heading:        { fontSize: 24, fontWeight: '800', color: theme.text, marginBottom: 20, marginTop: 8 },
    typeRow:        { flexDirection: 'row', gap: 12, marginBottom: 8 },
    typeBtn:        { flex: 1, padding: 14, borderRadius: 14, backgroundColor: theme.surface, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    typeBtnExpense: { borderColor: '#ff6584', backgroundColor: '#ff658422' },
    typeBtnIncome:  { borderColor: '#00d4aa', backgroundColor: '#00d4aa22' },
    typeBtnTxt:     { fontSize: 15, fontWeight: '700', color: theme.muted },
    label:          { fontSize: 13, fontWeight: '600', color: theme.muted, marginTop: 20, marginBottom: 8, letterSpacing: 0.5 },
    input:          { backgroundColor: theme.surface, borderRadius: 14, padding: 16, fontSize: 16, borderWidth: 1, borderColor: theme.border, color: theme.text },
    catRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    cat:            { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: theme.surface, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
    catOnExpense:   { backgroundColor: '#6c63ff22', borderColor: '#6c63ff' },
    catOnIncome:    { backgroundColor: '#00d4aa22', borderColor: '#00d4aa' },
    catTxt:         { fontSize: 13, color: theme.muted },
    catTxtOn:       { color: theme.text, fontWeight: '700' },
    saveBtn:        { borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 32, marginBottom: 40 },
    saveTxt:        { color: '#fff', fontSize: 16, fontWeight: '800' },
  });
}