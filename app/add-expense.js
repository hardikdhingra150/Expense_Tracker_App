import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { addExpense } from '../src/storage/expenseStorage';

const CATS = ['🍔 Food', '🚗 Transport', '🛍 Shopping', '💡 Bills', '💊 Health', '📦 Other'];

export default function AddExpense() {
  const router = useRouter();
  const [amount, setAmount]     = useState('');
  const [note, setNote]         = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);

  async function save() {
    if (!amount || parseFloat(amount) <= 0) return Alert.alert('Error', 'Enter a valid amount.');
    await addExpense({ amount: parseFloat(amount), note, category, date });
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 450" value={amount} onChangeText={setAmount} />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2026-04-13" value={date} onChangeText={setDate} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.catRow}>
        {CATS.map(c => (
          <TouchableOpacity key={c} style={[styles.cat, category === c && styles.catOn]} onPress={() => setCategory(c)}>
            <Text style={[styles.catTxt, category === c && styles.catTxtOn]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput style={[styles.input, { height: 70 }]} placeholder="e.g. Lunch at CP" value={note} onChangeText={setNote} multiline />

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveTxt}>💾 Save Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f2', padding: 20 },
  label:     { fontSize: 14, fontWeight: '600', color: '#7a7974', marginTop: 18, marginBottom: 6 },
  input:     { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#d4d1ca' },
  catRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cat:       { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#d4d1ca' },
  catOn:     { backgroundColor: '#01696f', borderColor: '#01696f' },
  catTxt:    { fontSize: 13, color: '#28251d' },
  catTxtOn:  { color: '#fff', fontWeight: '600' },
  saveBtn:   { backgroundColor: '#01696f', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 28, marginBottom: 40 },
  saveTxt:   { color: '#fff', fontSize: 16, fontWeight: '700' },
});