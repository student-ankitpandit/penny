import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { useExpense } from '../context/ExpenseContext';
import { CODING_TOOLS, SUBSCRIPTION_CATEGORIES } from '../utils/subscriptions';
import { formatAmount } from '../utils/calculations';

const SubscriptionsScreen = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, settings } = useExpense();
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.price / 12 : s.price), 0);
  const totalYearly = subscriptions.reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.price : s.price * 12), 0);

  const activeSubs = subscriptions.filter((s) => s.active !== false);

  const handleAddTool = () => {
    if (!selectedTool) return;
    const price = parseFloat(customPrice) || selectedTool.defaultPrice;
    if (isNaN(price) || price < 0) { Alert.alert('Error', 'Enter a valid price'); return; }
    const existing = subscriptions.find((s) => s.toolId === selectedTool.id);
    if (existing) { Alert.alert('Already Added', `${selectedTool.name} is already in your subscriptions.`); return; }
    addSubscription({
      toolId: selectedTool.id,
      name: selectedTool.name,
      provider: selectedTool.provider,
      icon: selectedTool.icon,
      color: selectedTool.color,
      category: selectedTool.category,
      price,
      cycle: selectedTool.cycle,
      active: true,
    });
    setAddModal(false);
    setSelectedTool(null);
    setCustomPrice('');
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Subscription', 'Remove this subscription from your tracker?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { deleteSubscription(id); setDetailModal(false); } },
    ]);
  };

  const toggleActive = (sub) => {
    updateSubscription({ ...sub, active: !sub.active });
    setDetailModal(false);
  };

  const filteredTools = filterCat === 'All' ? CODING_TOOLS : CODING_TOOLS.filter((t) => t.category === filterCat);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Subscriptions</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryGlow} />
          <Text style={styles.summaryLabel}>Monthly Cost</Text>
          <Text style={styles.summaryAmount}>{formatAmount(totalMonthly, settings.currency)}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.summaryItemText}>Yearly: {formatAmount(totalYearly, settings.currency)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="apps-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.summaryItemText}>{subscriptions.length} tools</Text>
            </View>
          </View>
        </View>

        {/* Active Subscriptions */}
        {subscriptions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="card-outline" size={56} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Subscriptions Yet</Text>
            <Text style={styles.emptyText}>Track your AI & coding tools subscriptions</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setAddModal(true)}>
              <Text style={styles.emptyAddBtnText}>Add Subscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Tools</Text>
            {subscriptions.map((sub) => (
              <TouchableOpacity key={sub.id} style={[styles.subCard, !sub.active && styles.subCardInactive]}
                onPress={() => { setSelectedSub(sub); setDetailModal(true); }} activeOpacity={0.75}>
                <View style={[styles.subIcon, { backgroundColor: `${sub.color}22` }]}>
                  <Ionicons name={sub.icon} size={22} color={sub.active !== false ? sub.color : COLORS.textMuted} />
                </View>
                <View style={styles.subInfo}>
                  <View style={styles.subNameRow}>
                    <Text style={[styles.subName, !sub.active && styles.textInactive]}>{sub.name}</Text>
                    {!sub.active && <View style={styles.pausedBadge}><Text style={styles.pausedText}>Paused</Text></View>}
                  </View>
                  <Text style={styles.subProvider}>{sub.provider} · {sub.category}</Text>
                </View>
                <View style={styles.subPriceWrap}>
                  <Text style={[styles.subPrice, !sub.active && styles.textInactive]}>{formatAmount(sub.price, settings.currency)}</Text>
                  <Text style={styles.subCycle}>/{sub.cycle === 'yearly' ? 'yr' : 'mo'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={addModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Coding Tool</Text>
              <TouchableOpacity onPress={() => { setAddModal(false); setSelectedTool(null); setCustomPrice(''); }}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catFilter} contentContainerStyle={{ gap: SPACING.sm }}>
              {['All', ...SUBSCRIPTION_CATEGORIES].map((cat) => (
                <TouchableOpacity key={cat} style={[styles.catChip, filterCat === cat && styles.catChipActive]} onPress={() => setFilterCat(cat)}>
                  <Text style={[styles.catChipText, filterCat === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={filteredTools}
              keyExtractor={(item) => item.id}
              style={styles.toolList}
              renderItem={({ item }) => {
                const alreadyAdded = subscriptions.some((s) => s.toolId === item.id);
                return (
                  <TouchableOpacity
                    style={[styles.toolRow, selectedTool?.id === item.id && styles.toolRowSelected, alreadyAdded && styles.toolRowAdded]}
                    onPress={() => { if (!alreadyAdded) { setSelectedTool(item); setCustomPrice(String(item.defaultPrice)); } }}
                    activeOpacity={alreadyAdded ? 1 : 0.7}
                  >
                    <View style={[styles.toolIcon, { backgroundColor: `${item.color}22` }]}>
                      <Ionicons name={item.icon} size={20} color={alreadyAdded ? COLORS.textMuted : item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.toolName, alreadyAdded && styles.textInactive]}>{item.name}</Text>
                      <Text style={styles.toolProvider}>{item.provider} · {item.category}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      {alreadyAdded ? (
                        <View style={styles.addedBadge}><Text style={styles.addedText}>Added</Text></View>
                      ) : (
                        <>
                          <Text style={styles.toolPrice}>${item.defaultPrice}</Text>
                          <Text style={styles.toolCycle}>/{item.cycle === 'yearly' ? 'yr' : 'mo'}</Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            {selectedTool && (
              <View style={styles.priceEditRow}>
                <View style={styles.priceEditLeft}>
                  <Text style={styles.priceEditLabel}>Monthly price for {selectedTool.name}</Text>
                  <Text style={styles.priceEditHint}>Edit if your plan differs</Text>
                </View>
                <View style={styles.priceInputWrap}>
                  <Text style={styles.priceCurrency}>{settings.currency}</Text>
                  <TextInput style={styles.priceInput} value={customPrice} onChangeText={setCustomPrice} keyboardType="decimal-pad" />
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.confirmBtn, !selectedTool && styles.confirmBtnDisabled]} onPress={handleAddTool} disabled={!selectedTool}>
              <Text style={styles.confirmBtnText}>Add {selectedTool?.name || 'Tool'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, styles.detailModal]}>
            {selectedSub && (
              <>
                <View style={[styles.detailIcon, { backgroundColor: `${selectedSub.color}22` }]}>
                  <Ionicons name={selectedSub.icon} size={36} color={selectedSub.color} />
                </View>
                <Text style={styles.detailName}>{selectedSub.name}</Text>
                <Text style={styles.detailProvider}>{selectedSub.provider} · {selectedSub.category}</Text>
                <View style={styles.detailAmounts}>
                  <View style={styles.detailAmtItem}>
                    <Text style={styles.detailAmtLabel}>Monthly</Text>
                    <Text style={styles.detailAmtValue}>{formatAmount(selectedSub.cycle === 'yearly' ? selectedSub.price / 12 : selectedSub.price, settings.currency)}</Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailAmtItem}>
                    <Text style={styles.detailAmtLabel}>Yearly</Text>
                    <Text style={styles.detailAmtValue}>{formatAmount(selectedSub.cycle === 'yearly' ? selectedSub.price : selectedSub.price * 12, settings.currency)}</Text>
                  </View>
                </View>
                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.detailActionBtn} onPress={() => toggleActive(selectedSub)}>
                    <Ionicons name={selectedSub.active !== false ? 'pause-circle-outline' : 'play-circle-outline'} size={20} color={COLORS.accent} />
                    <Text style={styles.detailActionText}>{selectedSub.active !== false ? 'Pause' : 'Resume'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.detailActionBtn, styles.detailDeleteBtn]} onPress={() => handleDelete(selectedSub.id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
                    <Text style={[styles.detailActionText, { color: COLORS.expense }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.closeDetailBtn} onPress={() => setDetailModal(false)}>
                  <Text style={styles.closeDetailText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.accent, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  summaryCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', position: 'relative' },
  summaryGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: `${COLORS.accent}20` },
  summaryLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, marginBottom: 4 },
  summaryAmount: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxxl, fontWeight: '800', marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', gap: SPACING.xl },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  summaryItemText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', marginBottom: SPACING.md },
  subCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  subCardInactive: { opacity: 0.5 },
  subIcon: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  subInfo: { flex: 1 },
  subNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  subName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  subProvider: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  subPriceWrap: { alignItems: 'flex-end' },
  subPrice: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '800' },
  subCycle: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  textInactive: { color: COLORS.textMuted },
  pausedBadge: { backgroundColor: `${COLORS.bills}22`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  pausedText: { color: COLORS.bills, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', marginTop: SPACING.lg },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: 4, textAlign: 'center' },
  emptyAddBtn: { marginTop: SPACING.xl, backgroundColor: COLORS.accent, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.full },
  emptyAddBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.lg, maxHeight: '85%', borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  catFilter: { marginBottom: SPACING.md, maxHeight: 40 },
  catChip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  catChipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  catChipTextActive: { color: COLORS.white },
  toolList: { maxHeight: 300 },
  toolRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderRadius: RADIUS.lg, marginBottom: SPACING.xs },
  toolRowSelected: { backgroundColor: `${COLORS.accent}18`, borderWidth: 1, borderColor: COLORS.accent },
  toolRowAdded: { opacity: 0.5 },
  toolIcon: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  toolName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  toolProvider: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  toolPrice: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '700' },
  toolCycle: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  addedBadge: { backgroundColor: `${COLORS.income}22`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  addedText: { color: COLORS.income, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  priceEditRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, marginVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.accent },
  priceEditLeft: { flex: 1 },
  priceEditLabel: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  priceEditHint: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  priceInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.md, paddingHorizontal: SPACING.sm },
  priceCurrency: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  priceInput: { color: COLORS.textPrimary, fontSize: FONTS.sizes.lg, fontWeight: '700', width: 70, textAlign: 'right', padding: SPACING.sm },
  confirmBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  confirmBtnDisabled: { backgroundColor: COLORS.border },
  confirmBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  // Detail Modal
  detailModal: { alignItems: 'center', paddingVertical: SPACING.xl },
  detailIcon: { width: 72, height: 72, borderRadius: RADIUS.xl, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  detailName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '800', marginBottom: 4 },
  detailProvider: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginBottom: SPACING.xl },
  detailAmounts: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.lg, width: '100%', marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  detailAmtItem: { flex: 1, alignItems: 'center' },
  detailAmtLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  detailAmtValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '800', marginTop: 4 },
  detailDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg },
  detailActions: { flexDirection: 'row', gap: SPACING.md, width: '100%', marginBottom: SPACING.md },
  detailActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: `${COLORS.accent}18`, borderWidth: 1, borderColor: COLORS.accent },
  detailDeleteBtn: { backgroundColor: `${COLORS.expense}18`, borderColor: COLORS.expense },
  detailActionText: { color: COLORS.accent, fontWeight: '700', fontSize: FONTS.sizes.sm },
  closeDetailBtn: { width: '100%', padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  closeDetailText: { color: COLORS.textPrimary, fontWeight: '600' },
});

export default SubscriptionsScreen;
