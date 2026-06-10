import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';
import { filterByPeriod } from '../utils/calculations';
import TransactionCard from '../components/TransactionCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { format, parseISO } from 'date-fns';

const PERIODS = ['All Time', 'This Month', 'This Week'];
const PERIOD_KEYS = ['all', 'month', 'week'];

const TransactionsScreen = ({ navigation }) => {
  const { transactions, settings } = useExpense();
  const [search, setSearch] = useState('');
  const [periodIdx, setPeriodIdx] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');

  let filtered = filterByPeriod(transactions, PERIOD_KEYS[periodIdx]);
  if (typeFilter !== 'all') filtered = filtered.filter((t) => t.type === typeFilter);
  if (search.trim()) filtered = filtered.filter((t) => (t.note || '').toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  // Group by date
  const groups = {};
  filtered.forEach((t) => {
    const d = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
    const key = format(d, 'MMM d, yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  const sections = Object.entries(groups).map(([title, data]) => ({ title, data }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Transactions</Text></View>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Search transactions..." placeholderTextColor={COLORS.textMuted} />
      </View>
      {/* Period */}
      <View style={[styles.periodRow, { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingHorizontal: SPACING.lg, justifyContent: 'center' }]}>
        {PERIODS.map((p, i) => (
          <TouchableOpacity key={p} style={[styles.periodChip, periodIdx === i && styles.periodChipActive]} onPress={() => setPeriodIdx(i)}>
            <Text style={[styles.periodText, periodIdx === i && styles.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Type filter */}
      <View style={styles.typeRow}>
        {['all', 'income', 'expense'].map((t) => (
          <TouchableOpacity key={t} style={[styles.typeBtn, typeFilter === t && styles.typeBtnActive]} onPress={() => setTypeFilter(t)}>
            <Text style={[styles.typeBtnText, typeFilter === t && styles.typeBtnTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {sections.length === 0 ? (
        <View style={styles.empty}><Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} /><Text style={styles.emptyText}>No transactions found</Text></View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderSectionHeader={({ section }) => <Text style={styles.dateHeader}>{section.title}</Text>}
          renderItem={({ item }) => <TransactionCard transaction={item} currency={settings.currency} onPress={() => navigation.navigate('EditTransaction', { transaction: item })} />}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      <FloatingActionButton onPress={() => navigation.navigate('AddTransaction')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONTS.sizes.md, paddingVertical: SPACING.md },
  periodRow: { flexGrow: 0, marginBottom: SPACING.sm },
  periodChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  periodChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  periodText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  periodTextActive: { color: COLORS.white },
  typeRow: { flexDirection: 'row', marginHorizontal: SPACING.lg, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 3, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  typeBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: RADIUS.md },
  typeBtnActive: { backgroundColor: COLORS.accent },
  typeBtnText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: FONTS.sizes.sm },
  typeBtnTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  dateHeader: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, fontWeight: '700', marginBottom: SPACING.sm, marginTop: SPACING.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: SPACING.md },
});

export default TransactionsScreen;
