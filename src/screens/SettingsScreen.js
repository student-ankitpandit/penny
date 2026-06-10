import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';

const CURRENCIES = [
  { symbol: '₹', name: 'INR — Indian Rupee' },
  { symbol: '$', name: 'USD — US Dollar' },
  { symbol: '€', name: 'EUR — Euro' },
  { symbol: '£', name: 'GBP — British Pound' },
  { symbol: '¥', name: 'JPY — Japanese Yen' },
  { symbol: '₩', name: 'KRW — South Korean Won' },
  { symbol: 'A$', name: 'AUD — Australian Dollar' },
  { symbol: 'C$', name: 'CAD — Canadian Dollar' },
  { symbol: 'Fr', name: 'CHF — Swiss Franc' },
  { symbol: 'AED', name: 'AED — UAE Dirham' },
];

const SettingsScreen = () => {
  const { transactions, subscriptions, updateSettings, settings, clearAll } = useExpense();
  const [currencyModal, setCurrencyModal] = useState(false);

  const handleClear = () => Alert.alert('Clear All Data', 'This will permanently delete all transactions and budgets. This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear All', style: 'destructive', onPress: clearAll },
  ]);

  const Row = ({ icon, iconColor, label, value, onPress, danger }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}22` }]}><Ionicons name={icon} size={18} color={iconColor} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: COLORS.expense }]}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Stats */}
        <View style={styles.statsCard}>
          {[
            { label: 'Total Transactions', value: String(transactions.length) },
            { label: 'Income', value: String(transactions.filter((t) => t.type === 'income').length) },
            { label: 'Expenses', value: String(transactions.filter((t) => t.type === 'expense').length) },
            { label: 'Subscriptions', value: String(subscriptions.length) },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <Row icon="cash-outline" iconColor={COLORS.income} label="Currency" value={`${settings.currency} — ${settings.currencyName}`} onPress={() => setCurrencyModal(true)} />
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.section}>
          <Row icon="trash-outline" iconColor={COLORS.expense} label="Clear All Data" onPress={handleClear} danger />
        </View>

        <Text style={styles.appVersion}>Penny v1.0.0</Text>
      </ScrollView>

      <Modal visible={currencyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity key={c.symbol} style={[styles.currencyRow, settings.currency === c.symbol && styles.currencyRowActive]} onPress={() => { updateSettings({ currency: c.symbol, currencyName: c.name }); setCurrencyModal(false); }}>
                  <Text style={styles.currencySymbol}>{c.symbol}</Text>
                  <Text style={styles.currencyName}>{c.name}</Text>
                  {settings.currency === c.symbol && <Ionicons name="checkmark" size={18} color={COLORS.accent} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setCurrencyModal(false)}><Text style={styles.closeModalText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 48 },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: SPACING.lg },
  statsCard: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  statItem: { width: '45%' },
  statValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  sectionTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md },
  section: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  rowLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  rowValue: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  appVersion: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'center', marginTop: SPACING.xl },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, maxHeight: '70%', borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.lg },
  currencyRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.xs },
  currencyRowActive: { backgroundColor: `${COLORS.accent}22` },
  currencySymbol: { color: COLORS.accent, fontSize: FONTS.sizes.lg, fontWeight: '700', width: 40 },
  currencyName: { flex: 1, color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  closeModalBtn: { marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  closeModalText: { color: COLORS.textPrimary, fontWeight: '600' },
});

export default SettingsScreen;
