import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TRANSACTIONS: '@penny_transactions',
  BUDGETS: '@penny_budgets',
  SETTINGS: '@penny_settings',
  SUBSCRIPTIONS: '@penny_subscriptions',
};

export const saveTransactions = async (t) => { try { await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(t)); } catch (e) { console.error(e); } };
export const loadTransactions = async () => { try { const d = await AsyncStorage.getItem(KEYS.TRANSACTIONS); return d ? JSON.parse(d) : []; } catch (e) { return []; } };

export const saveBudgets = async (b) => { try { await AsyncStorage.setItem(KEYS.BUDGETS, JSON.stringify(b)); } catch (e) { console.error(e); } };
export const loadBudgets = async () => { try { const d = await AsyncStorage.getItem(KEYS.BUDGETS); return d ? JSON.parse(d) : {}; } catch (e) { return {}; } };

export const saveSettings = async (s) => { try { await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)); } catch (e) { console.error(e); } };
export const loadSettings = async () => { try { const d = await AsyncStorage.getItem(KEYS.SETTINGS); return d ? JSON.parse(d) : { currency: '₹', currencyName: 'INR — Indian Rupee' }; } catch (e) { return { currency: '₹', currencyName: 'INR — Indian Rupee' }; } };

export const saveSubscriptions = async (s) => { try { await AsyncStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(s)); } catch (e) { console.error(e); } };
export const loadSubscriptions = async () => { try { const d = await AsyncStorage.getItem(KEYS.SUBSCRIPTIONS); return d ? JSON.parse(d) : []; } catch (e) { return []; } };

export const clearAllData = async () => { try { await AsyncStorage.multiRemove(Object.values(KEYS)); } catch (e) { console.error(e); } };
