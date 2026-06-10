import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';
import { getTotalIncome, getTotalExpense, getBalance, filterByPeriod, formatAmount } from '../utils/calculations';
import TransactionCard from '../components/TransactionCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { format } from 'date-fns';

const HomeScreen = ({ navigation }) => {
  const { transactions, settings } = useExpense();
  const recent = transactions.slice(0, 5);
  const monthly = filterByPeriod(transactions, 'month');
  const balance = getBalance(transactions);
  const income = getTotalIncome(monthly);
  const expense = getTotalExpense(monthly);
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const handleNotificationPress = () => {
    if (expense > income) {
      Alert.alert(
        'Budget Alert',
        `Watch out! Your expenses (${formatAmount(expense, settings.currency)}) have surpassed your income (${formatAmount(income, settings.currency)}) this month.`
      );
    } else {
      Alert.alert(
        'All Good!',
        'Your expenses are currently within your income for this month. Great job!'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.date}>{format(now, 'EEEE, MMM d yyyy')}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
            {expense > income && (
              <View style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.expense }} />
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: balance >= 0 ? COLORS.income : COLORS.expense }]}>{formatAmount(balance, settings.currency)}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: COLORS.incomeBg }]}><Ionicons name="arrow-down" size={14} color={COLORS.income} /></View>
              <View><Text style={styles.summaryLabel}>Income</Text><Text style={[styles.summaryAmt, { color: COLORS.income }]}>{formatAmount(income, settings.currency)}</Text></View>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: COLORS.expenseBg }]}><Ionicons name="arrow-up" size={14} color={COLORS.expense} /></View>
              <View><Text style={styles.summaryLabel}>Expenses</Text><Text style={[styles.summaryAmt, { color: COLORS.expense }]}>{formatAmount(expense, settings.currency)}</Text></View>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No transactions yet.</Text>
            <Text style={styles.emptySubText}>Tap + to add your first transaction.</Text>
          </View>
        ) : (
          recent.map((t) => <TransactionCard key={t.id} transaction={t} currency={settings.currency} onPress={() => navigation.navigate('EditTransaction', { transaction: t })} />)
        )}
      </ScrollView>
      <FloatingActionButton onPress={() => navigation.navigate('AddTransaction')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  greeting: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  date: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  notifBtn: { padding: 8, backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  balanceCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  balanceLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: '600', marginBottom: 8 },
  balanceAmount: { fontSize: FONTS.sizes.hero, fontWeight: '800', marginBottom: SPACING.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  summaryIcon: { width: 32, height: 32, borderRadius: RADIUS.sm, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs },
  summaryAmt: { fontSize: FONTS.sizes.md, fontWeight: '700' },
  divider: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  seeAll: { color: COLORS.accent, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: SPACING.md, fontWeight: '600' },
  emptySubText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: 4 },
});

export default HomeScreen;
