import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { loadTransactions, saveTransactions, loadBudgets, saveBudgets, loadSettings, saveSettings, loadSubscriptions, saveSubscriptions, clearAllData } from '../utils/storage';

const initialState = { transactions: [], budgets: {}, settings: { currency: '₹', currencyName: 'INR — Indian Rupee' }, subscriptions: [], loading: true };

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD': return { ...state, ...action.payload, loading: false };
    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION': return { ...state, transactions: state.transactions.map((t) => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION': return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case 'SET_BUDGET': return { ...state, budgets: { ...state.budgets, [action.payload.category]: action.payload.amount } };
    case 'UPDATE_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_SUBSCRIPTION': return { ...state, subscriptions: [action.payload, ...state.subscriptions] };
    case 'UPDATE_SUBSCRIPTION': return { ...state, subscriptions: state.subscriptions.map((s) => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SUBSCRIPTION': return { ...state, subscriptions: state.subscriptions.filter((s) => s.id !== action.payload) };
    case 'CLEAR_ALL': return { ...initialState, loading: false };
    default: return state;
  }
};

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrap = async () => {
      const [transactions, budgets, settings, subscriptions] = await Promise.all([loadTransactions(), loadBudgets(), loadSettings(), loadSubscriptions()]);
      dispatch({ type: 'LOAD', payload: { transactions, budgets, settings, subscriptions } });
    };
    bootstrap();
  }, []);

  useEffect(() => { if (!state.loading) saveTransactions(state.transactions); }, [state.transactions, state.loading]);
  useEffect(() => { if (!state.loading) saveBudgets(state.budgets); }, [state.budgets, state.loading]);
  useEffect(() => { if (!state.loading) saveSettings(state.settings); }, [state.settings, state.loading]);
  useEffect(() => { if (!state.loading) saveSubscriptions(state.subscriptions); }, [state.subscriptions, state.loading]);

  const addTransaction = useCallback((t) => dispatch({ type: 'ADD_TRANSACTION', payload: { ...t, id: uuidv4(), createdAt: new Date().toISOString() } }), []);
  const updateTransaction = useCallback((t) => dispatch({ type: 'UPDATE_TRANSACTION', payload: t }), []);
  const deleteTransaction = useCallback((id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }), []);
  const setBudget = useCallback((category, amount) => dispatch({ type: 'SET_BUDGET', payload: { category, amount } }), []);
  const updateSettings = useCallback((s) => dispatch({ type: 'UPDATE_SETTINGS', payload: s }), []);
  const addSubscription = useCallback((s) => dispatch({ type: 'ADD_SUBSCRIPTION', payload: { ...s, id: uuidv4(), createdAt: new Date().toISOString() } }), []);
  const updateSubscription = useCallback((s) => dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: s }), []);
  const deleteSubscription = useCallback((id) => dispatch({ type: 'DELETE_SUBSCRIPTION', payload: id }), []);
  const clearAll = useCallback(async () => { await clearAllData(); dispatch({ type: 'CLEAR_ALL' }); }, []);

  return (
    <ExpenseContext.Provider value={{ ...state, addTransaction, updateTransaction, deleteTransaction, setBudget, updateSettings, addSubscription, updateSubscription, deleteSubscription, clearAll }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpense must be used within ExpenseProvider');
  return ctx;
};
