import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';
import { getTotalIncome, getTotalExpense, getMonthlyData, getCategoryBreakdown, filterByPeriod, formatAmount } from '../utils/calculations';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.lg * 2 - 16;

const AnalyticsScreen = () => {
  const { transactions, settings } = useExpense();
  const monthly = filterByPeriod(transactions, 'month');
  const totalIncome = getTotalIncome(monthly);
  const totalExpense = getTotalExpense(monthly);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(0) : 0;
  const monthlyData = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(monthly);

  const CHART_COLORS = ['#6C63FF', '#00D09C', '#FF6B6B', '#FBBF24', '#60A5FA', '#F472B6', '#34D399', '#FF8C42'];

  const pieData = breakdown.slice(0, 6).map((item, i) => ({
    name: getCategoryLabel(item.category),
    amount: item.amount,
    color: CHART_COLORS[i % CHART_COLORS.length],
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 12,
  }));

  const chartConfig = { backgroundColor: COLORS.card, backgroundGradientFrom: COLORS.card, backgroundGradientTo: COLORS.card, decimalPlaces: 0, color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`, labelColor: () => COLORS.textSecondary, barPercentage: 0.6 };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Analytics</Text>

        {/* Summary Cards */}
        <View style={styles.statsRow}>
          {[
            { label: 'Income', value: formatAmount(totalIncome, settings.currency), color: COLORS.income },
            { label: 'Expenses', value: formatAmount(totalExpense, settings.currency), color: COLORS.expense },
            { label: 'Savings Rate', value: `${savingsRate}%`, color: COLORS.accent },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Expenses</Text>
          {monthlyData.some((d) => d.expense > 0) ? (
            <BarChart
              data={{ labels: monthlyData.map((d) => d.label), datasets: [{ data: monthlyData.map((d) => d.expense) }] }}
              width={CHART_WIDTH} height={180} chartConfig={chartConfig}
              style={styles.chart} withInnerLines={false} showValuesOnTopOfBars={false}
            />
          ) : <View style={styles.noData}><Text style={styles.noDataText}>No expense data yet</Text></View>}
        </View>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            <PieChart data={pieData} width={CHART_WIDTH} height={180} chartConfig={chartConfig} accessor="amount" backgroundColor="transparent" paddingLeft="15" />
          </View>
        )}

        {/* Top Categories */}
        {breakdown.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Top Categories</Text>
            {breakdown.slice(0, 5).map((item, i) => (
              <View key={item.category} style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }]} />
                <Text style={styles.catName}>{getCategoryLabel(item.category)}</Text>
                <Text style={styles.catPct}>{item.percentage}%</Text>
                <Text style={styles.catAmt}>{formatAmount(item.amount, settings.currency)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: FONTS.sizes.md, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  chartCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700', marginBottom: SPACING.md },
  chart: { borderRadius: RADIUS.md, marginLeft: -SPACING.md },
  noData: { height: 100, justifyContent: 'center', alignItems: 'center' },
  noDataText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  catDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
  catName: { flex: 1, color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  catPct: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginRight: SPACING.md },
  catAmt: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '700' },
});

export default AnalyticsScreen;
