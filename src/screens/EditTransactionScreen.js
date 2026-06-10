import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import { useExpense } from '../context/ExpenseContext';
import { format, addDays, subDays, parseISO } from 'date-fns';

const EditTransactionScreen = ({ navigation, route }) => {
  const { transaction } = route.params;
  const { updateTransaction, deleteTransaction, settings } = useExpense();
  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [category, setCategory] = useState(transaction.category);
  const [note, setNote] = useState(transaction.note || '');
  const [date, setDate] = useState(typeof transaction.date === 'string' ? parseISO(transaction.date) : new Date(transaction.date));

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    if (!category) { Alert.alert('Error', 'Please select a category'); return; }
    updateTransaction({ ...transaction, type, amount: parseFloat(amount), category, note: note.trim(), date: date.toISOString() });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteTransaction(transaction.id); navigation.goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}><Ionicons name="close" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
          <Text style={styles.title}>Edit Transaction</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.typeRow}>
            {['expense', 'income'].map((t) => (
              <TouchableOpacity key={t} style={[styles.typeBtn, type === t && (t === 'expense' ? styles.expenseActive : styles.incomeActive)]} onPress={() => { setType(t); setCategory(''); }}>
                <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>{settings.currency}</Text>
            <TextInput style={styles.amountInput} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholderTextColor={COLORS.textMuted} />
          </View>
          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.catItem, category === cat.id && { borderColor: cat.color, backgroundColor: `${cat.color}22` }]} onPress={() => setCategory(cat.id)}>
                <Ionicons name={cat.icon} size={22} color={cat.color} />
                <Text style={[styles.catLabel, { color: category === cat.id ? cat.color : COLORS.textSecondary }]} numberOfLines={1}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>DATE</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setDate(subDays(date, 1))} style={styles.dateArrow}><Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} /></TouchableOpacity>
            <View style={styles.dateCenter}><Ionicons name="calendar-outline" size={16} color={COLORS.accent} /><Text style={styles.dateText}>{format(date, 'EEEE, MMM d yyyy')}</Text></View>
            <TouchableOpacity onPress={() => setDate(addDays(date, 1))} style={styles.dateArrow}><Ionicons name="chevron-forward" size={20} color={COLORS.textPrimary} /></TouchableOpacity>
          </View>
          <Text style={styles.label}>NOTE (OPTIONAL)</Text>
          <TextInput style={styles.noteInput} value={note} onChangeText={setNote} placeholder="Add a note..." placeholderTextColor={COLORS.textMuted} multiline />
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
            <Text style={styles.deleteBtnText}>Delete Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  closeBtn: { padding: 4 },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  saveBtn: { backgroundColor: COLORS.accent, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  saveBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  content: { padding: SPACING.lg, paddingBottom: 48 },
  typeRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 4, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  typeBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: RADIUS.md },
  expenseActive: { backgroundColor: COLORS.expense },
  incomeActive: { backgroundColor: COLORS.income },
  typeBtnText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: FONTS.sizes.md },
  typeBtnTextActive: { color: COLORS.white },
  label: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md },
  amountRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  currencySymbol: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xl, marginRight: SPACING.sm },
  amountInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONTS.sizes.xxxl, fontWeight: '700', paddingVertical: SPACING.md },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  catItem: { width: '30%', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  catLabel: { fontSize: FONTS.sizes.xs, marginTop: 4, textAlign: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  dateArrow: { padding: SPACING.md },
  dateCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  dateText: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  noteInput: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, color: COLORS.textPrimary, fontSize: FONTS.sizes.md, borderWidth: 1, borderColor: COLORS.border, minHeight: 80, textAlignVertical: 'top' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.xl, padding: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.expense },
  deleteBtnText: { color: COLORS.expense, fontWeight: '600', fontSize: FONTS.sizes.md },
});

export default EditTransactionScreen;
