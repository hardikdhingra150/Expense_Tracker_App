import { View, Text, StyleSheet } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.info}>Google Calendar integration — coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f2', padding: 20 },
  title:     { fontSize: 22, fontWeight: '700', color: '#28251d', marginBottom: 12 },
  info:      { fontSize: 15, color: '#7a7974' },
});