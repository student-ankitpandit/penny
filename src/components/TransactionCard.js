import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getCategoryIcon, getCategoryColor, getCategoryLabel } from '../utils/categories';
import { formatAmount } from '../utils/calculations';
import { format, parseISO } from 'date-fns';

const TransactionCard = ({ transaction, currency, onPress }) => {
  const { type, category, amount, note, date } = transaction;
  const icon = getCategoryIcon(category);
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);
  const isIncome = type === 'income';
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        {note ? <Text style={styles.note} numberOfLines={1}>{note}</Text> : null}
        <Text style={styles.date}>{format(dateObj, 'MMM d, yyyy')}</Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
        {isIncome ? '+' : '-'} {formatAmount(amount, currency)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  iconWrap: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  info: { flex: 1 },
  label: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  note: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginTop: 2 },
  date: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 3 },
  amount: { fontSize: FONTS.sizes.md, fontWeight: '700' },
});

export default TransactionCard;
