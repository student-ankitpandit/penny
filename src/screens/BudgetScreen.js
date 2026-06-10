import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { getMonthlySpendingByCategory, formatAmount } from '../utils/calculations';

const BudgetScreen = () => {
  const { budgets, setBudget, transactions, settings } = useExpense();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const spending = getMonthlySpendingByCategory(transactions);
  const activeBudgets = EXPENSE_CATEGORIES.filter((c) => budgets[c.id]);
  const remaining = EXPENSE_CATEGORIES.filter((c) => !budgets[c.id]);
  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent = activeBudgets.reduce((s, c) => s + (spending[c.id] || 0), 0);

  const openModal = (cat) => { setSelectedCat(cat); setBudgetInput(budgets[cat.id] ? String(budgets[cat.id]) : ''); setModalVisible(true); };
  const handleSave = () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) { Alert.alert('Error', 'Enter a valid amount'); return; }
    setBudget(selectedCat.id, val);
    setModalVisible(false);
  };

  const BudgetItem = ({ cat }) => {
    const spent = spending[cat.id] || 0;
    const limit = budgets[cat.id] || 0;
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const over = spent > limit;
    return (
      <TouchableOpacity style={styles.budgetCard} onPress={() => openModal(cat)}>
        <View style={styles.budgetHeader}>
          <View style={[styles.catIcon, { backgroundColor: `${cat.color}22` }]}><Ionicons name={cat.icon} size={18} color={cat.color} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.catName}>{cat.label}</Text>
            <Text style={styles.budgetMeta}>{formatAmount(spent, settings.currency)} of {formatAmount(limit, settings.currency)}</Text>
          </View>
          <Text style={[styles.budgetPct, { color: over ? COLORS.expense : COLORS.textSecondary }]}>{pct.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: over ? COLORS.expense : COLORS.accent }]} />
        </View>
        {over ? <Text style={styles.overBudget}>Over budget by {formatAmount(spent - limit, settings.currency)}</Text>
          : <Text style={styles.remaining}>{formatAmount(limit - spent, settings.currency)} remaining</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Budget</Text>
        {totalBudget > 0 && (
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View><Text style={styles.overviewLabel}>Total Monthly Budget</Text><Text style={styles.overviewAmt}>{formatAmount(totalBudget, settings.currency)}</Text></View>
              <View style={{ alignItems: 'flex-end' }}><Text style={styles.overviewLabel}>Spent</Text><Text style={[styles.overviewAmt, { color: COLORS.income }]}>{formatAmount(totalSpent, settings.currency)}</Text></View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, backgroundColor: totalSpent > totalBudget ? COLORS.expense : COLORS.accent }]} />
            </View>
          </View>
        )}
        {activeBudgets.length > 0 && (<><Text style={styles.sectionTitle}>Active Budgets</Text>{activeBudgets.map((cat) => <BudgetItem key={cat.id} cat={cat} />)}</>)}
        {remaining.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Add More Budgets</Text>
            {remaining.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.addCard} onPress={() => openModal(cat)}>
                <View style={[styles.catIcon, { backgroundColor: `${cat.color}22` }]}><Ionicons name={cat.icon} size={18} color={cat.color} /></View>
                <Text style={styles.catName}>{cat.label}</Text>
                <Ionicons name="add-circle-outline" size={22} color={COLORS.accent} />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Budget — {selectedCat?.label}</Text>
            <TextInput style={styles.modalInput} value={budgetInput} onChangeText={setBudgetInput} keyboardType="decimal-pad" placeholder="Enter amount" placeholderTextColor={COLORS.textMuted} autoFocus />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Save Budget</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800', marginBottom: SPACING.lg },
  overviewCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  overviewLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  overviewAmt: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '800', marginTop: 2 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md, marginTop: SPACING.sm },
  budgetCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  budgetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  catIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  catName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  budgetMeta: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  budgetPct: { fontSize: FONTS.sizes.md, fontWeight: '700' },
  progressBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  overBudget: { color: COLORS.expense, fontSize: FONTS.sizes.xs, marginTop: 4, fontWeight: '600' },
  remaining: { color: COLORS.income, fontSize: FONTS.sizes.xs, marginTop: 4, fontWeight: '600' },
  addCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.lg },
  modalInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.lg, color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '700', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  modalBtns: { flexDirection: 'row', gap: SPACING.md },
  cancelBtn: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  saveBtn: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.accent, alignItems: 'center' },
  saveBtnText: { color: COLORS.white, fontWeight: '700' },
});

export default BudgetScreen;
