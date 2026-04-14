import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, FlatList, Alert } from 'react-native';
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useApp, CURRENCIES } from '../../src/context/AppContext';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID'; // replace this later

export default function Settings() {
  const { isDark, setIsDark, currency, setCurrency, gcalToken, setGcalToken, theme } = useApp();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const s = makeStyles(theme);

  // Google OAuth
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  async function connectGoogle() {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_WEB_CLIENT_ID') {
      Alert.alert('Setup Required', 'Add your Google Client ID in settings.js to enable Calendar sync.');
      return;
    }
    const result = await promptAsync();
    if (result?.type === 'success') {
      setGcalToken(result.authentication?.accessToken);
      Alert.alert('✅ Connected!', 'Google Calendar is now linked.');
    }
  }

  function disconnectGoogle() {
    setGcalToken(null);
    Alert.alert('Disconnected', 'Google Calendar has been unlinked.');
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Settings</Text>

      {/* INTEGRATIONS */}
      <Text style={s.sectionLabel}>INTEGRATIONS</Text>
      <TouchableOpacity style={s.row} onPress={gcalToken ? disconnectGoogle : connectGoogle}>
        <Text style={s.rowIcon}>🗓️</Text>
        <View style={s.rowInfo}>
          <Text style={s.rowTitle}>Google Calendar</Text>
          <Text style={s.rowSub}>
            {gcalToken ? '✅ Connected — tap to disconnect' : 'Sync expenses as calendar events'}
          </Text>
        </View>
        <View style={[s.badge, { backgroundColor: gcalToken ? '#00d4aa22' : '#6c63ff22' }]}>
          <Text style={[s.badgeTxt, { color: gcalToken ? '#00d4aa' : '#6c63ff' }]}>
            {gcalToken ? 'ON' : 'Connect'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* PREFERENCES */}
      <Text style={s.sectionLabel}>PREFERENCES</Text>

      {/* Currency */}
      <TouchableOpacity style={s.row} onPress={() => setShowCurrencyModal(true)}>
        <Text style={s.rowIcon}>💱</Text>
        <View style={s.rowInfo}>
          <Text style={s.rowTitle}>Currency</Text>
          <Text style={s.rowSub}>{currency.label} ({currency.symbol} {currency.code})</Text>
        </View>
        <Text style={s.arrow}>›</Text>
      </TouchableOpacity>

      {/* Dark Mode Toggle */}
      <View style={s.row}>
        <Text style={s.rowIcon}>{isDark ? '🌙' : '☀️'}</Text>
        <View style={s.rowInfo}>
          <Text style={s.rowTitle}>Dark Mode</Text>
          <Text style={s.rowSub}>{isDark ? 'Currently dark' : 'Currently light'}</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          trackColor={{ false: '#2a2a3a', true: '#6c63ff' }}
          thumbColor={isDark ? '#fff' : '#8b8b9e'}
        />
      </View>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Select Currency</Text>
            <FlatList
              data={CURRENCIES}
              keyExtractor={c => c.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.currencyRow, currency.code === item.code && s.currencyRowActive]}
                  onPress={() => { setCurrency(item); setShowCurrencyModal(false); }}
                >
                  <Text style={s.currencySymbol}>{item.symbol}</Text>
                  <View>
                    <Text style={s.currencyLabel}>{item.label}</Text>
                    <Text style={s.currencyCode}>{item.code}</Text>
                  </View>
                  {currency.code === item.code && <Text style={s.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={s.closeBtn} onPress={() => setShowCurrencyModal(false)}>
              <Text style={s.closeBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container:       { flex: 1, backgroundColor: theme.bg, padding: 20 },
    title:           { fontSize: 24, fontWeight: '800', color: theme.text, marginBottom: 28, marginTop: 8 },
    sectionLabel:    { fontSize: 11, fontWeight: '800', color: theme.muted, letterSpacing: 1.5, marginBottom: 10, marginTop: 8 },
    row:             { backgroundColor: theme.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: theme.border },
    rowIcon:         { fontSize: 22, marginRight: 14 },
    rowInfo:         { flex: 1 },
    rowTitle:        { fontSize: 15, fontWeight: '600', color: theme.text },
    rowSub:          { fontSize: 12, color: theme.muted, marginTop: 2 },
    arrow:           { fontSize: 22, color: theme.muted },
    badge:           { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeTxt:        { fontSize: 12, fontWeight: '700' },
    modalOverlay:    { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
    modalBox:        { backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '60%' },
    modalTitle:      { fontSize: 18, fontWeight: '800', color: theme.text, marginBottom: 16 },
    currencyRow:     { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 6, backgroundColor: theme.bg },
    currencyRowActive:{ borderWidth: 1, borderColor: '#6c63ff' },
    currencySymbol:  { fontSize: 24, marginRight: 14, width: 36, textAlign: 'center' },
    currencyLabel:   { fontSize: 15, fontWeight: '600', color: theme.text },
    currencyCode:    { fontSize: 12, color: theme.muted },
    checkmark:       { marginLeft: 'auto', fontSize: 18, color: '#6c63ff', fontWeight: '700' },
    closeBtn:        { backgroundColor: '#6c63ff', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 10 },
    closeBtnTxt:     { color: '#fff', fontSize: 16, fontWeight: '700' },
  });
}